import "./styles/Work.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";
import { MdArrowOutward, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import ProjectGlobe from "./ProjectGlobe";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    num: "01",
    title: "zen_X AR Menu",
    category: "Augmented Reality Dining SaaS",
    description: "An innovative, next-generation dining platform featuring interactive Augmented Reality restaurant menus. Built smooth web-AR rendering pipelines, responsive ordering interfaces, and custom client admin panels.",
    tools: ["React.js", "Three.js", "WebAR", "Node.js", "MongoDB"],
    image: "https://natural-aqua-yizxy52p.edgeone.app/WhatsApp%20Image%202026-05-29%20at%2015.03.40.jpeg",
    link: "https://zenx-ar-menu.vercel.app/#how-it-works",
    github: "",
    metrics: { label: "AR Frame Rate", value: "60 FPS AR" },
    achievements: ["WebAR Engine", "3D Interactive Plates", "Admin Portal"]
  },
  {
    num: "02",
    title: "AI SQL Agent",
    category: "Conversational Database Interface",
    description: "An intelligent autonomous database assistant that parses natural language queries and compiles them into highly secure, optimized SQL execution blocks. Connects with MySQL and MongoDB databases.",
    tools: ["Python", "OpenAI API", "LangChain", "MySQL", "MongoDB"],
    image: "https://miro.medium.com/0*qBjMA7oSGZ2kQajB.jpg",
    link: "",
    github: "https://github.com/snehangshu1/Ai-SQL-agent",
    metrics: { label: "Query Accuracy", value: "98.4%" },
    achievements: ["NL-to-SQL Compiler", "Multi-DB Support", "Auto-Securing Engine"]
  },
  {
    num: "03",
    title: "College Cricket Clash",
    category: "IPL Prediction & Management App",
    description: "A gamified IPL prediction and team management platform. Features custom statistical algorithms to analyze team matches, compute performance parameters, and plot prediction progress charts.",
    tools: ["React.js", "CSS Animations", "Chart.js", "Express", "Node.js"],
    image: "https://bostoninstituteofanalytics.b-cdn.net/wp-content/uploads/2025/04/image-7.jpg",
    link: "",
    github: "https://github.com/snehangshu1/college-cricket-clash",
    metrics: { label: "Prediction Accuracy", value: "High Grade" },
    achievements: ["Statistical Modeling", "Interactive Metrics", "Gamified Scoring"]
  }
];

const Work = () => {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag and Swipe Tracking States
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  useGSAP(() => {
    // Scroll reveal animation for the whole header section
    gsap.fromTo(
      ".work-grid-header",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-section-new",
          start: "top 80%",
        },
      }
    );

    // Initial 3D stage bounce reveal on scroll
    gsap.fromTo(
      ".work-carousel-stage",
      { opacity: 0, scale: 0.9, rotateX: -10 },
      {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".work-carousel-stage",
          start: "top 85%",
        },
      }
    );
  }, []);

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Drag handlers
  const handleTouchStart = (e) => {
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    dragStart.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const diff = dragStart.current - e.touches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    dragStart.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMoveDrag = (e) => {
    if (!isDragging.current) return;
    const diff = dragStart.current - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      isDragging.current = false;
    }
  };

  const handleMouseUpDrag = () => {
    isDragging.current = false;
  };

  // Spotlight Follow and Mouse Parallax Tilt
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Parallax tilt effect
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.setProperty("--rotate-x", `${rotateX}deg`);
    card.style.setProperty("--rotate-y", `${rotateY}deg`);
    card.style.setProperty("--card-y", "-10px");
    card.style.setProperty("--card-z", "120px");
    card.style.setProperty("--card-scale", "1.02");
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--card-y", "0px");
    card.style.setProperty("--card-z", "100px");
    card.style.setProperty("--card-scale", "1");
  };

  return (
    <div className="work-section-new" id="work" ref={sectionRef}>
      <div className="work-spotlight"></div>

      <div className="work-container-new section-container">

        {/* Responsive Grid Header with ProjectGlobe */}
        <div className="work-grid-header">
          <div className="work-header-left">
            <span className="work-label">Selected Projects & Startup Works</span>
            <h2>Featured Work</h2>
            <p className="work-subtitle">
              Cinematic 3D project deck showcasing Augmented Reality restaurant dining platforms, conversational AI database agents, and stats-driven prediction tools.
            </p>
            <div className="work-quick-stats">
              <div className="work-stat">
                <span className="work-stat-num">3+</span>
                <span className="work-stat-label">Deployments</span>
              </div>
              <div className="work-stat">
                <span className="work-stat-num">zen_X</span>
                <span className="work-stat-label">Active Startup Role</span>
              </div>
            </div>
          </div>
          <div className="work-header-right">
            <ProjectGlobe />
          </div>
        </div>

        {/* 3D Apple/Linear Style Deck */}
        <div
          className="work-carousel-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveDrag}
          onMouseUp={handleMouseUpDrag}
          onMouseLeave={handleMouseUpDrag}
        >
          <button
            className="carousel-nav-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous Project"
            data-cursor="disable"
          >
            <MdChevronLeft />
          </button>

          <div className="work-carousel-container">
            {projects.map((project, idx) => {
              // Circular deck coordinate offsets
              let offset = idx - activeIndex;
              if (offset < -1) offset += projects.length;
              if (offset > 1) offset -= projects.length;

              const isActive = idx === activeIndex;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isHidden = !isActive && !isLeft && !isRight;

              return (
                <div
                  key={idx}
                  className={`work-carousel-card ${isActive ? "active" : ""} ${isLeft ? "left" : ""} ${isRight ? "right" : ""} ${isHidden ? "hidden" : ""}`}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  onMouseMove={isActive ? handleMouseMove : undefined}
                  onMouseLeave={isActive ? handleMouseLeave : undefined}
                >
                  {/* Spotlight Overlay */}
                  <div className="work-card-spotlight"></div>

                  {/* Card Main Wrapper */}
                  <div className="work-card-content">

                    {/* Top Section */}
                    <div
                      className="work-card-top"
                      style={{
                        visibility: isActive ? "visible" : "hidden",
                        opacity: isActive ? 1 : 0
                      }}
                    >
                      <span className="work-card-num">{project.num}</span>
                      <span className="work-card-category">{project.category}</span>
                    </div>

                    {/* Image Banner */}
                    <div className="work-card-image-wrap">
                      <img src={project.image} alt={project.title} className="work-card-image" />
                      <div className="work-card-image-overlay"></div>
                    </div>

                    {/* Bottom Details Section (Only Interactive on Active) */}
                    <div
                      className="work-card-bottom"
                      style={{
                        visibility: isActive ? "visible" : "hidden",
                        opacity: isActive ? 1 : 0,
                        pointerEvents: isActive ? "auto" : "none"
                      }}
                    >
                      <div className="work-card-info">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                      </div>

                      {/* Achievements Metrics Panel */}
                      <div className="work-metrics-strip">
                        <div className="work-strip-metric">
                          <span className="work-metric-val">{project.metrics.value}</span>
                          <span className="work-metric-lbl">{project.metrics.label}</span>
                        </div>
                        <div className="work-strip-divider"></div>
                        <div className="work-achievements-flex">
                          {project.achievements.map((ach, i) => (
                            <span key={i} className="work-ach-bullet">{ach}</span>
                          ))}
                        </div>
                      </div>

                      {/* Tools and Action Badges */}
                      <div className="work-card-meta">
                        <div className="work-card-tools">
                          {project.tools.map((tool, i) => (
                            <span key={i} className="work-chip">{tool}</span>
                          ))}
                        </div>

                        {/* Dual Action Buttons (Stripe / Apple Style) */}
                        <div className="work-card-actions">
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              className="work-action-btn primary-btn"
                              data-cursor="disable"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Explore Live <MdArrowOutward />
                            </a>
                          )}
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer"
                              className="work-action-btn secondary-btn"
                              data-cursor="disable"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaGithub /> GitHub Code
                            </a>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="carousel-nav-btn next-btn"
            onClick={handleNext}
            aria-label="Next Project"
            data-cursor="disable"
          >
            <MdChevronRight />
          </button>
        </div>

        {/* Apple Style Segmented Progress Tracker */}
        <div className="work-progress-bar">
          {projects.map((_, idx) => (
            <div
              key={idx}
              className={`work-progress-segment ${idx === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
              title={`View Project ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Work;
