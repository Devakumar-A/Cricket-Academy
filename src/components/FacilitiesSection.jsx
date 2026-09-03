import { useState, useEffect, useRef } from "react";
import "./FacilitiesSection.css";

const FACILITIES_DATA = [
  {
    id: "astro",
    name: "Astro Turf Wicket",
    type: "Practice Nets",
    location: "North St, Thengaithittu, Puducherry",
    shortLoc: "Thengaithittu",
    icon: "🏏",
    theme: "astro",
    badge: "High-Speed Nets",
    tagline: "True pace, uniform bounce, all-weather synthetic wicket.",
    tags: ["⚡ All-Weather Synthetic", "💡 Floodlit Cage", "⏱️ Hourly Slots"],
    pitchType: "astro"
  },
  {
    id: "natural",
    name: "Natural Turf Wicket",
    type: "Practice Nets",
    location: "North St, Thengaithittu, Puducherry",
    shortLoc: "Thengaithittu",
    icon: "🎯",
    theme: "natural",
    badge: "Authentic Turf",
    tagline: "Natural clay & grass pitch for authentic seam and spin.",
    tags: ["🌱 Clay Turf Pitch", "🎯 Seam & Spin Prep", "⏱️ Hourly Slots"],
    pitchType: "natural"
  },
  {
    id: "open",
    name: "Open Match Ground",
    type: "Match Arena",
    location: "Main Ground, Royapudupakkam, Puducherry",
    shortLoc: "Royapudupakkam",
    icon: "🏟️",
    theme: "open",
    badge: "Full Ground Arena",
    tagline: "Standard full-size cricket match ground for tournaments and team drills.",
    tags: ["🏟️ Full Match Ground", "🏆 20/40 Overs Drills", "⏱️ Day Booking"],
    pitchType: "open"
  }
];

function FacilitiesSection({ onBookTurf }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const activeFacility = FACILITIES_DATA[activeIdx] || FACILITIES_DATA[0];
  const facilityTags = activeFacility?.tags || activeFacility?.features || [];
  const canvasRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const mouseRef = useRef({ rotX: 0.35, rotY: 0, targetRotX: 0.35, targetRotY: 0 });

  // -------------------------------------------------------------
  // AUTO-SWIPE ENGINE (Smooth Auto-Cycle every 4.0 seconds on mobile & desktop)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % FACILITIES_DATA.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isHovered]);

  // -------------------------------------------------------------
  // 3D CANVAS RENDERER FOR NETS & PITCH
  // -------------------------------------------------------------
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
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Touch & Mouse Parallax on the 3D Net
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const nx = ((clientX - rect.left) / width - 0.5) * 2;
      const ny = ((clientY - rect.top) / height - 0.5) * 2;
      mouseRef.current.targetRotY = nx * 0.7;
      mouseRef.current.targetRotX = 0.35 + ny * 0.25;
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });

    let ballT = 0;
    let time = 0;

    const render = () => {
      time += 0.02;
      ballT = (ballT + 0.015) % 1;

      // Smooth rotate lerp
      mouseRef.current.rotX += (mouseRef.current.targetRotX - mouseRef.current.rotX) * 0.08;
      mouseRef.current.rotY += (mouseRef.current.targetRotY - mouseRef.current.rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;
      const fov = 350;

      const project = (x, y, z) => {
        // Rotate around Y
        const cosY = Math.cos(mouseRef.current.rotY);
        const sinY = Math.sin(mouseRef.current.rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(mouseRef.current.rotX);
        const sinX = Math.sin(mouseRef.current.rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 260);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale,
          z: z2
        };
      };

      // ---------------------------------------------------------
      // AMBIENT GLOW
      // ---------------------------------------------------------
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.5);
      const isGreen = activeFacility.pitchType === "natural" || activeFacility.pitchType === "open";
      glowGrad.addColorStop(0, isGreen ? "rgba(16, 185, 129, 0.15)" : "rgba(212, 160, 23, 0.15)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      if (activeFacility.pitchType === "open") {
        // =======================================================
        // 3D OPEN MATCH GROUND (Circular Stadium Arena)
        // =======================================================
        const radius = Math.min(width, height) * 0.42;

        // Boundary Grass Oval
        ctx.save();
        ctx.beginPath();
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
          const a = (i * 2 * Math.PI) / steps;
          const px = radius * Math.cos(a);
          const pz = radius * Math.sin(a);
          const p = project(px, 0, pz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(16, 185, 129, 0.12)";
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 30-yard Inner Circle
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const a = (i * 2 * Math.PI) / steps;
          const px = (radius * 0.55) * Math.cos(a);
          const pz = (radius * 0.55) * Math.sin(a);
          const p = project(px, 0, pz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center Pitch Strip
        const pw = 18;
        const pl = 70;
        const c1 = project(-pw, 0, -pl);
        const c2 = project(pw, 0, -pl);
        const c3 = project(pw, 0, pl);
        const c4 = project(-pw, 0, pl);

        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.lineTo(c3.x, c3.y);
        ctx.lineTo(c4.x, c4.y);
        ctx.closePath();
        ctx.fillStyle = "rgba(212, 160, 23, 0.35)";
        ctx.fill();
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 4 Stadium Floodlight Towers
        const towers = [
          [-radius * 0.9, -radius * 0.9],
          [radius * 0.9, -radius * 0.9],
          [-radius * 0.9, radius * 0.9],
          [radius * 0.9, radius * 0.9]
        ];

        towers.forEach(([tx, tz]) => {
          const base = project(tx, 0, tz);
          const top = project(tx, -55, tz);
          ctx.beginPath();
          ctx.moveTo(base.x, base.y);
          ctx.lineTo(top.x, top.y);
          ctx.strokeStyle = "rgba(253, 224, 71, 0.4)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Light bulb
          ctx.beginPath();
          ctx.arc(top.x, top.y, 4 * top.scale, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#fde047";
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        ctx.restore();
      } else {
        // =======================================================
        // 3D PRACTICE NET CAGE & PITCH (Astro or Natural)
        // =======================================================
        const pitchW = 32;
        const pitchL = 110;
        const netHeight = -55;

        // Ground Grass/Astro base
        const p1 = project(-pitchW, 0, -pitchL);
        const p2 = project(pitchW, 0, -pitchL);
        const p3 = project(pitchW, 0, pitchL);
        const p4 = project(-pitchW, 0, pitchL);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();

        if (activeFacility.pitchType === "astro") {
          ctx.fillStyle = "rgba(16, 185, 129, 0.28)";
        } else {
          ctx.fillStyle = "rgba(180, 120, 40, 0.25)";
        }
        ctx.fill();
        ctx.strokeStyle = activeFacility.pitchType === "astro" ? "#34d399" : "#d4a017";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Crease Lines (Bowling and Batting)
        [-pitchL * 0.75, pitchL * 0.75].forEach((creaseZ) => {
          const cl1 = project(-pitchW * 0.9, 0, creaseZ);
          const cl2 = project(pitchW * 0.9, 0, creaseZ);
          ctx.beginPath();
          ctx.moveTo(cl1.x, cl1.y);
          ctx.lineTo(cl2.x, cl2.y);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // 3D Practice Net Mesh Frame (Posts & Wires)
        const corners = [
          [-pitchW * 1.2, -pitchL * 1.05],
          [pitchW * 1.2, -pitchL * 1.05],
          [pitchW * 1.2, pitchL * 1.05],
          [-pitchW * 1.2, pitchL * 1.05]
        ];

        // Vertical posts
        const topCorners = corners.map(([x, z]) => {
          const b = project(x, 0, z);
          const t = project(x, netHeight, z);

          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(t.x, t.y);
          ctx.strokeStyle = "rgba(212, 160, 23, 0.6)";
          ctx.lineWidth = 2;
          ctx.stroke();
          return t;
        });

        // Top horizontal net cables
        ctx.beginPath();
        ctx.moveTo(topCorners[0].x, topCorners[0].y);
        ctx.lineTo(topCorners[1].x, topCorners[1].y);
        ctx.lineTo(topCorners[2].x, topCorners[2].y);
        ctx.lineTo(topCorners[3].x, topCorners[3].y);
        ctx.closePath();
        ctx.strokeStyle = "rgba(253, 224, 71, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3D Net Mesh Lines (Horizontal & Vertical cross lines)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        for (let h = 0.25; h <= 0.75; h += 0.25) {
          const l1 = project(-pitchW * 1.2, netHeight * h, -pitchL * 1.05);
          const l2 = project(-pitchW * 1.2, netHeight * h, pitchL * 1.05);
          const r1 = project(pitchW * 1.2, netHeight * h, -pitchL * 1.05);
          const r2 = project(pitchW * 1.2, netHeight * h, pitchL * 1.05);

          ctx.beginPath();
          ctx.moveTo(l1.x, l1.y);
          ctx.lineTo(l2.x, l2.y);
          ctx.moveTo(r1.x, r1.y);
          ctx.lineTo(r2.x, r2.y);
          ctx.stroke();
        }

        // 3D Stumps at Batting End (Back) & Bowling End (Front)
        [pitchL * 0.8, -pitchL * 0.8].forEach((stumpZ) => {
          [-4, 0, 4].forEach((offsetX) => {
            const sb = project(offsetX, 0, stumpZ);
            const st = project(offsetX, -18, stumpZ);
            ctx.beginPath();
            ctx.moveTo(sb.x, sb.y);
            ctx.lineTo(st.x, st.y);
            ctx.strokeStyle = "#fef08a";
            ctx.lineWidth = 2 * sb.scale;
            ctx.stroke();
          });
        });

        // -------------------------------------------------------
        // ANIMATED 3D CRICKET BALL DELIVERY TRAJECTORY
        // -------------------------------------------------------
        const ballZ = -pitchL * 0.75 + ballT * (pitchL * 1.5);
        // Parabolic bounce curve
        const bounceHeight = Math.sin(ballT * Math.PI) * -38;
        const ballPos = project(0, bounceHeight, ballZ);

        // Ball shadow on pitch
        const shadowPos = project(0, 0, ballZ);
        ctx.beginPath();
        ctx.ellipse(shadowPos.x, shadowPos.y, 6 * shadowPos.scale, 2.5 * shadowPos.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.fill();

        // 3D Red/Gold Glowing Cricket Ball
        ctx.beginPath();
        ctx.arc(ballPos.x, ballPos.y, 5 * ballPos.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ef4444";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#fde047";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Seam ring on ball
        ctx.beginPath();
        ctx.arc(ballPos.x, ballPos.y, 5 * ballPos.scale, 0, Math.PI);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [activeIdx]);

  const stageRef = useRef(null);

  // -------------------------------------------------------------
  // NATIVE TOUCH-SWIPE ENGINE (100% Reliable on all mobile devices)
  // -------------------------------------------------------------
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isTracking = false;

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        setIsPaused(true);
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        endX = startX;
        endY = startY;
        isTracking = true;
      }
    };

    const onTouchMove = (e) => {
      if (!isTracking || !e.touches || !e.touches[0]) return;
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;

      // 3D Parallax tilt on drag
      const rect = stage.getBoundingClientRect();
      const nx = ((endX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((endY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current.targetRotY = nx * 0.7;
      mouseRef.current.targetRotX = 0.35 + ny * 0.25;
    };

    const onTouchEnd = () => {
      if (!isTracking) return;
      isTracking = false;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // If swipe moved horizontally > 22px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 22) {
        if (diffX > 0) {
          // Swiped Left -> Next pitch
          setActiveIdx((prev) => (prev + 1) % FACILITIES_DATA.length);
        } else {
          // Swiped Right -> Previous pitch
          setActiveIdx((prev) => (prev - 1 + FACILITIES_DATA.length) % FACILITIES_DATA.length);
        }
      }

      startX = 0;
      startY = 0;
      endX = 0;
      endY = 0;

      // Resume auto-swipe 3s after user finishes swipe
      setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    };

    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: true });
    stage.addEventListener("touchend", onTouchEnd, { passive: true });
    stage.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      stage.removeEventListener("touchend", onTouchEnd);
      stage.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  const handleNextFacility = () => {
    setActiveIdx((prev) => (prev + 1) % FACILITIES_DATA.length);
  };

  const handlePrevFacility = () => {
    setActiveIdx((prev) => (prev - 1 + FACILITIES_DATA.length) % FACILITIES_DATA.length);
  };

  return (
    <section className="facilities-section" id="facilities">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="section-heading-center">
          <span className="section-badge">TURF & NETS BOOKING</span>
          <h2 className="section-title">TRAIN ON PRO WICKETS</h2>
          <p className="section-subtitle">
            Experience authentic pace, seam, and tournament-grade conditions in Puducherry.
          </p>
        </div>

        {/* 3 FACILITY SELECTOR BUTTONS (MOBILE-FRIENDLY TABS) */}
        <div className="facility-tabs-bar">
          {FACILITIES_DATA.map((fac, idx) => (
            <button
              key={fac.id}
              type="button"
              className={`facility-tab-btn ${idx === activeIdx ? "active" : ""}`}
              onClick={() => setActiveIdx(idx)}
            >
              <span className="tab-icon">{fac.icon}</span>
              <div className="tab-text">
                <strong>{fac.name}</strong>
                <small>{fac.shortLoc}</small>
              </div>
              <span className="tab-badge">{fac.badge}</span>
            </button>
          ))}
        </div>

        {/* 3D INTERACTIVE SHOWCASE CARD (AUTO-SWIPE & TOUCH-SWIPE) */}
        <div
          ref={stageRef}
          className="facility-showcase-stage"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Quick Prev / Next Floating Arrows for Fast Switching */}
          <button
            type="button"
            className="facility-nav-arrow fac-prev"
            onClick={handlePrevFacility}
            aria-label="Previous Pitch"
          >
            ‹
          </button>
          <button
            type="button"
            className="facility-nav-arrow fac-next"
            onClick={handleNextFacility}
            aria-label="Next Pitch"
          >
            ›
          </button>

          {/* Top 3D Canvas Pitch & Net Visualizer */}
          <div className="showcase-3d-viewport">
            <canvas ref={canvasRef} className="pitch-3d-canvas" />
            <div className="viewport-overlay-tag">
              <span className="live-dot"></span>
              <span>3D INTERACTIVE {(activeFacility.type || "").toUpperCase()}</span>
            </div>
            <div className="viewport-drag-hint">
              <span>👆 Swipe or tap arrows to switch pitches</span>
            </div>
          </div>

          {/* Bottom Details & Booking Action */}
          <div className="showcase-info-panel">
            <div className="info-header-row">
              <div>
                <span className="info-location-pill">
                  📍 {activeFacility.location}
                </span>
                <h3 className="info-facility-title">{activeFacility.name}</h3>
                <p className="info-facility-tagline">{activeFacility.tagline}</p>
              </div>

              <button
                type="button"
                className="showcase-book-btn"
                onClick={onBookTurf}
              >
                🏏 BOOK THIS NET NOW →
              </button>
            </div>

            {/* Compact Highlights Tags Row (Zero vertical bloat) */}
            {facilityTags && facilityTags.length > 0 && (
              <div className="info-compact-tags-row">
                {facilityTags.map((tag, tIdx) => (
                  <span key={tIdx} className="facility-compact-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mobile Touch Indicators */}
            <div className="facility-swipe-dots">
              {FACILITIES_DATA.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`swipe-dot ${dotIdx === activeIdx ? "active" : ""}`}
                  onClick={() => setActiveIdx(dotIdx)}
                  aria-label={`Facility ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FacilitiesSection;
