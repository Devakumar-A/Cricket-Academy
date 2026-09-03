import React from "react";
import "./SponsorsSection.css";

const SPONSORS_DATA = [
  {
    category: "OFFICIAL GEAR & EQUIPMENT",
    partners: [
      {
        id: "sg",
        name: "SG Cricket",
        fullName: "Sanspareils Greenlands",
        role: "Official Match Balls & Net Gear",
        tag: "Equipment Partner",
        icon: "🏏",
        accent: "#fde047"
      },
      {
        id: "ss",
        name: "SS TON",
        fullName: "Sareen Sports Industries",
        role: "Protective & Batting Equipment",
        tag: "Kit Partner",
        icon: "🛡️",
        accent: "#60a5fa"
      },
      {
        id: "gray-nicolls",
        name: "Gray-Nicolls",
        fullName: "Master Willow Bats",
        role: "Batting Technique Partner",
        tag: "Gear Partner",
        icon: "⚡",
        accent: "#f87171"
      },
      {
        id: "kookaburra",
        name: "Kookaburra",
        fullName: "Turf Practice Supplies",
        role: "Tournament Pitch Accessories",
        tag: "Turf Partner",
        icon: "🎯",
        accent: "#34d399"
      }
    ]
  },
  {
    category: "PERFORMANCE, NUTRITION & ANALYTICS",
    partners: [
      {
        id: "enerzal",
        name: "Enerzal Pro",
        fullName: "Electrolyte Rehydration",
        role: "Hydration & Match Day Energy",
        tag: "Hydration Partner",
        icon: "💧",
        accent: "#38bdf8"
      },
      {
        id: "fastandup",
        name: "Fast&Up",
        fullName: "Active Athletic Nutrition",
        role: "Recovery & Stamina Support",
        tag: "Nutrition Partner",
        icon: "🔥",
        accent: "#fb923c"
      },
      {
        id: "stancebeam",
        name: "StanceBeam",
        fullName: "Smart Bat Sensor Tech",
        role: "Stroke Speed & 3D Analytics",
        tag: "Tech Partner",
        icon: "📹",
        accent: "#a855f7"
      },
      {
        id: "royapudupakkam",
        name: "MG Open Ground",
        fullName: "Royapudupakkam Venue",
        role: "Match Simulations & Turf Tournaments",
        tag: "Venue Associate",
        icon: "🏟️",
        accent: "#fde047"
      }
    ]
  }
];

function SponsorsSection({ onPartnerWithUs }) {
  return (
    <section className="mg-sponsors-section" id="sponsors" aria-label="Official Sponsors and Partners">
      <div className="home-section-container">
        {/* SECTION HEADER */}
        <div className="section-heading-center">
          <span className="section-badge">OFFICIAL SPONSORS & PARTNERS</span>
          <h2 className="section-title">
            POWERING CRICKET <span className="gold-gradient-text">EXCELLENCE</span>
          </h2>
          <p className="section-subtitle">
            Supported by premier cricket equipment manufacturers, athletic performance innovators, and regional sports associates.
          </p>
        </div>

        {/* SPONSOR CATEGORY GRIDS */}
        <div className="sponsors-wrapper">
          {SPONSORS_DATA.map((catGroup, idx) => (
            <div key={idx} className="sponsors-cat-block">
              <div className="sponsors-cat-header">
                <span className="sponsors-cat-line" />
                <span className="sponsors-cat-title">{catGroup.category}</span>
                <span className="sponsors-cat-line" />
              </div>

              <div className="sponsors-grid">
                {catGroup.partners.map((partner) => (
                  <div key={partner.id} className="sponsor-card">
                    <div className="sponsor-card-top">
                      <span className="sponsor-icon-stage" style={{ borderColor: `${partner.accent}40`, background: `${partner.accent}12` }}>
                        {partner.icon}
                      </span>
                      <span className="sponsor-badge" style={{ color: partner.accent, borderColor: `${partner.accent}50`, background: `${partner.accent}15` }}>
                        {partner.tag}
                      </span>
                    </div>

                    <div className="sponsor-card-body">
                      <h3 className="sponsor-brand-name">{partner.name}</h3>
                      <span className="sponsor-full-name">{partner.fullName}</span>
                      <p className="sponsor-role-desc">{partner.role}</p>
                    </div>

                    <div className="sponsor-card-footer">
                      <span className="sponsor-verified-dot" />
                      <span className="sponsor-verified-text">Official Academy Partner</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PARTNERSHIP & SPONSORSHIP INVITATION BANNER */}
        <div className="sponsorship-invite-box">
          <div className="invite-box-content">
            <div className="invite-icon-wrap">🤝</div>
            <div className="invite-text-wrap">
              <h4>WANT TO PARTNER OR SPONSOR MG CRICKETER'S DEN?</h4>
              <p>Promote your brand across our 2 training venues, tournaments, match live-streams, and student kit packages.</p>
            </div>
          </div>
          <button
            type="button"
            className="invite-partner-btn"
            onClick={onPartnerWithUs}
          >
            PARTNER WITH US →
          </button>
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;
