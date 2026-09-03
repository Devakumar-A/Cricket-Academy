import React, { useState, useEffect, useRef } from "react";
import "./SponsorsSection.css";

const ALL_SPONSORS = [
  {
    id: "sg",
    name: "SG Cricket",
    fullName: "Sanspareils Greenlands",
    category: "equipment",
    role: "Official Match Balls & Pro Netting Gear",
    spec: "Tournament Match Balls",
    tag: "Match Gear",
    icon: "🏏",
    accent: "#fde047",
    founded: "Est. 1931"
  },
  {
    id: "ss",
    name: "SS TON",
    fullName: "Sareen Sports Industries",
    category: "equipment",
    role: "Elite Batting, Pads & Protective Kits",
    spec: "Pro Protective Kits",
    tag: "Kit Partner",
    icon: "🛡️",
    accent: "#60a5fa",
    founded: "Est. 1969"
  },
  {
    id: "gray-nicolls",
    name: "Gray-Nicolls",
    fullName: "Master English Willow",
    category: "equipment",
    role: "Handcrafted Batting Willow & Fielding Kits",
    spec: "English Willow Tech",
    tag: "Willow Partner",
    icon: "⚡",
    accent: "#f87171",
    founded: "Est. 1855"
  },
  {
    id: "kookaburra",
    name: "Kookaburra",
    fullName: "Cricket Turf Supplies",
    category: "equipment",
    role: "Turf Practice Supplies & Pitch Accessories",
    spec: "Pitch Accessories",
    tag: "Turf Partner",
    icon: "🎯",
    accent: "#34d399",
    founded: "Est. 1890"
  },
  {
    id: "enerzal",
    name: "Enerzal Pro",
    fullName: "Electrolyte Energy",
    category: "nutrition",
    role: "Match Day Hydration & Rapid Recovery Drinks",
    spec: "Electrolyte Rehydration",
    tag: "Hydration",
    icon: "💧",
    accent: "#38bdf8",
    founded: "Pro Grade"
  },
  {
    id: "fastandup",
    name: "Fast&Up",
    fullName: "Active Athletic Nutrition",
    category: "nutrition",
    role: "Athletic Stamina & Pre-Match Amino Boost",
    spec: "Active Sports Fuel",
    tag: "Nutrition",
    icon: "🔥",
    accent: "#fb923c",
    founded: "Informed Sport"
  },
  {
    id: "stancebeam",
    name: "StanceBeam",
    fullName: "Smart Bat Sensor & IoT",
    category: "tech",
    role: "3D Stroke Speed, Bat Angles & Video AI",
    spec: "Biomechanics & IoT",
    tag: "Tech Partner",
    icon: "📹",
    accent: "#c084fc",
    founded: "Smart Analytics"
  },
  {
    id: "royapudupakkam",
    name: "MG Open Ground",
    fullName: "Royapudupakkam Sports Complex",
    category: "venue",
    role: "Full-Sized Turf Match Ground & Tournaments",
    spec: "Match Day Stadium",
    tag: "Venue Associate",
    icon: "🏟️",
    accent: "#fde047",
    founded: "Puducherry"
  }
];

function SponsorsSection({ onPartnerWithUs }) {
  const [activeTab, setActiveTab] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef(null);

  const filteredSponsors = activeTab === "all" 
    ? ALL_SPONSORS 
    : ALL_SPONSORS.filter(s => s.category === activeTab);

  // -------------------------------------------------------------
  // AUTO-SWIPE ENGINE (Smooth Auto-Cycle every 3.4 seconds)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isPaused || isHovered || filteredSponsors.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 3400);

    return () => clearInterval(interval);
  }, [isPaused, isHovered, activeIndex, filteredSponsors.length]);

  // Scroll to active index smoothly
  const scrollToCard = (index) => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const cards = container.querySelectorAll(".sp-carousel-card");
    if (cards[index]) {
      const card = cards[index];
      const scrollLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % filteredSponsors.length;
    scrollToCard(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + filteredSponsors.length) % filteredSponsors.length;
    scrollToCard(prevIdx);
  };

  // Sync active index on manual swipe/scroll
  const handleScroll = () => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const cards = container.querySelectorAll(".sp-carousel-card");
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      if (Math.abs(containerCenter - cardCenter) < card.clientWidth / 2) {
        setActiveIndex(idx);
      }
    });
  };

  return (
    <section className="mg-sponsors-section" id="sponsors" aria-label="Official Sponsors and Partners">
      <div className="home-section-container">
        {/* SECTION HEADER */}
        <div className="section-heading-center">
          <span className="section-badge">OFFICIAL PARTNERS & SPONSORS</span>
          <h2 className="section-title">
            POWERING CRICKET <span className="gold-gradient-text">EXCELLENCE</span>
          </h2>
          <p className="section-subtitle">
            Supported by leading cricket manufacturers, athletic nutritionists, and performance analytics innovators.
          </p>
        </div>

        {/* INTERACTIVE CATEGORY FILTER TABS */}
        <div className="sp-filter-tabs-bar">
          <button
            type="button"
            className={`sp-filter-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => { setActiveTab("all"); setActiveIndex(0); }}
          >
            All Partners ({ALL_SPONSORS.length})
          </button>
          <button
            type="button"
            className={`sp-filter-tab ${activeTab === "equipment" ? "active" : ""}`}
            onClick={() => { setActiveTab("equipment"); setActiveIndex(0); }}
          >
            🏏 Gear & Kits
          </button>
          <button
            type="button"
            className={`sp-filter-tab ${activeTab === "nutrition" ? "active" : ""}`}
            onClick={() => { setActiveTab("nutrition"); setActiveIndex(0); }}
          >
            ⚡ Nutrition & Recovery
          </button>
          <button
            type="button"
            className={`sp-filter-tab ${activeTab === "tech" ? "active" : ""}`}
            onClick={() => { setActiveTab("tech"); setActiveIndex(0); }}
          >
            📹 Tech & Analytics
          </button>
        </div>

        {/* HIGH-LEVEL AUTO & MANUAL SWIPE CAROUSEL */}
        <div 
          className="sp-carousel-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Previous Navigation Arrow */}
          <button
            type="button"
            className="sp-nav-arrow sp-nav-prev"
            onClick={handlePrev}
            aria-label="Previous Sponsor"
          >
            ‹
          </button>

          {/* Swipeable Track */}
          <div 
            className="sp-carousel-track" 
            ref={trackRef}
            onScroll={handleScroll}
          >
            {filteredSponsors.map((partner, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={partner.id} 
                  className={`sp-carousel-card ${isActive ? "is-active-slide" : ""}`}
                  onClick={() => scrollToCard(index)}
                >
                  {/* Top Stage: Icon & Tag */}
                  <div className="sp-card-top-stage">
                    <span 
                      className="sp-icon-box" 
                      style={{ 
                        borderColor: `${partner.accent}45`, 
                        background: `${partner.accent}14` 
                      }}
                    >
                      {partner.icon}
                    </span>
                    <span 
                      className="sp-tag-pill" 
                      style={{ 
                        color: partner.accent, 
                        borderColor: `${partner.accent}55`, 
                        background: `${partner.accent}18` 
                      }}
                    >
                      {partner.tag}
                    </span>
                  </div>

                  {/* Middle Body: Brand Name & Specification */}
                  <div className="sp-card-body-stage">
                    <h3 className="sp-brand-title">{partner.name}</h3>
                    <span className="sp-brand-spec">{partner.spec}</span>
                    <p className="sp-brand-desc">{partner.role}</p>
                  </div>

                  {/* Bottom Footer: Verification & Badge */}
                  <div className="sp-card-footer-stage">
                    <div className="sp-verified-badge">
                      <span className="sp-green-dot" />
                      <span>Official Partner</span>
                    </div>
                    <span className="sp-founded-tag">{partner.founded}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Navigation Arrow */}
          <button
            type="button"
            className="sp-nav-arrow sp-nav-next"
            onClick={handleNext}
            aria-label="Next Sponsor"
          >
            ›
          </button>
        </div>

        {/* DOTS PAGINATION & LIVE AUTO-SWIPE STATUS */}
        <div className="sp-carousel-indicators">
          <div className="sp-dots-row">
            {filteredSponsors.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`sp-dot-indicator ${idx === activeIndex ? "active" : ""}`}
                onClick={() => scrollToCard(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <span className="sp-swipe-hint">
            👆 Swipe to explore partners
          </span>
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
