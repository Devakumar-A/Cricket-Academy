import { useState } from "react";
import "./ContactPage.css";

function ContactPage({ onBack, onSection }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiryType: "Academy Admission",
    message: "",
  });

  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How can I book an Astro Turf or Natural Turf net slot?",
      a: "You can book directly via our online Turf Booking system or message our coordinator on WhatsApp (+91 83008 79748) for real-time slot confirmation.",
    },
    {
      q: "What training batches are currently active at the academy?",
      a: "We offer Regular Weekday Morning & Evening batches, Weekend Intensive Batches, and Specialized 1-on-1 Fast Bowling & Batting coaching clinics.",
    },
    {
      q: "Can corporate teams or external clubs book the Royapudupakkam Match Ground?",
      a: "Yes! Full-ground match slots are available on weekends and weekdays for corporate tournaments, club league matches, and team practice games.",
    },
    {
      q: "Where are the academy practice facilities located?",
      a: "Our Net Facilities (Astro & Natural turf) are at Thengaithittu, Puducherry, and our full-size Match Arena is at Royapudupakkam, Puducherry.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendWhatsApp = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide your name and phone number.");
      return;
    }

    const text = `*New Inquiry via MG Website*
👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🎯 *Inquiry Type:* ${formData.inquiryType}
📝 *Message:* ${formData.message || "I would like more information."}`;

    const url = `https://wa.me/918300879748?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="contact-page-wrapper">
      {/* ============================================================
          1. CONTACT PAGE HERO BANNER
          ============================================================ */}
      <section className="contact-hero-banner">
        <div className="contact-hero-inner">
          <button
            type="button"
            className="contact-back-btn"
            onClick={onBack}
            aria-label="Back to home"
          >
            ← Back to Home
          </button>

          <div className="contact-badge-pill">
            <span className="badge-glow-dot"></span>
            <span>DIRECT ATHLETE & ADMISSION HELPDESK</span>
          </div>

          <h1 className="contact-hero-title">
            GET IN TOUCH WITH <span className="gold-text-glow">THE DEN</span>
          </h1>

          <p className="contact-hero-subtitle">
            Whether you want to join our high-performance academy, book practice nets, or reserve the match ground, our coordinators are here to assist you 7 days a week.
          </p>
        </div>
      </section>

      {/* ============================================================
          2. DIRECT CHANNELS GRID (4 CHANNELS)
          ============================================================ */}
      <section className="contact-main-body">
        <div className="contact-page-container">
          <div className="channels-cards-grid">
            {/* WhatsApp */}
            <a
              href="https://wa.me/918300879748"
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card channel-wa"
            >
              <div className="channel-icon-box wa-icon">💬</div>
              <div className="channel-info">
                <span className="channel-tag">INSTANT RESPONSE</span>
                <h3>WhatsApp Coordinator</h3>
                <p>Chat live for batch slots, fee details & turf booking.</p>
                <div className="channel-highlight">+91 83008 79748</div>
              </div>
              <span className="channel-action-arrow">Chat Now →</span>
            </a>

            {/* Instagram Official Page */}
            <a
              href="https://www.instagram.com/mg_cricketers_den?igsi=MW5oODZ1bnd3d3VyZg=="
              target="_blank"
              rel="noopener noreferrer"
              className="channel-card channel-insta"
            >
              <div className="channel-icon-box insta-icon">📸</div>
              <div className="channel-info">
                <span className="channel-tag insta-tag">OFFICIAL INSTAGRAM</span>
                <h3>@mg_cricketers_den</h3>
                <p>Follow for live match reels, training clips & announcements.</p>
                <div className="channel-highlight">@mg_cricketers_den</div>
              </div>
              <span className="channel-action-arrow">Follow on Instagram →</span>
            </a>

            {/* Phone Helpline */}
            <a
              href="tel:+919597318892"
              className="channel-card channel-phone"
            >
              <div className="channel-icon-box phone-icon">📞</div>
              <div className="channel-info">
                <span className="channel-tag">DIRECT CALL</span>
                <h3>Helpline & Inquiries</h3>
                <p>Speak directly with head coaches and admin staff.</p>
                <div className="channel-highlight">+91 95973 18892</div>
              </div>
              <span className="channel-action-arrow">Call Desk →</span>
            </a>

            {/* Email */}
            <a
              href="mailto:mgcricketersden@gmail.com"
              className="channel-card channel-email"
            >
              <div className="channel-icon-box email-icon">✉️</div>
              <div className="channel-info">
                <span className="channel-tag">OFFICIAL DESK</span>
                <h3>Email Inquiries</h3>
                <p>Tournament entries, corporate bookings & sponsorship.</p>
                <div className="channel-highlight">mgcricketersden@gmail.com</div>
              </div>
              <span className="channel-action-arrow">Send Mail →</span>
            </a>

            {/* Operating Hours */}
            <div className="channel-card channel-hours">
              <div className="channel-icon-box hours-icon">⏰</div>
              <div className="channel-info">
                <span className="channel-tag">ACADEMY TIMINGS</span>
                <h3>Operating Hours</h3>
                <p>Morning & Evening sessions + Night Floodlight slots.</p>
                <div className="channel-highlight">5:30 AM – 11:30 PM (Daily)</div>
              </div>
              <span className="channel-status-open">🟢 Active Every Day</span>
            </div>
          </div>

          {/* ============================================================
              3. INQUIRY FORM & VENUES SPLIT ROW
              ============================================================ */}
          <div className="contact-split-grid">
            {/* Quick Inquiry Form */}
            <div className="contact-form-card">
              <div className="card-top-header">
                <span className="form-eyebrow">QUICK MESSAGE</span>
                <h2>Send Direct Inquiry</h2>
                <p>Fill out the form below to send an instant structured inquiry straight to our academy coordinators via WhatsApp.</p>
              </div>

              <form onSubmit={handleSendWhatsApp} className="contact-inquiry-form">
                <div className="form-group-row">
                  <div className="form-field">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label>Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Inquiry Category</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                  >
                    <option value="Academy Admission">🎓 Academy Admission & Batches</option>
                    <option value="Astro Turf Booking">🏏 Astro Turf Practice Net Slot</option>
                    <option value="Natural Turf Booking">🌱 Natural Turf Practice Net Slot</option>
                    <option value="Match Ground Arena">🏟️ Royapudupakkam Match Ground</option>
                    <option value="1-on-1 Coaching">🎯 Personal 1-on-1 Coaching Clinic</option>
                    <option value="Other">💬 General Question / Feedback</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Message / Requirements (Optional)</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Describe your preferred timing, experience level, or specific requirements..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" className="form-submit-btn">
                  <span>💬 Send Inquiry via WhatsApp</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>

            {/* VENUES & GROUNDS SHOWCASE */}
            <div className="venues-column">
              <div className="card-top-header">
                <span className="form-eyebrow">OUR VENUES</span>
                <h2>Training Locations</h2>
                <p>Visit our two world-class facilities in Puducherry for practice and match preparation.</p>
              </div>

              {/* Venue 1: Thengaithittu */}
              <div className="venue-card-item">
                <div className="venue-header-row">
                  <span className="venue-badge gold-badge">PRACTICE NETS FACILITY</span>
                  <span className="venue-dot">Active 🟢</span>
                </div>
                <h3>Thengaithittu Facility</h3>
                <p className="venue-address">
                  📍 North St, Thengaithittu, Puducherry, 605004
                </p>
                <div className="venue-chips-wrap">
                  <span className="v-chip">🏏 1 Astro Turf Net</span>
                  <span className="v-chip">🌱 1 Natural Clay Net</span>
                  <span className="v-chip">⚡ LED Floodlights</span>
                  <span className="v-chip">🎯 Bowling Machine</span>
                </div>
                <div className="venue-actions-row">
                  <a
                    href="https://maps.google.com/?q=Thengaithittu+Puducherry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="venue-map-link"
                  >
                    🗺️ Open in Google Maps →
                  </a>
                  {onSection && (
                    <button
                      type="button"
                      className="venue-book-link"
                      onClick={() => onSection("booking")}
                    >
                      Book Slot 🏏
                    </button>
                  )}
                </div>
              </div>

              {/* Venue 2: Royapudupakkam */}
              <div className="venue-card-item arena-card">
                <div className="venue-header-row">
                  <span className="venue-badge green-badge">FULL MATCH GROUND</span>
                  <span className="venue-dot">Active 🟢</span>
                </div>
                <h3>Royapudupakkam Arena</h3>
                <p className="venue-address">
                  📍 Main Ground, Royapudupakkam, Puducherry
                </p>
                <div className="venue-chips-wrap">
                  <span className="v-chip">🏟️ Full Match Arena</span>
                  <span className="v-chip">🌱 Center Pitch</span>
                  <span className="v-chip">🏆 Match Simulation</span>
                  <span className="v-chip">🏏 League Prep</span>
                </div>
                <div className="venue-actions-row">
                  <a
                    href="https://maps.google.com/?q=Royapudupakkam+Puducherry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="venue-map-link"
                  >
                    🗺️ Open in Google Maps →
                  </a>
                  <a
                    href="https://wa.me/918300879748?text=I%20am%20interested%20in%20booking%20the%20Royapudupakkam%20Match%20Ground."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="venue-book-link green-book"
                  >
                    Inquire Ground 🏟️
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. FAQ ACCORDION
              ============================================================ */}
          <div className="contact-faq-section">
            <div className="faq-header-center">
              <span className="form-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2>Got Questions? We Have Answers</h2>
            </div>

            <div className="faq-accordion-list">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`faq-item-card ${activeFaq === idx ? "expanded" : ""}`}
                  onClick={() => toggleFaq(idx)}
                >
                  <div className="faq-question-row">
                    <h4>{faq.q}</h4>
                    <span className="faq-toggle-icon">{activeFaq === idx ? "−" : "+"}</span>
                  </div>
                  {activeFaq === idx && (
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
