import { lazy, Suspense } from "react";
import HeroVideoBackground from "../components/HeroVideoBackground"; // above-fold, stays eager
import "./HomePage.css";

// Below-fold sections — lazy loaded so they don't block the hero from painting
const FacilitiesSection    = lazy(() => import("../components/FacilitiesSection"));
const SponsorsSection      = lazy(() => import("../components/SponsorsSection"));
const WhyChooseUs          = lazy(() => import("../components/WhyChooseUs"));
const CoachesHomePreview   = lazy(() => import("../components/CoachesHomePreview"));
const PlayerStatsCarousel  = lazy(() => import("../components/PlayerStatsCarousel"));
const AdmissionPlansSection = lazy(() => import("../components/AdmissionPlansSection"));
const GallerySection       = lazy(() => import("../components/GallerySection"));

// Lightweight section placeholder — no layout shift
function SectionFallback() {
  return <div style={{ minHeight: "200px", background: "#04070c" }} />;
}

function HomePage({ onSection }) {
  return (
    <main className="mg-home-landing">
      {/* 1. HERO SECTION WITH UNOBSTRUCTED VIDEO LOGO SHOWCASE & 3 CTAS */}
      <HeroVideoBackground
        onBookTurf={() => onSection("booking")}
        onJoinAcademy={() => onSection("admission")}
        onViewGallery={() => {
          const el = document.getElementById("gallery");
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
      <Suspense fallback={<SectionFallback />}>
        <FacilitiesSection onBookTurf={() => onSection("booking")} />
      </Suspense>

      {/* 3. OFFICIAL SPONSORS & PARTNERS SECTION */}
      <Suspense fallback={<SectionFallback />}>
        <SponsorsSection onPartnerWithUs={() => onSection("contact")} />
      </Suspense>

      {/* 4. WHY CHOOSE US (4-PILLARS / MOBILE TOUCH-SWIPEABLE DECK) */}
      <Suspense fallback={<SectionFallback />}>
        <WhyChooseUs onExploreFacilities={() => onSection("booking")} />
      </Suspense>

      {/* 5. COACHES SECTION (CLEAN PORTRAIT CARDS) */}
      <Suspense fallback={<SectionFallback />}>
        <CoachesHomePreview onMeetCoaches={() => onSection("coaches")} />
      </Suspense>

      {/* 6. DYNAMIC PLAYER STATS CAROUSEL */}
      <Suspense fallback={<SectionFallback />}>
        <PlayerStatsCarousel onViewAllStats={() => onSection("players")} />
      </Suspense>

      {/* 7. ADMISSION PLANS (WEEKDAY, WEEKEND, COMBO) */}
      <Suspense fallback={<SectionFallback />}>
        <AdmissionPlansSection onSelectPlan={() => onSection("admission")} />
      </Suspense>

      {/* 8. ACADEMY MOMENTS GALLERY (MARQUEE PHOTOS & VIDEOS ROWS) */}
      <Suspense fallback={<SectionFallback />}>
        <GallerySection />
      </Suspense>

      {/* 9. TURF CTA BANNER */}
      <section className="mg-turf-cta-section">
        <div className="home-section-container">
          <div className="turf-cta-box">
            <div className="turf-cta-text">
              <span className="turf-cta-badge">BOOK A SESSION</span>
              <h2>LOOKING TO PRACTICE OR PLAY A MATCH?</h2>
              <p>Book practice nets at Thengaithittu or our Open Turf Wicket Ground at Royapudupakkam.</p>
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
            <p>Connect with our coordinators via WhatsApp, Instagram, call, or visit our training centers.</p>
            <div className="contact-cta-btns-row">
              <button
                type="button"
                className="contact-main-btn"
                onClick={() => onSection("contact")}
              >
                📞 CONTACT HELPDESK →
              </button>
              <a
                href="https://www.instagram.com/mg_cricketers_den?igsi=MW5oODZ1bnd3d3VyZg=="
                target="_blank"
                rel="noopener noreferrer"
                className="contact-insta-direct-btn"
              >
                📸 VISIT INSTAGRAM →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
