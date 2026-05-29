import "./styles/Landing.css";

const Landing = ({ children }) => {
  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello, I&apos;m</h2>
          <h1>
            <span className="name-line">SNEHANGSHU DAS</span>
            <br />
            <span className="role-line">PORTFOLIO</span>
          </h1>
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
