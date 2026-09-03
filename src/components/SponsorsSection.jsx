import React from "react";
import "./SponsorsSection.css";

const REAL_SPONSORS = [
  {
    id: "cognolynx",
    name: "COGNOLYNX",
    role: "Official Technology & Innovation Partner",
    tagline: "Intelligent Solutions",
    logoPath: "/sponsors/cognolynx/cognolynx-logo.svg",
    fallbackLogoPath: "/cognolynx/logo.svg"
  }
];

function SponsorsSection() {
  return (
    <section className="mg-minimal-partners-section" id="partners" aria-label="Our Partners">
      <div className="partners-container">
        {/* HEADER */}
        <div className="partners-header">
          <div className="partners-accent-pill">
            <span className="accent-line" />
            <span className="accent-icon">✦</span>
            <span className="accent-line" />
          </div>
          <h2 className="partners-title">OUR PARTNERS</h2>
          <p className="partners-subtitle">Proudly supported by our valued partner</p>
        </div>

        {/* SPONSOR SHOWCASE (CLEAN, MINIMAL & PROFESSIONAL) */}
        <div className="partners-showcase-stage">
          {REAL_SPONSORS.map((sponsor) => (
            <div key={sponsor.id} className="sponsor-brand-hero-card">
              <div className="sponsor-logo-frame">
                <img 
                  src={sponsor.logoPath} 
                  alt={sponsor.name} 
                  className="sponsor-brand-svg-img"
                  onError={(e) => {
                    e.currentTarget.src = sponsor.fallbackLogoPath;
                  }}
                />
              </div>
              <div className="sponsor-meta-pill">
                <span className="sponsor-live-dot" />
                <span>{sponsor.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
