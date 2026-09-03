import { useState, useEffect, useRef } from "react";
import "./HeroVideoBackground.css";

function HeroVideoBackground({ onBookTurf, onJoinAcademy }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1.0;
      video.defaultPlaybackRate = 1.0;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch(() => {
            // In case browser power-saving or policy restricts autoplay, retry on user touch/scroll
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
  }, []);

  return (
    <section className="hero-video-wrapper" aria-label="Hero Section">
      {/* -------------------------------------------------------------
          1. ULTRA-SMOOTH HARDWARE ACCELERATED BACKGROUND VIDEO
          ------------------------------------------------------------- */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
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
          <source src="/video/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* -------------------------------------------------------------
          2. LUXURY CINEMATIC OVERLAYS FOR HIGH CONTRAST & LEGIBILITY
          ------------------------------------------------------------- */}
      <div className="hero-video-overlay overlay-dark-gradient" aria-hidden="true" />
      <div className="hero-video-overlay overlay-radial-glow" aria-hidden="true" />

      {/* -------------------------------------------------------------
          3. HERO CENTRAL CONTENT & CALL TO ACTIONS
          ------------------------------------------------------------- */}
      <div className="hero-content-container">
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

        {/* Sub-headline */}
        <p className="hero-subtext">TRAIN. COMPETE. IMPROVE.</p>

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
            <span className="highlight-val">2 VENUES</span>
            <span className="highlight-label">Thengaithittu & Royapudupakkam</span>
          </div>
          <div className="highlight-sep" />
          <div className="highlight-item">
            <span className="highlight-val">TURF & ASTRO</span>
            <span className="highlight-label">Dedicated Practice Nets</span>
          </div>
          <div className="highlight-sep" />
          <div className="highlight-item">
            <span className="highlight-val">EXPERT COACHES</span>
            <span className="highlight-label">Professional Mentorship</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoBackground;
