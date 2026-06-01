import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, invalidate } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
} from "@react-three/rapier";
import { useDeviceInfo, throttle } from "../hooks/useMobile";

const textureLoader = new THREE.TextureLoader();
const imageUrls = [
  "/images/react2.webp",
  "/images/next2.webp",
  "/images/node2.webp",
  "/images/express.webp",
  "/images/mongo.webp",
  "/images/mysql.webp",
  "/images/typescript.webp",
  "/images/javascript.webp",
];
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

// Pre-compute sphere configs with stable material indices to avoid
// random material assignment during render (which breaks React's reconciliation)
function createSphereConfigs(count, materialCount) {
  return [...Array(count)].map((_, i) => ({
    scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
    materialIndex: i % materialCount,
  }));
}

const DESKTOP_SPHERE_COUNT = 30;
const MOBILE_SPHERE_COUNT = 30;
const TABLET_SPHERE_COUNT = 30;

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}) {
  const api = useRef(null);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current.applyImpulse(impulse, true);

    // Trigger a re-render when physics is active
    invalidate();
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), isActive }) {
  const ref = useRef(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current.setNextKinematicTranslation(targetVec);
    invalidate();
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const device = useDeviceInfo();

  // Determine sphere count based on device
  const sphereCount = device.isMobile
    ? MOBILE_SPHERE_COUNT
    : device.isTablet
    ? TABLET_SPHERE_COUNT
    : DESKTOP_SPHERE_COUNT;

  // Stable sphere configs — memoized by count
  const sphereConfigs = useMemo(
    () => createSphereConfigs(sphereCount, textures.length),
    [sphereCount]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Throttle scroll handler to fire max every 100ms
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workElem = document.getElementById("work");
      if (workElem) {
        const threshold = workElem.getBoundingClientRect().top;
        setIsActive(scrollY > threshold);
      }
    }, 100);
    
    let scrollInterval = null;
    let scrollTimeout = null;

    const clearTimers = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };

    const links = document.querySelectorAll(".header a");
    const clickListeners = [];

    links.forEach((elem) => {
      const listener = () => {
        clearTimers();
        scrollInterval = setInterval(() => {
          handleScroll();
        }, 10);
        scrollTimeout = setTimeout(() => {
          clearInterval(scrollInterval);
        }, 1000);
      };
      elem.addEventListener("click", listener);
      clickListeners.push({ elem, listener });
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      clearTimers();
      clickListeners.forEach(({ elem, listener }) => {
        elem.removeEventListener("click", listener);
      });
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  useEffect(() => {
    return () => {
      // Deep cleanup of three.js materials on unmount to prevent severe GPU memory leaks
      materials.forEach((material) => {
        if (material.map) material.map.dispose();
        if (material.emissiveMap) material.emissiveMap.dispose();
        material.dispose();
      });
      // Dispose shared geometry
      sphereGeometry.dispose();
    };
  }, [materials]);

  // Canvas DPR: max 2 on all devices
  const dprRange = [1, 2];

  // Enable post-processing on all devices to match desktop visual quality
  const enablePostProcessing = true;

  return (
    <div className="techstack" ref={containerRef}>
      <h2>My Techstack</h2>

      <Canvas
        shadows={true}
        dpr={dprRange}
        frameloop={isVisible ? "always" : "never"}
        gl={{
          alpha: true,
          stencil: true,
          depth: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => {
          state.gl.toneMappingExposure = 1.5;
          // Trigger initial render
          invalidate();
        }}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow={true}
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {sphereConfigs.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              material={materials[props.materialIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        {enablePostProcessing && (
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};

export default TechStack;
