import { useState } from "react";
import { MdArrowOutward, MdCopyright, MdClose, MdContentCopy, MdCheck } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const messageText = `Hi Snehangshu 👋

I visited your portfolio and would love to connect regarding a project, collaboration, internship opportunity, or just to network.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setIsCopied(true);
      setTimeout(() => {
        window.open("https://www.instagram.com/snehangshu.18", "_blank");
        setIsCopied(false);
        setIsModalOpen(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <div className="contact-cta-card">
          <span className="contact-label">Get In Touch</span>
          <h2>Have an idea or a project?<br />Let&apos;s build something epic.</h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="contact-cta-btn" 
            data-cursor="disable"
          >
            Start a Conversation <MdArrowOutward />
          </button>
        </div>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:snehangshudas96@gmail.com" data-cursor="disable">
                snehangshudas96@gmail.com
              </a>
            </p>
            <h4>Phone</h4>
            <p>
              <a href="tel:+917085836709" data-cursor="disable">
                +91 70858 36709
              </a>
            </p>
          </div>
          <div className="contact-box">
            <h4>Social Channels</h4>
            <a
              href="https://github.com/snehangshu1"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href="https://www.linkedin.com/in/snehangshu-das-815b2830a"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href="https://www.instagram.com/snehangshu.18?igsh=NjRhemJ5aXRqZmRn"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box credits">
            <h2>
              Designed & Developed <br />by <span>Snehangshu</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()} All Rights Reserved
            </h5>
          </div>
        </div>
      </div>

      {/* Premium Glassmorphism Modal Popup */}
      <div 
        className={`contact-modal-overlay ${isModalOpen ? "open" : ""}`}
        onClick={(e) => {
          if (e.target.classList.contains("contact-modal-overlay")) {
            setIsModalOpen(false);
          }
        }}
      >
        <div className="contact-modal">
          <button 
            className="contact-modal-close" 
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
          >
            <MdClose />
          </button>
          
          <h3>Connect with Snehangshu</h3>
          
          <div className="contact-modal-message-box">
            {messageText}
          </div>
          
          <button 
            className={`contact-modal-action-btn ${isCopied ? "success" : ""}`}
            onClick={handleCopy}
          >
            {isCopied ? (
              <>
                <span className="success-icon"><MdCheck size={18} /></span> Copied Successfully!
              </>
            ) : (
              <>
                <MdContentCopy size={16} /> Copy Message & Open Instagram
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
