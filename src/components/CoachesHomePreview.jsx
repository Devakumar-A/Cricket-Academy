import { useRef, useState } from "react";
import "./CoachesHomePreview.css";

const coachesData = [
  {
    id: "george-samuel",
    name: "George Samuel",
    role: "HEAD CRICKET COACH",
    image: "/coaches/george-samuel.jpg",
  },
  {
    id: "tharun",
    name: "Tharun",
    role: "CRICKET COACH",
    image: "/coaches/tharun.png",
  },
  {
    id: "antony",
    name: "Antony",
    role: "CRICKET COACH",
    image: "/coaches/antony.png",
  },
];

// -------------------------------------------------------------
// 3D INTERACTIVE TILT COACH CARD COMPONENT
// -------------------------------------------------------------
function Coach3DTiltCard({ coach, onMeetCoaches }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12; // Max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotX, y: rotY, glareX, glareY, active: true });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  }

  return (
    <div
      ref={cardRef}
      className={`coach-3d-card ${tilt.active ? "active-tilt" : ""}`}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onMeetCoaches}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onMeetCoaches();
        }
      }}
    >
      {/* 3D Holographic Light Glare Overlay */}
      <div
        className="coach-3d-glare"
        style={{
          opacity: tilt.active ? 1 : 0,
          background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(253, 224, 71, 0.22) 0%, rgba(212, 160, 23, 0.05) 45%, transparent 70%)`,
        }}
      />

      {/* Portrait Stage */}
      <div className="coach-image-stage">
        {coach.image ? (
          <img
            src={coach.image}
            alt={coach.name}
            className="coach-portrait-img"
          />
        ) : (
          <div className="coach-placeholder-slot">
            <span className="coach-den-stamp">MG COACH</span>
          </div>
        )}

        <div className="coach-stage-overlay"></div>
      </div>

      {/* Name Footer */}
      <div className="coach-info-footer">
        <h3 className="coach-display-name">{coach.name}</h3>
        <span className="coach-title-sub">{coach.role}</span>
        <div className="coach-card-glow-bar"></div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN HOME COACHES PREVIEW SECTION
// -------------------------------------------------------------
function CoachesHomePreview({ onMeetCoaches }) {
  return (
    <section className="coaches-home-section" id="coaches-preview">
      <div className="home-section-container">
        {/* Section Heading */}
        <div className="section-heading-center">
          <span className="section-badge">EXPERT COACHING</span>
          <h2 className="section-title">TRAIN WITH PURPOSE</h2>
          <p className="section-subtitle">
            Dedicated domestic cricket coaches committed to developing every player's technical and tactical potential.
          </p>
        </div>

        {/* 3D Animated Coaches Photo Grid */}
        <div className="coaches-3d-grid">
          {coachesData.map((coach) => (
            <Coach3DTiltCard
              key={coach.id}
              coach={coach}
              onMeetCoaches={onMeetCoaches}
            />
          ))}
        </div>

        {/* CTA to full Coaches page */}
        <div className="coaches-home-cta-wrap">
          <button
            type="button"
            className="coaches-view-all-btn"
            onClick={onMeetCoaches}
          >
            MEET OUR COACHES →
          </button>
        </div>
      </div>
    </section>
  );
}

export default CoachesHomePreview;
