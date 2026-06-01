import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { getCappedDPR } from "../../../hooks/useMobile";

let resizeTimeout = null;

export default function handleResize(renderer, camera, canvasDiv, character) {
  // Debounce resize to prevent layout thrashing
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    if (!canvasDiv.current || !character) return;
    const canvas3d = canvasDiv.current.getBoundingClientRect();
    const width = canvas3d.width;
    const height = canvas3d.height;
    renderer.setSize(width, height);
    renderer.setPixelRatio(getCappedDPR(window.innerWidth));
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const workTrigger = ScrollTrigger.getById("workScroll");
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger !== workTrigger) {
        trigger.kill();
      }
    });
    setCharTimeline(character, camera);
    setAllTimeline();
  }, 200);
}
