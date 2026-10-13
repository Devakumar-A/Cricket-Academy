import { useEffect } from "react";
import "./TermsPage.css";

export default function TermsPage({ onHome }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main className="terms-page-wrapper">
      <div className="terms-container">
        {/* Navigation Bar */}
        <div className="terms-nav-bar">
          <button
            type="button"
            className="terms-back-btn"
            onClick={onHome || (() => { window.location.href = "/"; })}
          >
            ← Back to Home
          </button>
          <span className="terms-tag">TERMS OF SERVICE</span>
        </div>

        <header className="terms-header">
          <div className="terms-badge">MG CRICKETER'S DEN</div>
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-meta">
            Last Updated: October 2026 • Governing Law: Puducherry, India
          </p>
        </header>

        <article className="terms-content">
          <section className="terms-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing our website (<a href="https://mgcricketersden.com">https://mgcricketersden.com</a>), booking floodlit turf nets, enrolling in our cricket coaching academy batches, or entering the premises of <strong>MG CRICKETER'S DEN</strong> at Thengaithittu or Royapudupakkam, you agree to be bound by these Terms of Service.
            </p>
            <p>
              If you do not agree with any part of these terms, you must not use our website or facilities.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. User Accounts & Security</h2>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your login credentials (email, password, or Google account).</li>
              <li>You agree to provide accurate, up-to-date player registration details when applying for admissions or reserving slots.</li>
              <li>MG Cricketer's Den reserves the right to suspend accounts that engage in fraudulent bookings or violate facility etiquette.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Turf & Net Reservation Policy</h2>
            <ul>
              <li><strong>Slot Timings:</strong> Practice sessions must start and conclude promptly within the booked slot to ensure courteous handover to succeeding players.</li>
              <li><strong>Footwear & Equipment:</strong> Rubber studs or flat-sole turf shoes are strictly mandatory on astro turf pitches. Metal spikes are prohibited on artificial turf. Full cricket safety gear (helmet, pads, gloves, guard) is strongly advised when facing hard cricket balls or bowling machines.</li>
              <li><strong>Automated Bowling Machines:</strong> Bowling machines must only be operated by authorized academy staff or trained senior players under supervision.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Academy Admissions & Coaching Fees</h2>
            <ul>
              <li>Admission into weekday, weekend, or high-performance summer camps requires completed registration, medical disclosure, and applicable fee settlement.</li>
              <li>Academy schedules, coach allocations, and match fixtures are subject to weather conditions and tournament commitments.</li>
              <li>Refund requests for cancelled batch subscriptions are subject to administrative review on a case-by-case basis.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Facility Conduct, Safety & Liability</h2>
            <ul>
              <li>Cricket is an active sport involving hard leather balls and high velocity bats. Participants and guardians acknowledge inherent physical risks.</li>
              <li>Players and visitors must exercise due caution, respect fellow athletes, coaches, and facility staff, and adhere to ground safety guidelines.</li>
              <li>MG Cricketer's Den is not liable for loss or damage to personal belongings brought to the facility grounds.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Intellectual Property & Brand Rights</h2>
            <p>
              The MG Cricketer's Den lion crest, logos, videos, graphics, audio, and web content are protected by trademark and intellectual property rights. Reproduction or modification without prior written authorization is prohibited.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Governing Jurisdiction & Contact</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Puducherry, India. For questions or service inquiries, reach out to:
            </p>
            <div className="terms-contact-card">
              <p><strong>MG CRICKETER'S DEN</strong></p>
              <p>📍 North Street, Thengaithittu, Puducherry 605004, India</p>
              <p>📞 Phone: +91 81224 32905 / +91 94432 43290</p>
              <p>✉️ Email: <a href="mailto:mgcricketersden@gmail.com">mgcricketersden@gmail.com</a></p>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
