import { useState, useEffect } from "react";
import { MapPin, MessageCircle, Phone, Mail } from "lucide-react";
import { prefetchPage } from "../utils/pagePrefetch";
import "./Footer.css";

function Footer({ onSection, onHome }) {
  const [currentTime, setCurrentTime] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } catch {
        return "12:00:00";
      }
    }
    return "12:00:00";
  });

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

    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="mg-footer">
      {/* Subtle Background Architectural Grid */}
      <div className="footer-bg-grid" aria-hidden="true" />

      {/* Top Banner with Academy Mission */}
      <div className="footer-top-banner">
        <div className="footer-container footer-banner-container">
          <div className="footer-brand-statement">
            <span className="footer-badge">MG CRICKETER&apos;S DEN</span>
            <h2 className="footer-tagline">DEVELOPING CRICKETERS. BUILDING CHAMPIONS.</h2>
            <p className="footer-subtext">
              Professional Coaching | Match Practice | Fitness &amp; Athletic Conditioning | Modern Facilities | Complete Player Development
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
                <button
                  type="button"
                  onClick={() => onSection("about")}
                  onMouseEnter={() => prefetchPage("about")}
                  onTouchStart={() => prefetchPage("about")}
                  className="footer-nav-btn"
                >
                  ABOUT THE DEN
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("coaches")}
                  onMouseEnter={() => prefetchPage("coaches")}
                  onTouchStart={() => prefetchPage("coaches")}
                  className="footer-nav-btn"
                >
                  COACHING STAFF
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("booking")}
                  onMouseEnter={() => prefetchPage("booking")}
                  onTouchStart={() => prefetchPage("booking")}
                  className="footer-nav-btn"
                >
                  TURF &amp; NET BOOKING
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("admission")}
                  onMouseEnter={() => prefetchPage("admission")}
                  onTouchStart={() => prefetchPage("admission")}
                  className="footer-nav-btn"
                >
                  ADMISSION &amp; BATCHES
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("players")}
                  onMouseEnter={() => prefetchPage("players")}
                  onTouchStart={() => prefetchPage("players")}
                  className="footer-nav-btn"
                >
                  PLAYER PERFORMANCE STATS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("privacy")}
                  onMouseEnter={() => prefetchPage("privacy")}
                  onTouchStart={() => prefetchPage("privacy")}
                  className="footer-nav-btn"
                >
                  PRIVACY POLICY
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSection("terms")}
                  onMouseEnter={() => prefetchPage("terms")}
                  onTouchStart={() => prefetchPage("terms")}
                  className="footer-nav-btn"
                >
                  TERMS OF SERVICE
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Facility Locations */}
          <div className="footer-col">
            <h3 className="footer-col-title">OUR FACILITIES</h3>
            <div className="footer-facilities-list">
              <div className="footer-location-block">
                <div className="location-header">
                  <span className="location-pin-icon" aria-hidden="true">
                    <MapPin size={15} />
                  </span>
                  <strong className="location-name">Practice Nets Facility</strong>
                </div>
                <div className="location-details">
                  <p className="location-address">
                    North St, Thengaithittu, Puducherry, 605004
                  </p>
                  <span className="location-types">1 Astro Wicket • 1 Turf Wicket</span>
                </div>
              </div>

              <div className="footer-location-block">
                <div className="location-header">
                  <span className="location-pin-icon" aria-hidden="true">
                    <MapPin size={15} />
                  </span>
                  <strong className="location-name">Match Ground Arena</strong>
                </div>
                <div className="location-details">
                  <p className="location-address">
                    Main Ground, Royapudupakkam
                  </p>
                  <span className="location-types">Open Turf Wicket Ground Arena</span>
                </div>
              </div>
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
                className="footer-contact-link"
              >
                <span className="footer-contact-icon-wrap" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </span>
                <span className="footer-contact-text">Instagram: @mg_cricketers_den</span>
              </a>

              <a
                href="https://wa.me/918122432905"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                <span className="footer-contact-icon-wrap" aria-hidden="true">
                  <MessageCircle size={14} />
                </span>
                <span className="footer-contact-text">WhatsApp: +91 81224 32905</span>
              </a>

              <a href="tel:+919597318892" className="footer-contact-link">
                <span className="footer-contact-icon-wrap" aria-hidden="true">
                  <Phone size={14} />
                </span>
                <span className="footer-contact-text">Call Desk: +91 95973 18892</span>
              </a>

              <a
                href="mailto:mgcricketersden@gmail.com"
                className="footer-contact-link"
              >
                <span className="footer-contact-icon-wrap" aria-hidden="true">
                  <Mail size={14} />
                </span>
                <span className="footer-contact-text">mgcricketersden@gmail.com</span>
              </a>
            </div>

            <div className="footer-quick-action">
              <button
                type="button"
                className="footer-cta-turf-btn"
                onClick={() => onSection("booking")}
              >
                BOOK A TURF SLOT →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Luxury Gold Wordmark Band — Inspired by the Reference Sample */}
      <div className="footer-wordmark-section">
        <div className="footer-container">
          <div className="footer-wordmark-display" aria-hidden="true">
            <h2 className="footer-wordmark-title">MG CRICKETER&apos;S DEN</h2>
            <p className="footer-wordmark-subtitle">CRICKET ACADEMY &amp; MATCH GROUND • PUDUCHERRY</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-container footer-bottom-flex">
          <div className="footer-bottom-left">
            <p className="copyright-text">
              © {new Date().getFullYear()} MG CRICKETER&apos;S DEN. ALL RIGHTS RESERVED. PUDUCHERRY.
            </p>
            <span className="bottom-bar-sep">•</span>
            <p className="developer-credit">
              Website designed &amp; developed by{" "}
              <a
                href="https://cognolynx.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-credit-link"
              >
                Cognolynx
              </a>
            </p>
          </div>

          <div className="footer-legal-tags">
            <button type="button" onClick={() => onSection("privacy")} className="footer-legal-btn">
              Privacy Policy
            </button>
            <span className="sep">•</span>
            <button type="button" onClick={() => onSection("terms")} className="footer-legal-btn">
              Terms of Service
            </button>
            <span className="sep">•</span>
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
