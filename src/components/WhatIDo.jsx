import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef([]);

  const setRef = (el, index) => {
    containerRef.current[index] = el;
  };

  const handleClick = (container) => {
    container.classList.toggle("what-content-active");
    container.classList.remove("what-sibling");
    if (container.parentElement) {
      const siblings = Array.from(container.parentElement.children);
      siblings.forEach((sibling) => {
        if (sibling !== container) {
          sibling.classList.remove("what-content-active");
          sibling.classList.toggle("what-sibling");
        }
      });
    }
  };

  useEffect(() => {
    const clickListeners = [];

    if (ScrollTrigger.isTouch) {
      containerRef.current.forEach((container) => {
        if (container) {
          container.classList.remove("what-noTouch");
          const listener = () => handleClick(container);
          container.addEventListener("click", listener);
          clickListeners.push({ container, listener });
        }
      });
    }

    return () => {
      clickListeners.forEach(({ container, listener }) => {
        container.removeEventListener("click", listener);
      });
    };
  }, []);

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span> I <span className="do-h2">DO</span>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          {/* DEVELOP TAB */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>DEVELOP</h3>
              <h4>Core Capabilities</h4>
              <p>
                Building full-stack web applications, typing clean programming code,
                and designing robust relational and document database systems.
              </p>
              <h5>Languages, Frameworks & Databases</h5>
              <div className="what-content-flex">
                <div className="what-tags">HTML5 & CSS3</div>
                <div className="what-tags">JavaScript</div>
                <div className="what-tags">React.js</div>
                <div className="what-tags">Python</div>
                <div className="what-tags">Java</div>
                <div className="what-tags">C++</div>
                <div className="what-tags">MySQL</div>
                <div className="what-tags">MongoDB</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          {/* DESIGN TAB */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>DESIGN</h3>
              <h4>Aesthetics & User Experience</h4>
              <p>
                Crafting premium glassmorphism user interfaces, high-end hover dynamics,
                smooth animations, and fully-responsive layout parameters.
              </p>
              <h5>Styles & Motion</h5>
              <div className="what-content-flex">
                <div className="what-tags">UI/UX Design</div>
                <div className="what-tags">Glassmorphism</div>
                <div className="what-tags">GSAP Animations</div>
                <div className="what-tags">Lenis Smooth Scroll</div>
                <div className="what-tags">Interactive 3D Elements</div>
                <div className="what-tags">Responsive Layouts</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

          {/* LEARNING TAB */}
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 2)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>LEARNING</h3>
              <h4>Future Tech Horizon</h4>
              <p>
                Deep-diving into robust backend architectures, distributed scalable system designs,
                and autonomous AI agents to build futuristic software products.
              </p>
              <h5>Current Learning & Fields</h5>
              <div className="what-content-flex">
                <div className="what-tags">Node.js</div>
                <div className="what-tags">System Design</div>
                <div className="what-tags">AI Development</div>
                <div className="what-tags">Cloud Computing</div>
                <div className="what-tags">Autonomous Agents</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
