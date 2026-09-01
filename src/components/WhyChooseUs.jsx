import { useState, useEffect, useRef } from "react";
import "./WhyChooseUs.css";

const whyChooseCards = [
  {
    id: 1,
    icon: "🎯",
    title: "Focused Training",
    description:
      "Structured batting and bowling drills designed to refine technique, improve execution, and build consistency.",
    tag: "Core Skill Development",
    visualType: "target",
  },
  {
    id: 2,
    icon: "🏟️",
    title: "Multiple Playing Conditions",
    description:
      "Practice on both Astro Turf and Natural Turf wickets to adapt to pace, bounce, seam, and turn.",
    tag: "Surface Adaptability",
    visualType: "turf",
  },
  {
    id: 3,
    icon: "🏆",
    title: "Player Development",
    description:
      "Comprehensive player growth focusing on physical fitness, cricket fundamentals, and competitive mindset.",
    tag: "Long-term Growth",
    visualType: "trophy",
  },
  {
    id: 4,
    icon: "🏏",
    title: "Match Preparation",
    description:
      "Full-ground match simulation at our Royapudupakkam arena to prepare players for real tournament pressure.",
    tag: "Game Readiness",
    visualType: "stumps",
  },
];

// -------------------------------------------------------------
// DEDICATED SELF-CONTAINED 3D PILLAR CANVAS COMPONENT
// -------------------------------------------------------------
function Pillar3DCanvas({ visualType }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ rotX: 0.25, rotY: 0, targetX: 0.25, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const nx = ((clientX - rect.left) / width - 0.5) * 2;
      const ny = ((clientY - rect.top) / height - 0.5) * 2;
      mouseRef.current.targetY = nx * 0.7;
      mouseRef.current.targetX = 0.25 + ny * 0.35;
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.025;

      mouseRef.current.rotX += (mouseRef.current.targetX - mouseRef.current.rotX) * 0.08;
      mouseRef.current.rotY += (mouseRef.current.targetY - mouseRef.current.rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const fov = 320;

      const project = (x, y, z) => {
        const autoY = mouseRef.current.rotY + time * 0.35;
        const cosY = Math.cos(autoY);
        const sinY = Math.sin(autoY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        const cosX = Math.cos(mouseRef.current.rotX);
        const sinX = Math.sin(mouseRef.current.rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 220);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale,
          z: z2,
        };
      };

      // Background Ambient Glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.48);
      glow.addColorStop(0, "rgba(212, 160, 23, 0.2)");
      glow.addColorStop(0.6, "rgba(212, 160, 23, 0.03)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      if (visualType === "target") {
        // =======================================================
        // 1. 3D TARGET RINGS (Focused Training)
        // =======================================================
        const radii = [20, 42, 64, 86];
        radii.forEach((r, idx) => {
          ctx.beginPath();
          const steps = 36;
          for (let i = 0; i <= steps; i++) {
            const a = (i * 2 * Math.PI) / steps;
            const p = project(r * Math.cos(a), (idx - 1.5) * 4, r * Math.sin(a));
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          ctx.strokeStyle = idx === 0 ? "rgba(253, 224, 71, 0.75)" : "rgba(212, 160, 23, 0.25)";
          ctx.lineWidth = idx === 0 ? 2 : 1;
          ctx.stroke();
        });

        const len = 92;
        const pL1 = project(-len, 0, 0);
        const pL2 = project(len, 0, 0);
        const pT1 = project(0, 0, -len);
        const pT2 = project(0, 0, len);

        ctx.beginPath();
        ctx.moveTo(pL1.x, pL1.y);
        ctx.lineTo(pL2.x, pL2.y);
        ctx.moveTo(pT1.x, pT1.y);
        ctx.lineTo(pT2.x, pT2.y);
        ctx.strokeStyle = "rgba(253, 224, 71, 0.35)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        const bullseye = project(0, 0, 0);
        ctx.beginPath();
        ctx.arc(bullseye.x, bullseye.y, (5 + Math.sin(time * 3) * 2) * bullseye.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#fde047";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#fde047";
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (visualType === "turf") {
        // =======================================================
        // 2. 3D DUAL-SURFACE TURF BLOCK (Surface Adaptability)
        // =======================================================
        const bw = 55;
        const bl = 75;
        const bh = 14;

        const c1 = project(-bw, -bh, -bl);
        const c2 = project(0, -bh, -bl);
        const c3 = project(0, -bh, bl);
        const c4 = project(-bw, -bh, bl);

        // Astro Green Side
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.lineTo(c4.x, c4.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(16, 185, 129, 0.35)";
        ctx.fill();
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Natural Clay Side
        const d1 = project(0, -bh, -bl);
        const d2 = project(bw, -bh, -bl);
        const d3 = project(bw, -bh, bl);
        const d4 = project(0, -bh, bl);

        ctx.beginPath();
        ctx.moveTo(d1.x, d1.y);
        ctx.lineTo(d2.x, d2.y);
        ctx.lineTo(d3.x, d3.y);
        ctx.lineTo(d4.x, d4.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(212, 160, 23, 0.35)";
        ctx.fill();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Seam Line
        ctx.beginPath();
        ctx.moveTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (visualType === "trophy") {
        // =======================================================
        // 3. 3D GOLDEN TROPHY (Player Development)
        // =======================================================
        const cupRadius = 36;
        const cupHeight = 48;

        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const a = (i * 2 * Math.PI) / 24;
          const p = project(cupRadius * Math.cos(a), -cupHeight, cupRadius * Math.sin(a));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(253, 224, 71, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.stroke();

        const b1 = project(-20, 15, -20);
        const b2 = project(20, 15, -20);
        const b3 = project(20, 15, 20);
        const b4 = project(-20, 15, 20);

        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.lineTo(b3.x, b3.y);
        ctx.lineTo(b4.x, b4.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(212, 160, 23, 0.25)";
        ctx.fill();
        ctx.strokeStyle = "#fde047";
        ctx.stroke();

        const s1 = project(0, -cupHeight * 0.4, 0);
        const s2 = project(0, 15, 0);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 3.5 * s1.scale;
        ctx.stroke();

        for (let sp = 0; sp < 5; sp++) {
          const sa = time * 1.5 + (sp * Math.PI) / 2.5;
          const sr = 46 + Math.sin(time + sp) * 8;
          const sPos = project(sr * Math.cos(sa), -cupHeight * 0.7 + Math.sin(sa * 2) * 15, sr * Math.sin(sa));
          ctx.beginPath();
          ctx.arc(sPos.x, sPos.y, 2.2 * sPos.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#fde047";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else {
        // =======================================================
        // 4. 3D MATCH WICKET STUMPS (Match Preparation)
        // =======================================================
        const stumpH = -50;
        [-12, 0, 12].forEach((sx) => {
          const b = project(sx, 12, 0);
          const t = project(sx, stumpH, 0);
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = "#fef08a";
          ctx.lineWidth = 2.5 * b.scale;
          ctx.stroke();
        });

        const bailL = project(-15, stumpH - 3, 0);
        const bailR = project(15, stumpH - 3, 0);
        ctx.beginPath();
        ctx.moveTo(bailL.x, bailL.y);
        ctx.lineTo(bailR.x, bailR.y);
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        const g1 = project(-42, 12, 0);
        const g2 = project(42, 12, 0);
        ctx.beginPath();
        ctx.moveTo(g1.x, g1.y);
        ctx.lineTo(g2.x, g2.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [visualType]);

  return <canvas ref={canvasRef} className="why-card-3d-bg-canvas" />;
}

// -------------------------------------------------------------
// MAIN WHY CHOOSE US COMPONENT
// -------------------------------------------------------------
function WhyChooseUs({ onExploreFacilities }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Auto-rotate every 4.5 seconds on mobile when not paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % whyChooseCards.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + whyChooseCards.length) % whyChooseCards.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % whyChooseCards.length);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="why-choose-section" id="why-choose-us">
      <div className="home-section-container">
        {/* SECTION HEADER */}
        <div className="section-heading-center">
          <span className="section-badge">WHY MG CRICKETER'S DEN</span>
          <h2 className="section-title">BUILT FOR CRICKETERS WHO WANT MORE</h2>
          <p className="section-subtitle">
            A serious environment dedicated to high-standard cricket training, modern turf facilities,
            and competitive player development.
          </p>
        </div>

        {/* =========================================================
            DESKTOP 4-COLUMN GRID (EACH CARD HAS ITS OWN 3D ANIMATION)
            ========================================================= */}
        <div className="why-choose-desktop-grid">
          {whyChooseCards.map((card, idx) => (
            <div
              key={card.id}
              className={`why-pillar-card ${idx === activeIndex ? "active-pillar" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => setActiveIndex(idx)}
            >
              {/* Dedicated 3D Background Canvas */}
              <Pillar3DCanvas visualType={card.visualType} />

              <div className="pillar-content-wrap">
                <div className="pillar-header">
                  <div className="pillar-icon-box">{card.icon}</div>
                  <span className="pillar-number">0{card.id}</span>
                </div>
                <h3 className="pillar-title">{card.title}</h3>
                <p className="pillar-desc">{card.description}</p>
                <div className="pillar-tag">{card.tag}</div>
              </div>
            </div>
          ))}
        </div>

        {/* =========================================================
            MOBILE SINGLE UNIFIED CARD (DYNAMIC 3D BACKGROUND)
            ========================================================= */}
        <div
          className="why-choose-mobile-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="why-single-mobile-card">
            {/* Dynamic 3D Background Canvas matching active pillar */}
            <Pillar3DCanvas visualType={whyChooseCards[activeIndex].visualType} />

            <div className="pillar-content-wrap">
              <div className="pillar-header">
                <div className="pillar-icon-box">
                  {whyChooseCards[activeIndex].icon}
                </div>
                <span className="pillar-number">
                  0{whyChooseCards[activeIndex].id} / 04
                </span>
              </div>
              <h3 className="pillar-title">
                {whyChooseCards[activeIndex].title}
              </h3>
              <p className="pillar-desc">
                {whyChooseCards[activeIndex].description}
              </p>
              <div className="pillar-tag">
                {whyChooseCards[activeIndex].tag}
              </div>
            </div>
          </div>

          {/* =========================================================
              MOBILE INTERACTIVE CONTROLS BAR (BACKWARD / PAUSE / FORWARD)
              ========================================================= */}
          <div className="why-mobile-controls-bar">
            {/* Backward Button */}
            <button
              type="button"
              className="why-nav-btn prev-btn"
              onClick={handlePrev}
              aria-label="Previous Pillar"
              title="Previous"
            >
              ◀ Prev
            </button>

            {/* Pause / Play Toggle Button */}
            <button
              type="button"
              className={`why-pause-btn ${isPaused ? "is-paused" : ""}`}
              onClick={handleTogglePause}
              aria-label={isPaused ? "Resume Auto-Play" : "Pause to Read"}
              title={isPaused ? "Resume Auto-Play" : "Pause to Read"}
            >
              {isPaused ? (
                <>
                  <span className="ctrl-icon">▶</span>
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <span className="ctrl-icon">⏸</span>
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Forward Button */}
            <button
              type="button"
              className="why-nav-btn next-btn"
              onClick={handleNext}
              aria-label="Next Pillar"
              title="Next"
            >
              Next ▶
            </button>
          </div>

          {/* DOT INDICATORS */}
          <div className="carousel-dots-row">
            {whyChooseCards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`carousel-dot ${idx === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
