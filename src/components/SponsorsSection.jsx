import React from "react";
import "./SponsorsSection.css";

const REAL_PARTNERS = [
  {
    id: "cognolynx",
    name: "Cognolynx",
    spec: "Technology Partners",
    logoPng: "/sponsors/cognolynx.png",
    logoSvg: "/sponsors/cognolynx.svg",
    accent: "#fde047"
  },
  {
    id: "visuorexvault",
    name: "Visuorexvault",
    spec: "Video Editing",
    logoPng: "/sponsors/visuorexvault.png",
    logoSvg: "/sponsors/visuorexvault.svg",
    accent: "#c084fc"
  }
];

function SponsorsSection() {
  return (
    <section className="mg-partners-section" id="partners" aria-label="Our Partners">
      <div className="partners-container">
        {/* HEADER WITH TITLE & ACADEMY MOTTO */}
        <div className="partners-header">
          <div className="partners-accent-pill">
            <span className="accent-line" />
            <span className="accent-icon">✦</span>
            <span className="accent-line" />
          </div>
          <h2 className="partners-title">OUR PARTNERS</h2>
          <p className="partners-motto">TRAIN • COMPETE • IMPROVE</p>
        </div>

        {/* PARTNERS SHOWCASE CARDS */}
        <div className="partners-grid-showcase">
          {REAL_PARTNERS.map((partner) => (
            <div key={partner.id} className="partner-item-card">
              {/* Logo Image Stage */}
              <div className="partner-logo-box">
                <img
                  src={partner.logoPng}
                  alt={partner.name}
                  className="partner-logo-img"
                  onError={(e) => {
                    if (e.currentTarget.src !== partner.logoSvg) {
                      e.currentTarget.src = partner.logoSvg;
                    }
                  }}
                />
              </div>

              {/* Partner Name & Specification */}
              <div className="partner-info-box">
                <h3 className="partner-name">{partner.name}</h3>
                <span className="partner-spec-badge" style={{ borderColor: `${partner.accent}45`, color: partner.accent }}>
                  {partner.spec}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
