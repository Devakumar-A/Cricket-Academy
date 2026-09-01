import "./AdmissionPlansSection.css";

const admissionPlans = [
  {
    id: "weekday",
    title: "WEEKDAY BATCH",
    price: "₹1,999",
    period: "/ MONTH",
    description: "Structured weekday training for players who want consistent practice and focused skill development.",
    features: [
      "Professional Cricket Coaching",
      "Regular Practice Sessions",
      "Batting & Bowling Development",
    ],
    highlight: false,
  },
  {
    id: "weekend",
    title: "WEEKEND BATCH",
    price: "₹1,999",
    period: "/ MONTH",
    description: "Focused weekend cricket training designed for players who need a flexible training schedule.",
    features: [
      "Professional Cricket Coaching",
      "Weekend Practice Sessions",
      "Skill Development",
    ],
    highlight: false,
  },
  {
    id: "combo",
    title: "COMBO BATCH",
    price: "₹2,499",
    period: "/ MONTH",
    description: "A comprehensive training option combining more practice opportunities for players focused on overall development.",
    features: [
      "Professional Cricket Coaching",
      "Fitness & Skills",
      "Match Practice",
    ],
    highlight: true,
  },
];

function AdmissionPlansSection({ onSelectAdmission }) {
  return (
    <section className="admission-plans-section" id="admissions">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="section-heading-center">
          <span className="section-badge">ADMISSIONS OPEN</span>
          <h2 className="section-title">TRAIN. IMPROVE. PERFORM.</h2>
          <p className="section-subtitle">
            Choose the training plan that fits your schedule and take the next step in your cricket journey.
          </p>
        </div>

        {/* THREE ADMISSION CARDS */}
        <div className="plans-grid">
          {admissionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`admission-card ${plan.highlight ? "combo-highlight" : ""}`}
              onClick={onSelectAdmission}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectAdmission();
                }
              }}
            >
              {plan.highlight && (
                <div className="combo-ribbon">
                  ★ COMPLETE TRAINING
                </div>
              )}

              <div className="plan-card-top">
                <span className="plan-brand-label">MG CRICKETER'S DEN</span>
                <h3 className="plan-title">{plan.title}</h3>
              </div>

              <div className="plan-price-block">
                <span className="plan-currency">₹</span>
                <span className="plan-amount">{plan.price.replace("₹", "")}</span>
                <span className="plan-period">{plan.period}</span>
              </div>

              <p className="plan-description">{plan.description}</p>

              <div className="plan-features-list">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="plan-feature-item">
                    <span className="plan-check-icon">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="plan-cta-wrapper">
                <button
                  type="button"
                  className="plan-explore-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAdmission();
                  }}
                >
                  EXPLORE PLAN →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION CTA */}
        <div className="plans-bottom-cta">
          <div className="bottom-cta-text">
            <h3>READY TO START YOUR CRICKET JOURNEY?</h3>
            <p>Explore our admission options and find the training plan that fits your schedule.</p>
          </div>
          <button className="bottom-cta-btn" onClick={onSelectAdmission}>
            VIEW ADMISSION DETAILS →
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdmissionPlansSection;
