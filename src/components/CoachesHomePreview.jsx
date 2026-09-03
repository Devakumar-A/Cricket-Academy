import "./CoachesHomePreview.css";

const coachesData = [
  {
    id: "george-samuel",
    name: "George Samuel",
    role: "COACH",
    specialty: "Batting Technique & Strategy",
    image: "/coaches/george-samuel.jpg",
    badge: "Senior Coach",
  },
  {
    id: "tharun",
    name: "Tharun",
    role: "COACH",
    specialty: "Fast Bowling & Pace Lab",
    image: "/coaches/tharun.png",
    badge: "Pace Specialist",
  },
  {
    id: "antony",
    name: "Antony",
    role: "COACH",
    specialty: "Spin Mastery & Fielding Drills",
    image: "/coaches/antony.png",
    badge: "Tactics & Spin",
  },
];

function CoachesHomePreview({ onMeetCoaches }) {
  return (
    <section className="coaches-home-section" id="coaches-preview" aria-label="Our Coaching Faculty">
      <div className="home-section-container">
        {/* Section Heading */}
        <div className="section-heading-center">
          <span className="section-badge">EXPERT COACHING</span>
          <h2 className="section-title">TRAIN WITH PURPOSE</h2>
          <p className="section-subtitle">
            Dedicated domestic cricket coaches committed to developing every player&apos;s technical and tactical potential.
          </p>
        </div>
      </div>

      {/* ============================================================
          COACHES CONTINUOUS MARQUEE CAROUSEL
          ============================================================ */}
      <div className="coaches-marquee-block">
        <div className="coaches-row-label">
          <span className="coaches-live-pill">🏏 COACHING FACULTY</span>
          <span className="coaches-hint-text">Hover or touch to pause • Tap to meet</span>
        </div>

        <div className="coaches-marquee-wrapper">
          <div className="coaches-marquee-track">
            {/* Set 1 */}
            {coachesData.map((coach, idx) => (
              <div
                key={`coach-1-${idx}`}
                className="coach-marquee-card"
                onClick={onMeetCoaches}
                role="button"
                tabIndex={0}
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    loading="lazy"
                    className="coach-card-media"
                  />
                  <span className="coach-card-badge">{coach.badge}</span>
                  <div className="coach-card-glass-overlay">
                    <span className="coach-item-role">{coach.role}</span>
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <p className="coach-item-spec">{coach.specialty}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Set 2 (Duplicate for Continuous Infinite Loop) */}
            {coachesData.map((coach, idx) => (
              <div
                key={`coach-2-${idx}`}
                className="coach-marquee-card"
                onClick={onMeetCoaches}
                role="button"
                tabIndex={0}
                aria-hidden="true"
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    loading="lazy"
                    className="coach-card-media"
                  />
                  <span className="coach-card-badge">{coach.badge}</span>
                  <div className="coach-card-glass-overlay">
                    <span className="coach-item-role">{coach.role}</span>
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <p className="coach-item-spec">{coach.specialty}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Set 3 (Triple for Ultra-Smooth Continuous Rolling on Widescreens) */}
            {coachesData.map((coach, idx) => (
              <div
                key={`coach-3-${idx}`}
                className="coach-marquee-card"
                onClick={onMeetCoaches}
                role="button"
                tabIndex={0}
                aria-hidden="true"
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    loading="lazy"
                    className="coach-card-media"
                  />
                  <span className="coach-card-badge">{coach.badge}</span>
                  <div className="coach-card-glass-overlay">
                    <span className="coach-item-role">{coach.role}</span>
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <p className="coach-item-spec">{coach.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="coaches-home-cta-wrap">
        <button
          type="button"
          className="coaches-view-all-btn"
          onClick={onMeetCoaches}
        >
          MEET ALL COACHES & MENTORS →
        </button>
      </div>
    </section>
  );
}

export default CoachesHomePreview;
