import { useState, useEffect, useRef } from "react";
import "./HeroVideoBackground.css";

function HeroVideoBackground({ onBookTurf, onJoinAcademy, onViewGallery }) {
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
          2. CINEMATIC TOP & BOTTOM GRADIENT OVERLAYS
          Keeps middle 100% natural for the video logo reveal
          ------------------------------------------------------------- */}
      <div className="hero-video-overlay overlay-top-shadow" aria-hidden="true" />
      <div className="hero-video-overlay overlay-bottom-shadow" aria-hidden="true" />

      {/* -------------------------------------------------------------
          3. TOP BRAND HEADLINE & MOTTO (POSITIONED DIRECTLY BELOW HEADER)
          ------------------------------------------------------------- */}
      <div className="hero-top-stage">
        <h1 className="hero-main-heading">
          <span className="hero-heading-white">WHERE PASSION</span>
          <span className="hero-heading-gold">MEETS PERFORMANCE</span>
        </h1>

        <div className="hero-motto-row">
          <span>TRAIN</span>
          <span className="motto-sep">•</span>
          <span>COMPETE</span>
          <span className="motto-sep">•</span>
          <span>IMPROVE</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. BOTTOM ACTION DOCK (3 CTA BUTTONS)
          ------------------------------------------------------------- */}
      <div className="hero-bottom-stage">
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

          <button
            type="button"
            className="hero-cta-btn btn-gallery"
            onClick={onViewGallery}
          >
            📸 GALLERY
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoBackground;
