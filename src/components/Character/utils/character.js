import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (renderer, scene, camera) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async () => {
    try {
      const encryptedBlob = await decryptFile(
        "/models/character.enc",
        "Character3D#@"
      );
      const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

      const gltf = await loader.loadAsync(blobUrl);
      const character = gltf.scene;
      await renderer.compileAsync(character, camera, scene);
      character.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
        }
      });

      // Attach GSAP scroll bindings
      setCharTimeline(character, camera);
      setAllTimeline();

      const footR = character.getObjectByName("footR");
      if (footR) footR.position.y = 3.36;

      const footL = character.getObjectByName("footL");
      if (footL) footL.position.y = 3.36;

      dracoLoader.dispose();
      URL.revokeObjectURL(blobUrl);

      return gltf;
    } catch (err) {
      console.error("Failed to decrypt and load character model:", err);
      throw err;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
