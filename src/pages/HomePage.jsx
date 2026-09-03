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

      {/* 2. ELITE TRAINING HUBS & VENUE STATUS STRIP */}
      <section className="mg-live-action-strip" aria-label="Academy Training Venues & Operating Hours">
        <div className="home-section-container">
          <div className="live-strip-inner">
            <div className="live-venue-hubs">
              <div className="venue-hub-item">
                <span className="hub-tag gold-tag">MAIN ACADEMY</span>
                <span className="hub-name">MG Training Complex, Thengaithittu</span>
                <span className="hub-desc">(Daily Coaching, Turf & Astro Nets)</span>
              </div>
              
              <span className="hub-separator" aria-hidden="true">|</span>
              
              <div className="venue-hub-item">
                <span className="hub-tag cyan-tag">MATCH STADIUM</span>
                <span className="hub-name">MG Open Ground, Royapudupakkam</span>
                <span className="hub-desc">(11v11 Match Simulations & Tournaments)</span>
              </div>
            </div>

            <div className="live-hours-pill">
              <span className="live-pulse-dot" />
              <span className="hours-text">Open Daily: 6:00 AM – 10:00 PM</span>
            </div>
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
