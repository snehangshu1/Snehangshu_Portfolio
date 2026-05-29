import gsap from "gsap";
import { smoother } from "../Navbar";

function splitChars(selector) {
  const elements = document.querySelectorAll(selector);
  const allChars = [];
  
  elements.forEach(element => {
    // Avoid double splitting
    if (element.getAttribute("data-split-done")) {
      element.querySelectorAll(".split-char-inner").forEach(c => allChars.push(c));
      return;
    }
    
    const text = element.textContent.trim();
    element.innerHTML = "";
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
      
      allChars.push(inner);
      return wrapper;
    });
    chars.forEach(c => element.appendChild(c));
    element.setAttribute("data-split-done", "true");
  });
  
  return allChars;
}

export function initialFX() {
  document.body.style.overflowY = "auto";
  if (smoother) {
    smoother.paused(false);
  }
  document.getElementsByTagName("main")[0]?.classList.add("main-active");
  
  gsap.to("body", {
    backgroundColor: "#0A0A0A",
    duration: 0.8,
    delay: 0.8,
    ease: "power2.out",
  });

  const chars = splitChars(".landing-info h3, .landing-intro h2, .landing-intro h1 .name-line, .landing-intro h1 .role-line");
  
  gsap.fromTo(
    chars,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.3,
    }
  );

  const loop1_a = splitChars(".landing-h2-info");
  const loop1_b = splitChars(".landing-h2-info-1");
  const loop2_a = splitChars(".landing-h2-1");
  const loop2_b = splitChars(".landing-h2-2");

  gsap.fromTo(
    [...loop1_a, ...loop2_a],
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      y: 0,
      delay: 0.6,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
      delay: 0.1,
    }
  );

  LoopText(loop1_a, loop1_b);
  LoopText(loop2_b, loop2_a);
}

function LoopText(charsA, charsB) {
  if (charsA.length === 0 || charsB.length === 0) return;
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
  const delay = 4;
  const delay2 = delay * 2 + 1;

  tl.fromTo(
    charsB,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      y: 0,
      stagger: 0.08,
      delay: delay,
    },
    0
  )
    .fromTo(
      charsA,
      { y: 50 },
      {
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.08,
        delay: delay2,
      },
      1
    )
    .fromTo(
      charsA,
      { y: 0 },
      {
        y: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        delay: delay,
      },
      0
    )
    .to(
      charsB,
      {
        y: -50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        delay: delay2,
      },
      1
    );
}
