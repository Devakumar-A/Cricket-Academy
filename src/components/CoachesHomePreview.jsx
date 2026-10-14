import "./CoachesHomePreview.css";

const coachesData = [
  {
    id: "george-samuel",
    name: "George Samuel",
    role: "COACH",
    image: "/coaches/george-samuel.webp",
  },
  {
    id: "tharun",
    name: "Tharun",
    role: "COACH",
    image: "/coaches/tharun.webp",
  },
  {
    id: "antony",
    name: "Antony",
    role: "COACH",
    image: "/coaches/antony.webp",
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
          <span className="coaches-live-pill">COACHING FACULTY</span>
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
                aria-label={`Meet Coach ${coach.name}`}
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt={`${coach.name} - Expert Cricket Coach at MG Cricketer's Den Thengaithittu Pondicherry`}
                    loading="lazy"
                    decoding="async"
                    width="280"
                    height="350"
                    className="coach-card-media"
                  />
                  <div className="coach-card-glass-overlay">
                    <h3 className="coach-item-name">{coach.name}</h3>
                    <span className="coach-item-role">{coach.role}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Set 2 (Decorative Duplicate for Continuous Infinite Loop - Non-Focusable) */}
            {coachesData.map((coach, idx) => (
              <div
                key={`coach-2-${idx}`}
                className="coach-marquee-card"
                aria-hidden="true"
                tabIndex={-1}
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="280"
                    height="350"
                    className="coach-card-media"
                  />
                  <div className="coach-card-glass-overlay">
                    <span className="coach-item-name">{coach.name}</span>
                    <span className="coach-item-role">{coach.role}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Set 3 (Decorative Triple for Continuous Rolling on Widescreens - Non-Focusable) */}
            {coachesData.map((coach, idx) => (
              <div
                key={`coach-3-${idx}`}
                className="coach-marquee-card"
                aria-hidden="true"
                tabIndex={-1}
              >
                <div className="coach-card-image-box">
                  <img
                    src={coach.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="280"
                    height="350"
                    className="coach-card-media"
                  />
                  <div className="coach-card-glass-overlay">
                    <span className="coach-item-name">{coach.name}</span>
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
