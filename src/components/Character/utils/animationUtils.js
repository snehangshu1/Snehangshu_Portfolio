import * as THREE from "three";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const setAnimations = (gltf) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);

  // Only set up typing and blink — don't auto-play key animations
  // that cause limb duplication from conflicting bone transforms
  let typingAction = null;

  if (gltf.animations && gltf.animations.length > 0) {
    // Intro animation — single clean pose
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.play();
    }

    // Only play typing animation on filtered bones to avoid conflicts
    typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = false; // Don't start until intro is done
      typingAction.timeScale = 0.8; // Slower, smoother
    }
  }

  function startIntro() {
    if (!gltf.animations) return;
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.clampWhenFinished = true;
      introAction.reset().play();
    }

    // Start typing and blink after intro completes
    setTimeout(() => {
      // Enable typing animation smoothly
      if (typingAction) {
        typingAction.enabled = true;
        typingAction.reset();
        typingAction.fadeIn(1.5).play();
        typingAction.timeScale = 0.8;
      }

      const blink = gltf.animations.find((clip) => clip.name === "Blink");
      if (blink) {
        mixer.clipAction(blink).play().fadeIn(0.8);
      }
    }, 2500);
  }

  function hover(gltfData, hoverDiv) {
    let eyeBrowUpAction = createBoneAction(
      gltfData,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;

    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }

    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(3);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };

    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.8);
      }
    };

    if (!hoverDiv) return;
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);

    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover };
};

const createBoneAction = (gltf, mixer, clipName, boneNames) => {
  const animationClip = THREE.AnimationClip.findByName(gltf.animations, clipName);
  if (!animationClip) {
    console.error(`Animation "${clipName}" not found in GLTF file.`);
    return null;
  }

  const filteredClip = filterAnimationTracks(animationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (clip, boneNames) => {
  const filteredTracks = clip.tracks.filter((track) => {
    // Normalize track name by removing dots, e.g. "upper_arm.L" -> "upper_armL"
    const normalizedTrackName = track.name.replace(/\./g, "");
    return boneNames.some((boneName) => normalizedTrackName.includes(boneName));
  });

  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;
