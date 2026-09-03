import React from "react";
import "./SponsorsSection.css";

const PARTNERS_DATA = [
  {
    id: "cognolynx",
    name: "COGNOLYNX",
    spec: "OFFICIAL TECHNOLOGY PARTNER",
    logoPng: "/sponsors/cognolynx.png",
    logoSvg: "/sponsors/cognolynx.svg",
    accent: "#fde047"
  },
  {
    id: "visuorexvault",
    name: "VISUOREXVAULT",
    spec: "OFFICIAL VIDEO PRODUCTION & MEDIA",
    logoPng: "/sponsors/visuorexvault.png",
    logoSvg: "/sponsors/visuorexvault.svg",
    accent: "#c084fc"
  }
];

function SponsorsSection() {
  return (
    <section className="mg-pro-partners-section" id="partners" aria-label="Our Partners">
      <div className="pro-partners-container">
        {/* MINIMAL HEADER */}
        <div className="pro-partners-header">
          <div className="pro-accent-pill">
            <span className="pro-accent-line" />
            <span className="pro-accent-icon">✦</span>
            <span className="pro-accent-line" />
          </div>
          <h2 className="pro-partners-title">OUR PARTNERS</h2>
          <p className="pro-partners-motto">TRAIN • COMPETE • IMPROVE</p>
        </div>

        {/* SINGLE ROW ELEGANT BRAND LOCKUP */}
        <div className="pro-partners-row" role="list">
          {PARTNERS_DATA.map((partner, index) => (
            <React.Fragment key={partner.id}>
              <div className="pro-partner-unit" role="listitem">
                {/* 1. LOGO IMAGE (PRIMARY VISUAL) */}
                <div className="pro-partner-logo-box">
                  <img
                    src={partner.logoPng}
                    alt={`${partner.name} logo`}
                    className="pro-partner-img"
                    onError={(e) => {
                      if (e.currentTarget.src !== partner.logoSvg) {
                        e.currentTarget.src = partner.logoSvg;
                      }
                    }}
                  />
                </div>

                {/* 2. NAME (MEDIUM) & 3. SPECIFICATION (SMALL REFINED) */}
                <div className="pro-partner-text-block">
                  <span className="pro-partner-name">{partner.name}</span>
                  <span className="pro-partner-spec" style={{ color: partner.accent }}>
                    {partner.spec}
                  </span>
                </div>
              </div>

              {/* Elegant Divider between units on desktop */}
              {index < PARTNERS_DATA.length - 1 && (
                <div className="pro-partner-divider" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
