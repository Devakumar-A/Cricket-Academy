import React from "react";
import "./SponsorsSection.css";

const PARTNERS = [
  {
    id: "sg",
    name: "SG",
    sub: "CRICKET",
    type: "CRICKET GEAR"
  },
  {
    id: "ss",
    name: "SS TON",
    sub: "SAREEN SPORTS",
    type: "EQUIPMENT"
  },
  {
    id: "gray-nicolls",
    name: "GRAY-NICOLLS",
    sub: "EST. 1855",
    type: "MASTER WILLOW"
  },
  {
    id: "kookaburra",
    name: "KOOKABURRA",
    sub: "AUSTRALIA",
    type: "TURF & BALLS"
  },
  {
    id: "enerzal",
    name: "ENERZAL",
    sub: "PRO HYDRATION",
    type: "PERFORMANCE"
  },
  {
    id: "stancebeam",
    name: "STANCEBEAM",
    sub: "3D ANALYTICS",
    type: "SMART TECH"
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
          <p className="partners-subtitle">Proudly supported by our valued partners</p>
        </div>

        {/* DESKTOP ROW (Static Clean Horizontal Grid) */}
        <div className="partners-desktop-row" aria-label="Partner Logos Desktop">
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="partner-logo-item">
              <div className="partner-mark">
                <span className="partner-brand-name">{partner.name}</span>
                <span className="partner-brand-sub">{partner.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE INFINITE SEAMLESS MARQUEE */}
        <div className="partners-mobile-marquee-wrap" aria-label="Partner Logos Mobile">
          <div className="marquee-fade-left" aria-hidden="true" />
          <div className="marquee-fade-right" aria-hidden="true" />
          
          <div className="marquee-track">
            {/* Set 1 */}
            {PARTNERS.map((partner, idx) => (
              <div key={`m1-${partner.id}-${idx}`} className="partner-logo-item">
                <div className="partner-mark">
                  <span className="partner-brand-name">{partner.name}</span>
                  <span className="partner-brand-sub">{partner.sub}</span>
                </div>
              </div>
            ))}
            {/* Set 2 for seamless infinite loop */}
            {PARTNERS.map((partner, idx) => (
              <div key={`m2-${partner.id}-${idx}`} className="partner-logo-item" aria-hidden="true">
                <div className="partner-mark">
                  <span className="partner-brand-name">{partner.name}</span>
                  <span className="partner-brand-sub">{partner.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
