import "./styles/Landing.css";
import { MdArrowOutward } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";

const Landing = ({ children }) => {
  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello, I&apos;m</h2>
          <h1>
            <span className="name-line">SNEHANGSHU DAS</span>
            <span className="role-line">FULL-STACK ENGINEER</span>
          </h1>
          <p className="landing-description">
            Architecting premium web products, next-gen WebAR pipelines, and intelligent AI systems with cinematic user experiences.
          </p>
          <div className="landing-actions">
            <a href="#work" data-href="#work" className="landing-btn primary" onClick={(e) => {
              e.preventDefault();
              window.lenisInstance?.scrollTo("#work", { duration: 1.5 });
            }}>
              Explore Projects <MdArrowOutward />
            </a>
            <a href="https://www.linkedin.com/in/snehangshu-das-815b2830a" target="_blank" rel="noreferrer" className="landing-btn secondary">
              <FaLinkedin /> Connect
            </a>
          </div>
        </div>
        <div className="landing-info">
          <h3>A Creative</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Developer</div>
            <div className="landing-h2-2">Designer</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Developer</div>
            <div className="landing-h2-info-1">Designer</div>
          </h2>
        </div>
      </div>
      {/* Soft ambient spotlight */}
      <div className="landing-spotlight"></div>
      {children}
    </div>
  );
};

export default Landing;
