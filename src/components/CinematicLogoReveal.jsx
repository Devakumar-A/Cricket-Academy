import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import "./CinematicLogoReveal.css";

const MASTER_LOGO_SRC = "/logoo.png";

/**
 * CinematicLogoReveal — "The Awakening"
 * 
 * High-end cinematic brand intro for MG CRICKETER'S DEN.
 * Strictly preserves public/logoo.png as the unadulterated source of truth.
 * Employs feathered gradient compositing, GPU transforms, metallic light sweeps,
 * and 60fps golden micro-dust depth particles.
 */
export default function CinematicLogoReveal({
  onFinish,
  duration = 3.0,
  enableParticles = true,
  particleDensity = 1.0,
  showSkip = true,
  autoStart = true,
}) {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const timelineRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Layer refs
  const glowBackdropRef = useRef(null);
  const lionLeftLayerRef = useRef(null);
  const lionRightLayerRef = useRef(null);
  const lionRimLeftRef = useRef(null);
  const lionRimRightRef = useRef(null);
  const mgCoreLayerRef = useRef(null);
  const mgCorePulseRef = useRef(null);
  const mgSweepBeamRef = useRef(null);
  const maneLayerRef = useRef(null);
  const maneSweepRingRef = useRef(null);
  const typographyLayerRef = useRef(null);
  const textSweepBeamRef = useRef(null);
  const fullMasterLayerRef = useRef(null);
  const signatureSweepRef = useRef(null);

  const [isExiting, setIsExiting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Skip handler
  const handleSkip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    setIsExiting(true);
    setTimeout(() => {
      setIsCompleted(true);
      if (onFinish) onFinish();
    }, 380);
  }, [onFinish]);

  // Keyboard shortcut: Escape to skip
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSkip]);

  // Reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Particle Canvas Engine (restrained, 60fps, luxury gold micro-dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enableParticles || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Particle count: 20-35 particles as specified
    const isMobile = width < 768;
    const baseCount = isMobile ? 16 : 28;
    const count = Math.round(baseCount * particleDensity);

    const particles = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * width * 0.7 + width / 2,
      y: (Math.random() - 0.5) * height * 0.7 + height / 2,
      z: Math.random() * 0.8 + 0.2,
      radius: Math.random() * 1.3 + 0.5,
      alpha: Math.random() * 0.35 + 0.12,
      baseAlpha: Math.random() * 0.35 + 0.12,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -Math.random() * 0.25 - 0.06,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const sparks = [];
    const addSparks = (originX, originY, count = 8, speed = 1.2) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const vel = Math.random() * speed + 0.4;
        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * vel,
          vy: Math.sin(angle) * vel,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.02,
          radius: Math.random() * 1.4 + 0.5,
        });
      }
    };

    canvas._addSparks = addSparks;

    let running = true;

    const render = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Render micro-dust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        p.phase += p.phaseSpeed;
        const shimmer = Math.sin(p.phase) * 0.15;
        const currentAlpha = Math.max(0.04, Math.min(0.65, p.baseAlpha + shimmer));

        if (p.y < -15) {
          p.y = height + 10;
          p.x = (Math.random() - 0.5) * width * 0.7 + width / 2;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 195, 110, ${currentAlpha * p.z})`;
        ctx.shadowColor = "rgba(212, 160, 23, 0.35)";
        ctx.shadowBlur = 4 * p.z;
        ctx.fill();
      }

      // Render sparks
      if (sparks.length > 0) {
        for (let i = sparks.length - 1; i >= 0; i--) {
          const s = sparks[i];
          s.x += s.vx;
          s.y += s.vy;
          s.vx *= 0.95;
          s.vy *= 0.95;
          s.life -= s.decay;

          if (s.life <= 0) {
            sparks.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * s.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 150, ${s.life})`;
          ctx.shadowColor = "rgba(255, 205, 90, 0.75)";
          ctx.shadowBlur = 5;
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [enableParticles, particleDensity, prefersReducedMotion]);

  // GSAP Master Timeline
  useEffect(() => {
    if (!autoStart) return;

    if (prefersReducedMotion) {
      if (fullMasterLayerRef.current) {
        gsap.to(fullMasterLayerRef.current, {
          opacity: 1,
          duration: 0.8,
          delay: 0.15,
          ease: "power2.out",
          onComplete: () => {
            setTimeout(() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsCompleted(true);
                if (onFinish) onFinish();
              }, 400);
            }, 1200);
          },
        });
      }
      return;
    }

    const timeScale = duration / 3.0;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsExiting(true);
        setTimeout(() => {
          setIsCompleted(true);
          if (onFinish) onFinish();
        }, 450);
      },
    });
    timelineRef.current = tl;

    const canvas = canvasRef.current;
    const triggerSparks = (relX, relY, count, speed) => {
      if (canvas && canvas._addSparks) {
        const rect = canvas.getBoundingClientRect();
        canvas._addSparks(rect.width * relX, rect.height * relY, count, speed);
      }
    };

    // Initial State — Everything begins in darkness
    gsap.set(cameraRef.current, { scale: 0.985, opacity: 1 });
    gsap.set(glowBackdropRef.current, { opacity: 0, scale: 0.75 });
    gsap.set([lionLeftLayerRef.current, lionRightLayerRef.current], { opacity: 0 });
    gsap.set([lionRimLeftRef.current, lionRimRightRef.current], { opacity: 0 });
    gsap.set(mgCoreLayerRef.current, { opacity: 0, scale: 0.97 });
    gsap.set(mgCorePulseRef.current, { opacity: 0, scale: 0.2 });
    gsap.set(mgSweepBeamRef.current, { opacity: 0, xPercent: -100 });
    gsap.set(maneLayerRef.current, { opacity: 0, clipPath: "circle(20% at 50% 48%)" });
    gsap.set(maneSweepRingRef.current, { opacity: 0, scale: 0.25 });
    gsap.set(typographyLayerRef.current, { opacity: 0 });
    gsap.set(textSweepBeamRef.current, { opacity: 0, xPercent: -120 });
    gsap.set(fullMasterLayerRef.current, { opacity: 0 });
    gsap.set(signatureSweepRef.current, { opacity: 0, xPercent: -130 });

    // =========================================================================
    // 0.00 – 0.30s: BLACK VOID
    // Subtle camera movement, faint golden atmospheric glow behind the emblem
    // =========================================================================
    tl.to(
      glowBackdropRef.current,
      {
        opacity: 0.22,
        scale: 1.0,
        duration: 0.65 * timeScale,
        ease: "sine.out",
      },
      0.05 * timeScale
    );

    tl.to(
      cameraRef.current,
      {
        scale: 1.0,
        duration: 2.2 * timeScale,
        ease: "power1.out",
      },
      0.0
    );

    // =========================================================================
    // 0.30 – 0.65s: THE AWAKENING
    // Moving golden rim-light traces outer contours of the two lions.
    // Left lion awakens first, right lion follows in quick succession.
    // =========================================================================
    tl.add(() => {
      triggerSparks(0.35, 0.32, 6, 1.1);
    }, 0.30 * timeScale);

    tl.to(
      lionRimLeftRef.current,
      {
        opacity: 0.8,
        duration: 0.25 * timeScale,
        ease: "power2.inOut",
      },
      0.30 * timeScale
    );

    tl.to(
      lionLeftLayerRef.current,
      {
        opacity: 0.95,
        duration: 0.35 * timeScale,
        ease: "power2.out",
      },
      0.32 * timeScale
    );

    tl.add(() => {
      triggerSparks(0.65, 0.32, 6, 1.1);
    }, 0.42 * timeScale);

    tl.to(
      lionRimRightRef.current,
      {
        opacity: 0.8,
        duration: 0.25 * timeScale,
        ease: "power2.inOut",
      },
      0.40 * timeScale
    );

    tl.to(
      lionRightLayerRef.current,
      {
        opacity: 0.95,
        duration: 0.35 * timeScale,
        ease: "power2.out",
      },
      0.42 * timeScale
    );

    // =========================================================================
    // 0.65 – 1.05s: THE GUARDIANS
    // Both lion heads emerge with restrained metallic depth.
    // Lion faces remain 100% faithful to the original master artwork.
    // =========================================================================
    tl.to(
      [lionLeftLayerRef.current, lionRightLayerRef.current],
      {
        opacity: 1.0,
        duration: 0.35 * timeScale,
        ease: "power1.inOut",
      },
      0.65 * timeScale
    );

    tl.to(
      [lionRimLeftRef.current, lionRimRightRef.current],
      {
        opacity: 0.15,
        duration: 0.35 * timeScale,
        ease: "sine.inOut",
      },
      0.75 * timeScale
    );

    // =========================================================================
    // 1.05 – 1.45s: THE CORE (MG MONOGRAM)
    // Concentrated golden energy point at center.
    // Luminous stroke travels through the MG contours, forged from darkness.
    // =========================================================================
    tl.add(() => {
      triggerSparks(0.5, 0.46, 12, 1.6);
    }, 1.05 * timeScale);

    // Soft golden ignition pulse (no harsh white geometric circles)
    tl.to(
      mgCorePulseRef.current,
      {
        opacity: 0.9,
        scale: 1.4,
        duration: 0.16 * timeScale,
        ease: "power2.out",
      },
      1.05 * timeScale
    );

    tl.to(
      mgCorePulseRef.current,
      {
        opacity: 0,
        scale: 2.2,
        duration: 0.24 * timeScale,
        ease: "power1.in",
      },
      1.21 * timeScale
    );

    // MG core reveal
    tl.to(
      mgCoreLayerRef.current,
      {
        opacity: 1,
        scale: 1.0,
        duration: 0.32 * timeScale,
        ease: "power2.out",
      },
      1.10 * timeScale
    );

    // Specular light sweep across MG letters
    tl.fromTo(
      mgSweepBeamRef.current,
      { opacity: 0, xPercent: -120 },
      {
        immediateRender: false,
        keyframes: [
          { opacity: 0.88, xPercent: 0, duration: 0.16 * timeScale, ease: "sine.in" },
          { opacity: 0, xPercent: 120, duration: 0.16 * timeScale, ease: "sine.out" },
        ],
      },
      1.12 * timeScale
    );

    // =========================================================================
    // 1.45 – 1.85s: THE EMBLEM ACTIVATES (SURROUNDING MANE)
    // Progressive center-outward activation of the fine mane lines.
    // =========================================================================
    tl.add(() => {
      triggerSparks(0.5, 0.5, 10, 1.4);
    }, 1.45 * timeScale);

    tl.to(
      maneLayerRef.current,
      {
        opacity: 1,
        clipPath: "circle(68% at 50% 48%)",
        duration: 0.38 * timeScale,
        ease: "power2.out",
      },
      1.45 * timeScale
    );

    tl.fromTo(
      maneSweepRingRef.current,
      { opacity: 0.8, scale: 0.3 },
      {
        immediateRender: false,
        opacity: 0,
        scale: 1.15,
        duration: 0.38 * timeScale,
        ease: "power2.out",
      },
      1.45 * timeScale
    );

    // =========================================================================
    // 1.85 – 2.20s: THE NAME (EST. 2025 & CRICKETER'S DEN)
    // Refined horizontal metallic specular sweep across the exact typography.
    // =========================================================================
    tl.to(
      typographyLayerRef.current,
      {
        opacity: 1,
        duration: 0.22 * timeScale,
        ease: "power2.out",
      },
      1.85 * timeScale
    );

    tl.fromTo(
      textSweepBeamRef.current,
      { opacity: 0, xPercent: -120 },
      {
        immediateRender: false,
        keyframes: [
          { opacity: 0.9, xPercent: 0, duration: 0.16 * timeScale, ease: "sine.in" },
          { opacity: 0, xPercent: 120, duration: 0.16 * timeScale, ease: "sine.out" },
        ],
      },
      1.86 * timeScale
    );

    tl.add(() => {
      triggerSparks(0.5, 0.72, 8, 1.0);
    }, 1.95 * timeScale);

    // =========================================================================
    // 2.20 – 2.55s: FULL REVEAL
    // Complete emblem unified. Subtle camera push-in (1.000 -> 1.025).
    // Master unmasked layer reaches 100% opacity for pixel-perfection.
    // =========================================================================
    tl.to(
      fullMasterLayerRef.current,
      {
        opacity: 1,
        duration: 0.25 * timeScale,
        ease: "power2.out",
      },
      2.18 * timeScale
    );

    tl.to(
      cameraRef.current,
      {
        scale: 1.025,
        duration: 0.55 * timeScale,
        ease: "power1.inOut",
      },
      2.20 * timeScale
    );

    // =========================================================================
    // 2.55 – 2.75s: SIGNATURE LIGHT (HERO MOMENT)
    // Refined diagonal metallic reflection glides across the emblem.
    // Must fade to 0 before 2.75s so The Hold is 100% pristine master logo!
    // =========================================================================
    tl.add(() => {
      triggerSparks(0.48, 0.42, 8, 1.2);
    }, 2.56 * timeScale);

    tl.fromTo(
      signatureSweepRef.current,
      { opacity: 0, xPercent: -130 },
      {
        immediateRender: false,
        keyframes: [
          { opacity: 0.95, xPercent: 0, duration: 0.1 * timeScale, ease: "sine.in" },
          { opacity: 0, xPercent: 130, duration: 0.09 * timeScale, ease: "sine.out" },
        ],
      },
      2.55 * timeScale
    );

    // =========================================================================
    // 2.75 – 3.00s: THE HOLD
    // Pure stillness. Pure black background. Exact centered original logo.
    // Subtle breathing ambient backlight. Finished luxury brand ident.
    // =========================================================================
    tl.to(
      glowBackdropRef.current,
      {
        opacity: 0.3,
        scale: 1.05,
        duration: 0.25 * timeScale,
        ease: "sine.inOut",
      },
      2.75 * timeScale
    );

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [autoStart, duration, onFinish, prefersReducedMotion]);

  if (isCompleted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`cinematic-reveal-overlay ${isExiting ? "is-exiting" : ""}`}
      role="region"
      aria-label="MG Cricketer's Den Brand Intro"
    >
      {/* Background Micro-Dust Particle Canvas */}
      <canvas ref={canvasRef} className="cinematic-particle-canvas" />

      {/* Atmospheric Ambient Golden Backlight */}
      <div ref={glowBackdropRef} className="cinematic-glow-backdrop" />

      {/* Camera Rig (Dolly / Subtle Parallax) */}
      <div ref={cameraRef} className="cinematic-camera-rig">
        {/* Master Logo Framing Container (strictly 1:1, responsive) */}
        <div className="cinematic-logo-box">
          {/* =============================================================== */}
          {/* LAYER 1: THE GUARDIANS (LEFT & RIGHT LION HEADS)               */}
          {/* Exact master PNG masked with feathered elliptical gradients    */}
          {/* =============================================================== */}
          <div ref={lionLeftLayerRef} className="logo-layer layer-lion-left">
            <img
              src={MASTER_LOGO_SRC}
              alt=""
              className="master-logo-img"
              draggable={false}
            />
          </div>

          <div ref={lionRightLayerRef} className="logo-layer layer-lion-right">
            <img
              src={MASTER_LOGO_SRC}
              alt=""
              className="master-logo-img"
              draggable={false}
            />
          </div>

          {/* Golden Rim Lights for Lions */}
          <div ref={lionRimLeftRef} className="lion-rim-light rim-left" />
          <div ref={lionRimRightRef} className="lion-rim-light rim-right" />

          {/* =============================================================== */}
          {/* LAYER 2: THE CORE (MG MONOGRAM)                                */}
          {/* Exact master PNG masked over central crest                     */}
          {/* =============================================================== */}
          <div ref={mgCoreLayerRef} className="logo-layer layer-mg-core">
            <img
              src={MASTER_LOGO_SRC}
              alt=""
              className="master-logo-img"
              draggable={false}
            />
            {/* Travelling specular beam over MG */}
            <div ref={mgSweepBeamRef} className="mg-specular-beam" />
          </div>

          {/* Central golden ignition energy point */}
          <div ref={mgCorePulseRef} className="mg-energy-pulse" />

          {/* =============================================================== */}
          {/* LAYER 3: THE EMBLEM ACTIVATES (SURROUNDING MANE)                */}
          {/* Fine golden mane lines revealed via radial expansion           */}
          {/* =============================================================== */}
          <div ref={maneLayerRef} className="logo-layer layer-mane">
            <img
              src={MASTER_LOGO_SRC}
              alt=""
              className="master-logo-img"
              draggable={false}
            />
          </div>
          <div ref={maneSweepRingRef} className="mane-sweep-ring" />

          {/* =============================================================== */}
          {/* LAYER 4: THE NAME (EST. 2025 & CRICKETER'S DEN)                */}
          {/* Exact typography from logo revealed with horizontal sweep       */}
          {/* =============================================================== */}
          <div ref={typographyLayerRef} className="logo-layer layer-typography">
            <img
              src={MASTER_LOGO_SRC}
              alt=""
              className="master-logo-img"
              draggable={false}
            />
            {/* Horizontal metallic sweep bar */}
            <div ref={textSweepBeamRef} className="typography-specular-bar" />
          </div>

          {/* =============================================================== */}
          {/* LAYER 5: MASTER UNIFIED LOGO & SIGNATURE LIGHT & THE HOLD      */}
          {/* The 100% untouched master PNG for pixel-perfection             */}
          {/* =============================================================== */}
          <div ref={fullMasterLayerRef} className="logo-layer layer-full-master">
            <img
              src={MASTER_LOGO_SRC}
              alt="MG Cricketer's Den"
              className="master-logo-img"
              draggable={false}
            />
            {/* Hero Moment: Signature diagonal metallic reflection sweep */}
            {/* Feathered within emblem radius so it NEVER touches container edges! */}
            <div className="signature-sweep-wrapper">
              <div ref={signatureSweepRef} className="signature-light-streak" />
            </div>
          </div>
        </div>
      </div>

      {/* Discrete, non-intrusive Skip HUD */}
      {showSkip && (
        <button
          type="button"
          className="cinematic-skip-btn"
          onClick={handleSkip}
          aria-label="Skip intro animation"
        >
          <span>SKIP</span>
          <kbd>ESC</kbd>
        </button>
      )}
    </div>
  );
}
