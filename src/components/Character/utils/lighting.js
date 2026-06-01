import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";
import { getCappedDPR } from "../../../hooks/useMobile";

const setLighting = (scene) => {
  const isMobile = window.innerWidth <= 767;
  const shadowRes = isMobile ? 256 : 1024;

  // Soft neutral directional light — warm white instead of red
  const directionalLight = new THREE.DirectionalLight(0xe8e0d8, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = !isMobile;
  directionalLight.shadow.mapSize.width = shadowRes;
  directionalLight.shadow.mapSize.height = shadowRes;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Subtle warm point light — reduced intensity
  const pointLight = new THREE.PointLight(0xf5f0eb, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = !isMobile;
  scene.add(pointLight);

  // Store HDR texture for disposal
  let hdrTexture = null;

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
      hdrTexture = texture;
    });

  function setPointLight(screenLight) {
    if (screenLight && screenLight.material && screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 12;
    } else {
      pointLight.intensity = 0;
    }
  }

  const duration = 2.5;
  const ease = "power2.out";

  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.6,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 0.9,
      duration: duration,
      ease: ease,
    });
    gsap.to(".character-rim", {
      y: "55%",
      opacity: 0.6,
      delay: 0.3,
      duration: 2.5,
      ease: "power2.out",
    });
  }

  function dispose() {
    if (hdrTexture) {
      hdrTexture.dispose();
      hdrTexture = null;
    }
    if (directionalLight.shadow.map) {
      directionalLight.shadow.map.dispose();
    }
    if (pointLight.shadow.map) {
      pointLight.shadow.map.dispose();
    }
  }

  return { setPointLight, turnOnLights, dispose };
};

export default setLighting;
