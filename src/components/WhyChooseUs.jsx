import { useState, useEffect, useRef, useCallback } from "react";
import { Target, Layers, Trophy, Activity } from "lucide-react";
import "./WhyChooseUs.css";

const whyChooseCards = [
  {
    id: 1,
    number: "01",
    iconType: "target",
    title: "FOCUSED",
    accent: "TRAINING",
    description:
      "Structured batting and bowling drills designed to refine technique, improve execution, and build consistency.",
    tag: "Core Skill Development",
    visualType: "target",
  },
  {
    id: 2,
    number: "02",
    iconType: "layers",
    title: "MULTIPLE PLAYING",
    accent: "CONDITIONS",
    description:
      "Practice on both Astro Wicket and Turf Wicket to adapt to pace, bounce, seam, and turn across competitive environments.",
    tag: "Surface Adaptability",
    visualType: "turf",
  },
  {
    id: 3,
    number: "03",
    iconType: "trophy",
    title: "PLAYER",
    accent: "DEVELOPMENT",
    description:
      "Comprehensive player growth focusing on physical fitness, cricket fundamentals, and a competitive winning mindset.",
    tag: "Long-term Growth",
    visualType: "trophy",
  },
  {
    id: 4,
    number: "04",
    iconType: "activity",
    title: "MATCH",
    accent: "PREPARATION",
    description:
      "Full-ground match simulation at our Royapudupakkam arena to prepare players for real tournament pressure.",
    tag: "Game Readiness",
    visualType: "stumps",
  },
];

function renderPillarIcon(type) {
  switch (type) {
    case "target":
      return <Target size={22} />;
    case "layers":
      return <Layers size={22} />;
    case "trophy":
      return <Trophy size={22} />;
    case "activity":
      return <Activity size={22} />;
    default:
      return null;
  }
}

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
      const cy = height * 0.35;
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
      canvas.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("touchmove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [visualType]);

  return <canvas ref={canvasRef} className="why-card-3d-bg-canvas" />;
}

// ================================================================
// DETERMINE CARD POSITION IN 3D DECK
// relative 0: center (front)
// relative 1: right (deck side)
// relative 2: back (transitioning behind)
// relative 3: left (deck side)
// ================================================================
function getCardPosition(cardIndex, activeIndex, totalCards) {
  const relative = (cardIndex - activeIndex + totalCards) % totalCards;
  if (relative === 0) return "center";
  if (relative === 1) return "right";
  if (relative === totalCards - 1) return "left";
  return "back";
}

// -------------------------------------------------------------
// MAIN WHY CHOOSE US COMPONENT (3D ROTATING DECK)
// -------------------------------------------------------------
function WhyChooseUs({ onExploreFacilities }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchMoved = useRef(false);
  const timerRef = useRef(null);

  // Helper to start the 5-second auto rotation
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((current) => (current + 1) % whyChooseCards.length);
    }, 5000);
  }, []);

  // Helper to pause/clear the timer during user interaction
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Helper to restart the 5-second timer cleanly from 0
  const restartTimer = useCallback(() => {
    pauseTimer();
    startTimer();
  }, [pauseTimer, startTimer]);

  useEffect(() => {
    startTimer();
    return () => pauseTimer();
  }, [startTimer, pauseTimer]);

  const moveForward = useCallback(() => {
    setActiveIndex((current) => (current + 1) % whyChooseCards.length);
    restartTimer();
  }, [restartTimer]);

  const moveBackward = useCallback(() => {
    setActiveIndex((current) => (current - 1 + whyChooseCards.length) % whyChooseCards.length);
    restartTimer();
  }, [restartTimer]);

  const handleCardClick = (e, position, index) => {
    e.stopPropagation();
    if (position === "right") {
      moveForward();
    } else if (position === "left") {
      moveBackward();
    } else if (position === "center") {
      moveForward();
    } else {
      setActiveIndex(index);
      restartTimer();
    }
  };

  // Touch handlers for mobile with gesture disambiguation & smooth reset
  const handleTouchStart = (e) => {
    // Pause auto timer immediately when touch begins so it never triggers mid-swipe
    pauseTimer();
    if (e.touches && e.touches.length > 0) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchMoved.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0) {
      const diffX = e.touches[0].clientX - touchStartX.current;
      const diffY = e.touches[0].clientY - touchStartY.current;
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        touchMoved.current = true;
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (touchMoved.current && e.changedTouches && e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      const diffY = e.changedTouches[0].clientY - touchStartY.current;

      // Only count as horizontal swipe if horizontal movement dominates and exceeds 35px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          moveForward();
        } else {
          moveBackward();
        }
      }
    }
    // Always restart fresh 5-second timer on touch end
    restartTimer();
  };

  return (
    <section className="why-choose-section" id="why-choose-us" aria-label="Why MG Cricketer's Den">
      {/* Background Ambience Glow */}
      <div className="why-bg-glow-orb why-bg-glow-left" aria-hidden="true" />
      <div className="why-bg-glow-orb why-bg-glow-right" aria-hidden="true" />

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
            3D CARD DECK STAGE (UNIFIED DESKTOP & MOBILE)
            ========================================================= */}
        <div
          className="why-3d-deck-stage"
          onClick={moveForward}
          onMouseEnter={pauseTimer}
          onMouseLeave={restartTimer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="3D Pillar Card Deck"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              moveForward();
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              moveForward();
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveBackward();
            }
          }}
        >
          {whyChooseCards.map((card, index) => {
            const position = getCardPosition(index, activeIndex, whyChooseCards.length);

            return (
              <div
                key={card.id}
                className={`why-deck-card-slot pos-${position}`}
                onClick={(e) => handleCardClick(e, position, index)}
              >
                <div className="why-pillar-card">
                  {/* Dedicated 3D Background Canvas */}
                  <Pillar3DCanvas visualType={card.visualType} />

                  {/* Atmospheric Glow */}
                  <div className="why-card-glow-overlay" aria-hidden="true" />

                  {/* Top Header Row — Balanced & Clean without redirect arrow */}
                  <div className="pillar-header">
                    <span className="pillar-number">{card.number}</span>
                    <div className="pillar-icon-box">
                      {renderPillarIcon(card.iconType)}
                    </div>
                  </div>

                  {/* Content Block — Tailored for Crisp Readability */}
                  <div className="pillar-content-wrap">
                    <span className="pillar-tag">{card.tag}</span>
                    <h3 className="pillar-title">
                      {card.title}
                      <br />
                      <span className="pillar-title-accent">{card.accent}</span>
                    </h3>
                    <p className="pillar-desc">{card.description}</p>
                  </div>

                  {/* Bottom Athletic Accent Bar */}
                  <div className="pillar-bottom-bar" aria-hidden="true">
                    <div className="pillar-bottom-line" />
                    <div className="pillar-bottom-dot" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==========================================================
            ACTIVE CARD INDICATOR (PILLS + HINT)
            ========================================================== */}
        <div className="why-deck-indicator-wrap">
          <div className="why-deck-dots-row">
            {whyChooseCards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Go to ${card.title} ${card.accent}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(index);
                  restartTimer();
                }}
                className="why-deck-dot-btn"
              >
                <span
                  className={`why-deck-dot-pill ${index === activeIndex ? "active" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
