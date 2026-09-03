import { useState, useEffect, useRef } from "react";
import "./HeroVideoBackground.css";

function HeroVideoBackground({ onBookTurf, onJoinAcademy }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 768;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1.0;
      video.defaultPlaybackRate = 1.0;

      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch(() => {
            // In case browser power-saving or policy restricts autoplay, retry on user interaction
            const handleUserInteraction = () => {
              video.play().catch(() => {});
              window.removeEventListener("touchstart", handleUserInteraction);
              window.removeEventListener("click", handleUserInteraction);
            };
            window.addEventListener("touchstart", handleUserInteraction, { once: true, passive: true });
            window.addEventListener("click", handleUserInteraction, { once: true });
          });
      }
    }
  }, [isMobile]);

  return (
    <section className="hero-video-wrapper" aria-label="Hero Section">
      {/* -------------------------------------------------------------
          1. ULTRA-SMOOTH HARDWARE ACCELERATED DUAL VIDEO (MOBILE / DESKTOP)
          ------------------------------------------------------------- */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          key={isMobile ? "mobile-video" : "desktop-video"}
          className={`hero-bg-video ${videoLoaded ? "is-loaded" : ""}`}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
        >
          {isMobile ? (
            <>
              <source src="/video/hero-video-mobile.mp4" type="video/mp4" />
              <source src="/videos/hero-video-mobile.mp4" type="video/mp4" />
            </>
          ) : (
            <>
              <source src="/video/hero-video.mp4" type="video/mp4" />
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </>
          )}
          Your browser does not support the video tag.
        </video>
      </div>

      {/* -------------------------------------------------------------
          2. LUXURY CINEMATIC CONTRAST OVERLAYS
          ------------------------------------------------------------- */}
      <div className="hero-video-overlay overlay-dark-gradient" aria-hidden="true" />
      <div className="hero-video-overlay overlay-center-shield" aria-hidden="true" />

      {/* -------------------------------------------------------------
          3. HERO CENTRAL CONTENT IN HIGH-CONTRAST OBSIDIAN GLASS CARD
          ------------------------------------------------------------- */}
      <div className="hero-content-container">
        <div className="hero-glass-card">
          {/* Top Brand Pill */}
          <div className="hero-badge-pill">
            <span className="badge-dot" />
            <span>MG CRICKETER'S DEN</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="hero-main-heading">
            <span className="hero-heading-white">WHERE PASSION</span>
            <span className="hero-heading-gold">MEETS PERFORMANCE</span>
          </h1>

          {/* Sub-headline / Motto */}
          <div className="hero-motto-row">
            <span>TRAIN</span>
            <span className="motto-sep">•</span>
            <span>COMPETE</span>
            <span className="motto-sep">•</span>
            <span>IMPROVE</span>
          </div>

          {/* Description */}
          <p className="hero-description">
            MG Cricketer's Den provides dedicated cricket training facilities designed to help players
            develop their skills, confidence, consistency, and match readiness.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions-row">
            <button
              type="button"
              className="hero-cta-btn btn-primary"
              onClick={onBookTurf}
            >
              🏏 BOOK YOUR TURF
            </button>

            <button
              type="button"
              className="hero-cta-btn btn-secondary"
              onClick={onJoinAcademy}
            >
              JOIN THE ACADEMY →
            </button>
          </div>

          {/* Quick Highlights Bar */}
          <div className="hero-highlights-strip">
            <div className="highlight-item">
              <span className="highlight-icon">🏟️</span>
              <div>
                <span className="highlight-val">2 VENUES</span>
                <span className="highlight-label">Thengaithittu & Ground</span>
              </div>
            </div>
            <div className="highlight-sep" />
            <div className="highlight-item">
              <span className="highlight-icon">🏏</span>
              <div>
                <span className="highlight-val">TURF & ASTRO</span>
                <span className="highlight-label">Dedicated Practice Nets</span>
              </div>
            </div>
            <div className="highlight-sep" />
            <div className="highlight-item">
              <span className="highlight-icon">⭐</span>
              <div>
                <span className="highlight-val">EXPERT COACHES</span>
                <span className="highlight-label">Professional Mentorship</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoBackground;
