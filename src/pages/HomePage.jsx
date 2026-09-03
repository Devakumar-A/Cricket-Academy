import HeroVideoBackground from "../components/HeroVideoBackground";
import FacilitiesSection from "../components/FacilitiesSection";
import SponsorsSection from "../components/SponsorsSection";
import WhyChooseUs from "../components/WhyChooseUs";
import CoachesHomePreview from "../components/CoachesHomePreview";
import PlayerStatsCarousel from "../components/PlayerStatsCarousel";
import AdmissionPlansSection from "../components/AdmissionPlansSection";
import "./HomePage.css";

function HomePage({ onSection }) {
  return (
    <main className="mg-home-landing">
      {/* 1. HERO SECTION WITH UNOBSTRUCTED VIDEO LOGO SHOWCASE & 3 CTAS */}
      <HeroVideoBackground
        onBookTurf={() => onSection("booking")}
        onJoinAcademy={() => onSection("admission")}
        onViewGallery={() => {
          const el = document.getElementById("facilities") || document.querySelector(".mg-home-highlights-bar");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* 2. LIVE FLASH NEWS & ANNOUNCEMENTS MARQUEE TICKER */}
      <section className="mg-flash-news-ticker" aria-label="Live Academy Announcements">
        <div className="flash-news-badge">
          <span className="flash-live-dot" />
          <span className="flash-badge-text">FLASH NEWS</span>
        </div>

        <div className="flash-marquee-container">
          <div className="flash-marquee-track">
            {/* Loop Item Set 1 */}
            <div className="flash-news-item">
              <span className="flash-item-icon">⚡</span>
              <span className="flash-item-text">
                <strong>24/7 ONLINE BOOKING:</strong> Turf & Practice Nets can be booked 24 Hours Online with Instant Slot Confirmation
              </span>
            </div>
            <span className="flash-item-sep">✦</span>

            <div className="flash-news-item">
              <span className="flash-item-icon">🤝</span>
              <span className="flash-item-text">
                <strong>SPONSORSHIP & PARTNERSHIPS:</strong> For Tournament Sponsorship & Brand Partnerships, Contact{" "}
                <a href="tel:+918122432905" className="flash-link">+91 81224 32905</a>
              </span>
            </div>
            <span className="flash-item-sep">✦</span>

            <div className="flash-news-item">
              <span className="flash-item-icon">🏏</span>
              <span className="flash-item-text">
                <strong>ACADEMY ADMISSIONS OPEN:</strong> Weekday & Weekend Coaching Batches Open for Junior & Senior Players
              </span>
            </div>
            <span className="flash-item-sep">✦</span>

            <div className="flash-news-item">
              <span className="flash-item-icon">🏟️</span>
              <span className="flash-item-text">
                <strong>DUAL VENUE FACILITIES:</strong> Floodlit Astro & Natural Clay Turf Pitches at Thengaithittu & Royapudupakkam
              </span>
            </div>
            <span className="flash-item-sep">✦</span>

            {/* Duplicate Item Set 2 for seamless infinite loop */}
            <div className="flash-news-item" aria-hidden="true">
              <span className="flash-item-icon">⚡</span>
              <span className="flash-item-text">
                <strong>24/7 ONLINE BOOKING:</strong> Turf & Practice Nets can be booked 24 Hours Online with Instant Slot Confirmation
              </span>
            </div>
            <span className="flash-item-sep" aria-hidden="true">✦</span>

            <div className="flash-news-item" aria-hidden="true">
              <span className="flash-item-icon">🤝</span>
              <span className="flash-item-text">
                <strong>SPONSORSHIP & PARTNERSHIPS:</strong> For Tournament Sponsorship & Brand Partnerships, Contact{" "}
                <a href="tel:+918122432905" className="flash-link">+91 81224 32905</a>
              </span>
            </div>
            <span className="flash-item-sep" aria-hidden="true">✦</span>

            <div className="flash-news-item" aria-hidden="true">
              <span className="flash-item-icon">🏏</span>
              <span className="flash-item-text">
                <strong>ACADEMY ADMISSIONS OPEN:</strong> Weekday & Weekend Coaching Batches Open for Junior & Senior Players
              </span>
            </div>
            <span className="flash-item-sep" aria-hidden="true">✦</span>

            <div className="flash-news-item" aria-hidden="true">
              <span className="flash-item-icon">🏟️</span>
              <span className="flash-item-text">
                <strong>DUAL VENUE FACILITIES:</strong> Floodlit Astro & Natural Clay Turf Pitches at Thengaithittu & Royapudupakkam
              </span>
            </div>
            <span className="flash-item-sep" aria-hidden="true">✦</span>
          </div>
        </div>
      </section>

      {/* 2. FACILITIES INTERACTIVE SECTION */}
      <FacilitiesSection onBookTurf={() => onSection("booking")} />

      {/* 3. OFFICIAL SPONSORS & PARTNERS SECTION */}
      <SponsorsSection onPartnerWithUs={() => onSection("contact")} />

      {/* 4. WHY CHOOSE US (4-PILLARS / MOBILE TOUCH-SWIPEABLE DECK) */}
      <WhyChooseUs onExploreFacilities={() => onSection("booking")} />

      {/* 5. COACHES SECTION (CLEAN PORTRAIT CARDS) */}
      <CoachesHomePreview onMeetCoaches={() => onSection("coaches")} />

      {/* 6. DYNAMIC PLAYER STATS CAROUSEL */}
      <PlayerStatsCarousel onViewAllStats={() => onSection("players")} />

      {/* 7. ADMISSION PLANS (WEEKDAY, WEEKEND, COMBO) */}
      <AdmissionPlansSection onSelectPlan={() => onSection("admission")} />

      {/* 8. TURF CTA BANNER */}
      <section className="mg-turf-cta-section">
        <div className="home-section-container">
          <div className="turf-cta-box">
            <div className="turf-cta-text">
              <span className="turf-cta-badge">BOOK A SESSION</span>
              <h2>LOOKING TO PRACTICE OR PLAY A MATCH?</h2>
              <p>Book practice nets at Thengaithittu or our Open Match Ground at Royapudupakkam.</p>
            </div>
            <button
              type="button"
              className="turf-cta-btn"
              onClick={() => onSection("booking")}
            >
              🏏 BOOK A TURF NOW →
            </button>
          </div>
        </div>
      </section>

      {/* 9. CONTACT CTA SECTION */}
      <section className="mg-contact-cta-section">
        <div className="home-section-container">
          <div className="contact-cta-box">
            <h2>HAVE QUESTIONS ABOUT ADMISSION OR TURF SLOTS?</h2>
            <p>Connect with our coordinators via WhatsApp, call, or visit our training centers.</p>
            <button
              type="button"
              className="contact-main-btn"
              onClick={() => onSection("contact")}
            >
              📞 CONTACT US →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
