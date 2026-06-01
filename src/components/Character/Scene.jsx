import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { getCappedDPR, hasWebGL, isTouchDevice, rafThrottle } from "../../hooks/useMobile";

const Scene = () => {
  const canvasDiv = useRef(null);
  const hoverDivRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();
  const [webglSupported] = useState(() => hasWebGL());

  useEffect(() => {
    if (!canvasDiv.current || !webglSupported) return;

    let active = true;
    const isTouch = isTouchDevice();
    const screenWidth = window.innerWidth;
    const isMobileScreen = screenWidth <= 767;

    let rect = canvasDiv.current.getBoundingClientRect();
    let container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileScreen,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(getCappedDPR(screenWidth));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let headBone = null;
    let screenLight = null;
    let mixer = null;
    let hoverCleanup = null;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    let progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let progressSnapped = false;
    const snapProgress = () => {
      if (progressSnapped) return Promise.resolve();
      progressSnapped = true;
      return progress.loaded();
    };

    // Failsafe snap loading screen to 100% if decryption/compile takes more than 1.2s
    const failsafeTimeout = setTimeout(() => {
      snapProgress();
    }, 1200);

    loadCharacter().then((gltf) => {
      clearTimeout(failsafeTimeout);
      if (!active) {
        if (gltf && gltf.scene) gltf.scene.clear();
        return;
      }
      if (gltf) {
        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          hoverCleanup = animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        let charScene = gltf.scene;
        scene.add(charScene);
        headBone = charScene.getObjectByName("spine006") || null;
        screenLight = charScene.getObjectByName("screenlight") || null;

        snapProgress().then(() => {
          setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });

        const onWindowResize = () => {
          handleResize(renderer, camera, canvasDiv, charScene);
        };
        window.addEventListener("resize", onWindowResize);
      }
    }).catch((err) => {
      console.error("Failed to compile scene details:", err);
      clearTimeout(failsafeTimeout);
      snapProgress();
    });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    // Throttle mousemove with RAF guard to prevent layout thrashing
    const onMouseMove = rafThrottle((event) => {
      handleMouseMove(event, (x, y) => {
        mouse = { x, y };
      });
    });

    let debounce;
    const onTouchStart = (event) => {
      const element = event.target;
      debounce = setTimeout(() => {
        const onTouchMoveFn = (e) => {
          handleTouchMove(e, (x, y) => {
            mouse = { x, y };
          });
        };
        element?.addEventListener("touchmove", onTouchMoveFn, { passive: true });
        
        // Save cleanup
        element.onTouchMoveCleanup = () => {
          element.removeEventListener("touchmove", onTouchMoveFn);
        };
      }, 200);
    };

    const onTouchEnd = (event) => {
      clearTimeout(debounce);
      const element = event.target;
      if (element.onTouchMoveCleanup) {
        element.onTouchMoveCleanup();
      }
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    // Only add mousemove on non-touch devices
    if (!isTouch) {
      document.addEventListener("mousemove", onMouseMove);
    }
    
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd, { passive: true });
    }

    let animationFrameId;
    let frameCount = 0;
    // On mobile, skip every other frame for ~30fps target
    const frameSkip = isMobileScreen ? 2 : 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      frameCount++;

      // Always update delta to keep clock accurate
      const delta = clock.getDelta();

      if (frameCount % frameSkip !== 0) return;

      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      active = false;
      clearTimeout(debounce);
      cancelAnimationFrame(animationFrameId);

      // Deep GPU buffer disposal to prevent VRAM memory leaks
      scene.traverse((object) => {
        if (!object.isMesh) return;
        
        if (object.geometry) {
          object.geometry.dispose();
        }
        
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              if (mat.normalMap) mat.normalMap.dispose();
              if (mat.specularMap) mat.specularMap.dispose();
              if (mat.emissiveMap) mat.emissiveMap.dispose();
              mat.dispose();
            });
          } else {
            if (object.material.map) object.material.map.dispose();
            if (object.material.normalMap) object.material.normalMap.dispose();
            if (object.material.specularMap) object.material.specularMap.dispose();
            if (object.material.emissiveMap) object.material.emissiveMap.dispose();
            object.material.dispose();
          }
        }
      });

      scene.clear();
      renderer.dispose();
      light.dispose();
      
      if (hoverCleanup) hoverCleanup();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      
      if (!isTouch) {
        document.removeEventListener("mousemove", onMouseMove);
      }
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
        if (landingDiv.onTouchMoveCleanup) {
          landingDiv.onTouchMoveCleanup();
        }
      }
    };
  }, [setLoading, webglSupported]);

  // WebGL fallback
  if (!webglSupported) {
    return (
      <div className="character-container">
        <div className="character-model" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--textSecondary)', fontSize: '14px', padding: '20px' }}>
            3D content requires WebGL support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
