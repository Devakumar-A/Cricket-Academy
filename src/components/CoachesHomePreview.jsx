import "./CoachesHomePreview.css";

const coachesData = [
  {
    id: "george-samuel",
    name: "George Samuel",
    role: "COACH",
    image: "/coaches/george-samuel.jpg",
  },
  {
    id: "tharun",
    name: "Tharun",
    role: "COACH",
    image: "/coaches/tharun.png",
  },
  {
    id: "antony",
    name: "Antony",
    role: "COACH",
    image: "/coaches/antony.png",
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
                  <div className="coach-card-glass-overlay">
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <span className="coach-item-role">{coach.role}</span>
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
                  <div className="coach-card-glass-overlay">
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <span className="coach-item-role">{coach.role}</span>
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
                  <div className="coach-card-glass-overlay">
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <span className="coach-item-role">{coach.role}</span>
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
          MEET OUR COACHES →
        </button>
      </div>
    </section>
  );
}

export default CoachesHomePreview;
