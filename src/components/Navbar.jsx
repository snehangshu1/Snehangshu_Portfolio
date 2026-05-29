import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import HoverLinks from "./HoverLinks";
import Lenis from "lenis";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

export let smoother = {
  paused: (state) => {
    if (state) {
      window.lenisInstance?.stop();
    } else {
      window.lenisInstance?.start();
    }
  },
  scrollTo: (target, immediate) => {
    window.lenisInstance?.scrollTo(target, {
      immediate: !!immediate,
      duration: 1.5,
    });
  },
  scrollTop: (value) => {
    window.lenisInstance?.scrollTo(value, {
      immediate: true,
    });
  }
};

const Navbar = () => {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.lenisInstance = lenis;

    // Synchronize Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Initial state: stop scroll until loaded
    lenis.stop();

    const links = document.querySelectorAll(".header ul a");
    const clickHandler = (e) => {
      e.preventDefault();
      const elem = e.currentTarget;
      const section = elem.getAttribute("data-href");
      if (section) {
        lenis.scrollTo(section, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    links.forEach((elem) => {
      elem.addEventListener("click", clickHandler);
    });

    // Glass pill on scroll
    const header = document.querySelector(".header");
    const scrollHandler = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (header) {
        if (scrollY > 100) {
          header.classList.add("header-scrolled");
        } else {
          header.classList.remove("header-scrolled");
        }
      }
    };

    const resizeHandler = () => {
      ScrollTrigger.refresh(true);
    };
    
    window.addEventListener("resize", resizeHandler, { passive: true });
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.lenisInstance = null;
      links.forEach((elem) => {
        elem.removeEventListener("click", clickHandler);
      });
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          SNEHANGSHU
        </a>
        <a
          href="mailto:snehangshudas96@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          snehangshudas96@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
