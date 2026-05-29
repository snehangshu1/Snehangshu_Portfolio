import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;

  const paras = document.querySelectorAll(".para");
  const titles = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para) => {
    para.classList.add("visible");
    
    if (!para.getAttribute("data-split-done")) {
      const text = para.textContent.trim();
      para.innerHTML = "";
      const words = text.split(/\s+/).map(word => {
        const wrapper = document.createElement("span");
        wrapper.className = "split-line";
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        
        const inner = document.createElement("span");
        inner.className = "split-word-inner";
        inner.style.display = "inline-block";
        inner.textContent = word + "\u00A0"; // non-breaking space
        wrapper.appendChild(inner);
        return wrapper;
      });
      words.forEach(w => para.appendChild(w));
      para.setAttribute("data-split-done", "true");
    }

    const wordsInner = para.querySelectorAll(".split-word-inner");
    gsap.fromTo(
      wordsInner,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement || para,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
        overwrite: "auto"
      }
    );
  });

  titles.forEach((title) => {
    if (!title.getAttribute("data-split-done")) {
      const text = title.textContent.trim();
      title.innerHTML = "";
      const chars = text.split("").map(char => {
        const wrapper = document.createElement("span");
        wrapper.className = "split-line";
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";

        const inner = document.createElement("span");
        inner.className = "split-char-inner";
        inner.style.display = "inline-block";
        inner.style.whiteSpace = char === " " ? "pre" : "normal";
        inner.textContent = char === " " ? "\u00A0" : char;
        wrapper.appendChild(inner);
        return wrapper;
      });
      chars.forEach(c => title.appendChild(c));
      title.setAttribute("data-split-done", "true");
    }

    const charsInner = title.querySelectorAll(".split-char-inner");
    gsap.fromTo(
      charsInner,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement || title,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
        overwrite: "auto"
      }
    );
  });
}
