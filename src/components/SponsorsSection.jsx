import React from "react";
import "./SponsorsSection.css";

const PARTNERS_DATA = [
  {
    id: "cognolynx",
    name: "COGNOLYNX",
    spec: "OFFICIAL TECHNOLOGY PARTNER",
    logoWebp: "/sponsors/cognolynx.webp",
    logoPng: "/sponsors/cognolynx.png",
    accent: "#fde047"
  },
  {
    id: "visuorexvault",
    name: "VISUOREX VAULT",
    spec: "OFFICIAL VIDEO PRODUCTION & MEDIA",
    logoWebp: "/sponsors/visuorexvault.webp",
    logoPng: "/sponsors/visuorexvault.png",
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

        {/* SINGLE ROW ELEGANT 2-COLUMN BRAND LOCKUP CARD */}
        <div className="pro-partners-row" role="list">
          {PARTNERS_DATA.map((partner, index) => (
            <React.Fragment key={partner.id}>
              <div className="pro-partner-unit" role="listitem">
                {/* 1. LARGE LOGO IMAGE (PRIMARY VISUAL ELEMENT) */}
                <div className="pro-partner-logo-box">
                  <img
                    src={partner.logoWebp}
                    alt={`${partner.name} - Official Partner of MG Cricketer's Den Cricket Academy Pondicherry`}
                    width="240"
                    height="80"
                    loading="lazy"
                    decoding="async"
                    className="pro-partner-img"
                    onError={(e) => {
                      if (e.currentTarget.src !== partner.logoPng) {
                        e.currentTarget.src = partner.logoPng;
                      }
                    }}
                  />
                </div>

                {/* 2. MEDIUM BOLD NAME & 3. SMALL SUBTLE SPECIFICATION */}
                <div className="pro-partner-text-block">
                  <span className="pro-partner-name">{partner.name}</span>
                  <span className="pro-partner-spec" style={{ color: partner.accent }}>
                    {partner.spec}
                  </span>
                </div>
              </div>

              {/* Subtle Vertical Divider between the 2 sponsors */}
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
