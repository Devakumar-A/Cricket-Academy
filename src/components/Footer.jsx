import { useState, useEffect } from "react";
import "./Footer.css";

function Footer({ onSection, onHome }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setCurrentTime(now.toLocaleTimeString("en-GB", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mg-footer">
      {/* Top Banner with Academy Mission */}
      <div className="footer-top-banner">
        <div className="footer-container">
          <div className="footer-brand-statement">
            <span className="footer-badge">MG CRICKETER'S DEN</span>
            <h2 className="footer-tagline">DEVELOPING CRICKETERS. BUILDING CHAMPIONS.</h2>
            <p className="footer-subtext">
              Professional Coaching | Match Practice | Fitness & Athletic Conditioning | Modern Facilities | Complete Player Development
            </p>
          </div>

          {/* DEN Live Facility Clock */}
          <div className="footer-clock-box">
            <div className="live-pulse-indicator">
              <span className="pulse-dot"></span>
              <span className="pulse-text">FACILITY ACTIVE</span>
            </div>
            <div className="clock-digits">
              <span>DEN CLOCK: {currentTime || "12:00:00"} IST</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="footer-main-content">
        <div className="footer-container footer-grid">
          {/* Column 1: Academy Directory */}
          <div className="footer-col">
            <h3 className="footer-col-title">ACADEMY DIRECTORY</h3>
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={onHome} className="footer-nav-btn">
                  HOME
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSection("about")} className="footer-nav-btn">
                  ABOUT THE DEN
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSection("coaches")} className="footer-nav-btn">
                  COACHING STAFF
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSection("booking")} className="footer-nav-btn">
                  TURF & NET BOOKING
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSection("admission")} className="footer-nav-btn">
                  ADMISSION & BATCHES
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSection("players")} className="footer-nav-btn">
                  PLAYER PERFORMANCE STATS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Facility Locations */}
          <div className="footer-col">
            <h3 className="footer-col-title">OUR FACILITIES</h3>
            <div className="footer-location-block">
              <strong className="location-name">📍 Practice Nets Facility</strong>
              <p className="location-address">
                North St, Thengaithittu, Puducherry, 605004
              </p>
              <span className="location-types">1 Astro Turf Wicket • 1 Natural Turf Wicket</span>
            </div>

            <div className="footer-location-block" style={{ marginTop: "16px" }}>
              <strong className="location-name">🏟️ Match Ground Arena</strong>
              <p className="location-address">
                Main Ground, Royapudupakkam
              </p>
              <span className="location-types">Full-Size Open Turf Match Arena</span>
            </div>
          </div>

          {/* Column 3: Contact & Direct Connect */}
          <div className="footer-col">
            <h3 className="footer-col-title">DIRECT CONNECT</h3>
            <div className="footer-contact-items">
              <a
                href="https://www.instagram.com/mg_cricketers_den?igsi=MW5oODZ1bnd3d3VyZg=="
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link footer-insta-link"
              >
                <span>📸 Instagram: @mg_cricketers_den</span>
              </a>

              <a
                href="https://wa.me/918300879748"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                <span>💬 WhatsApp: +91 83008 79748</span>
              </a>

              <a href="tel:+919597318892" className="footer-contact-link">
                <span>📞 Call Desk: +91 95973 18892</span>
              </a>

              <a
                href="mailto:mgcricketersden@gmail.com"
                className="footer-contact-link"
              >
                <span>✉️ mgcricketersden@gmail.com</span>
              </a>
            </div>

            <div className="footer-quick-action">
              <button
                type="button"
                className="footer-cta-turf-btn"
                onClick={() => onSection("booking")}
              >
                🏏 BOOK A TURF SLOT →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container footer-bottom-flex">
          <p className="copyright-text">
            © {new Date().getFullYear()} MG CRICKETER'S DEN. ALL RIGHTS RESERVED. PUDUCHERRY.
          </p>
          <div className="footer-legal-tags">
            <span>EXCELLENCE IN CRICKET TRAINING</span>
            <span className="sep">•</span>
            <span>STRUCTURED ATHLETE DEVELOPMENT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
