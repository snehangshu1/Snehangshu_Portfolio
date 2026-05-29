import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My Tech <span>&</span>
          <br /> Experience Journey
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Started My Tech Journey</h4>
                <h5>BITS Pilani B.Sc. + NIAT Hyderabad</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Started programming and web development. Learned HTML, CSS, JavaScript, React.js. 
              Built personal projects and explored modern frontend development. Started solving 
              DSA problems using C++, Java, and Python. Learned MySQL and MongoDB fundamentals.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Frontend Developer</h4>
                <h5>Personal Projects & Freelance Learning</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Built responsive and interactive websites. Created modern UI/UX experiences using React.js. 
              Worked with animations, APIs, and component-based architecture. Focused on performance 
              optimization and clean code practices.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Aspiring Full-Stack Engineer & Startup Builder</h4>
                <h5>Startup Agency zen_X</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Currently learning backend development using Python and Java. Working with MongoDB and 
              MySQL databases. Exploring cloud technologies, AI, and scalable systems. Building 
              innovative projects and preparing for software engineering internships.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
