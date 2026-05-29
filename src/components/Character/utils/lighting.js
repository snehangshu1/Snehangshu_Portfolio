import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene) => {
  // Soft neutral directional light — warm white instead of red
  const directionalLight = new THREE.DirectionalLight(0xe8e0d8, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  // Subtle warm point light — reduced intensity
  const pointLight = new THREE.PointLight(0xf5f0eb, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = true;
  scene.add(pointLight);

  new RGBELoader()
    .setPath("/models/")
    .load("char_enviorment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
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

  return { setPointLight, turnOnLights };
};

export default setLighting;
