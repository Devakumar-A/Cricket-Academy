import { useEffect, useRef } from "react";
import "./AboutPage.css";

// -------------------------------------------------------------
// 3D INTERACTIVE ACADEMY CREST & STADIUM CANVAS
// -------------------------------------------------------------
function About3DCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ rotX: 0.2, rotY: 0, targetX: 0.2, targetY: 0 });

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
      mouseRef.current.targetX = 0.2 + ny * 0.4;
    };

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("touchmove", handlePointerMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.02;

      mouseRef.current.rotX += (mouseRef.current.targetX - mouseRef.current.rotX) * 0.08;
      mouseRef.current.rotY += (mouseRef.current.targetY - mouseRef.current.rotY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const fov = 320;

      const project = (x, y, z) => {
        const autoY = mouseRef.current.rotY + Math.sin(time * 0.4) * 0.2;
        const cosY = Math.cos(autoY);
        const sinY = Math.sin(autoY);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        const cosX = Math.cos(mouseRef.current.rotX);
        const sinX = Math.sin(mouseRef.current.rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = fov / (fov + z2 + 200);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          scale,
          z: z2,
        };
      };

      // 1. Ambient Golden Glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.46);
      glow.addColorStop(0, "rgba(212, 160, 23, 0.25)");
      glow.addColorStop(0.5, "rgba(212, 160, 23, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // 2. 3D Golden Octagon Crest Wireframe
      const crestR = Math.min(width, height) * 0.32;
      const shieldCorners = 8;
      ctx.beginPath();
      for (let i = 0; i <= shieldCorners; i++) {
        const a = (i * 2 * Math.PI) / shieldCorners - Math.PI / 8;
        const p = project(crestR * Math.cos(a), crestR * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(253, 224, 71, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner Wireframe Octagon
      ctx.beginPath();
      for (let i = 0; i <= shieldCorners; i++) {
        const a = (i * 2 * Math.PI) / shieldCorners - Math.PI / 8;
        const p = project(crestR * 0.85 * Math.cos(a), crestR * 0.85 * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(212, 160, 23, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Crossed 3D Golden Bats
      const batL = crestR * 0.9;
      [-Math.PI / 4, Math.PI / 4].forEach((angle) => {
        const p1 = project(-batL * Math.cos(angle), -batL * Math.sin(angle), -8);
        const p2 = project(batL * Math.cos(angle), batL * Math.sin(angle), -8);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(254, 240, 138, 0.7)";
        ctx.lineWidth = 3.5 * p1.scale;
        ctx.stroke();
      });

      // 4. Central 3D Cricket Ball with Glowing Seam
      const ballR = crestR * 0.42;
      const ballP = project(0, 0, 15);

      // Ball Shading
      const bGrad = ctx.createRadialGradient(
        ballP.x - ballR * 0.3 * ballP.scale,
        ballP.y - ballR * 0.3 * ballP.scale,
        ballR * 0.1 * ballP.scale,
        ballP.x,
        ballP.y,
        ballR * ballP.scale
      );
      bGrad.addColorStop(0, "#fde047");
      bGrad.addColorStop(0.5, "#d4a017");
      bGrad.addColorStop(0.9, "#854d0e");
      bGrad.addColorStop(1, "#1e1b18");

      ctx.beginPath();
      ctx.arc(ballP.x, ballP.y, ballR * ballP.scale, 0, Math.PI * 2);
      ctx.fillStyle = bGrad;
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#fde047";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Rotating Seam Ring
      ctx.beginPath();
      const seamSteps = 32;
      for (let i = 0; i <= seamSteps; i++) {
        const sa = (i * 2 * Math.PI) / seamSteps;
        const spx = ballR * Math.cos(sa);
        const spy = ballR * Math.sin(sa) * Math.cos(time * 1.5);
        const spz = 15 + ballR * Math.sin(sa) * Math.sin(time * 1.5);
        const sp = project(spx, spy, spz);
        if (i === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * ballP.scale;
      ctx.stroke();

      // 5. Orbiting Energy Particles
      for (let i = 0; i < 7; i++) {
        const pa = time * 1.2 + (i * Math.PI * 2) / 7;
        const pr = crestR * 1.05 + Math.sin(time * 2 + i) * 12;
        const pz = Math.cos(pa) * 35;
        const p = project(pr * Math.cos(pa), pr * Math.sin(pa) * 0.6, pz);

        ctx.beginPath();
        ctx.arc(p.x, p.y, (2.8 + Math.sin(time * 3 + i) * 1.2) * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#fde047" : "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="about-3d-crest-canvas" />;
}

// -------------------------------------------------------------
// MAIN ABOUT PAGE COMPONENT
// -------------------------------------------------------------
function AboutPage({ onBack, onSection }) {
  return (
    <div className="about-page-wrapper">
      {/* ============================================================
          1. HERO HEADER BANNER
          ============================================================ */}
      <section className="about-hero-section">
        <div className="about-hero-inner">
          <button type="button" className="about-back-btn" onClick={onBack}>
            ← Back to Home
          </button>

          <div className="about-badge-pill">
            <span className="badge-glow-dot"></span>
            <span>ACADEMY PROFILE & PHILOSOPHY</span>
          </div>

          <h1 className="about-hero-title">
            DEVELOPING CRICKETERS. <span className="about-gold-glow">BUILDING CHAMPIONS.</span>
          </h1>

          <p className="about-hero-subtitle">
            MG Cricketer's Den is a serious cricket coaching academy in Puducherry built to bridge the gap between basic net practice and competitive tournament performance.
          </p>
        </div>
      </section>

      {/* ============================================================
          2. 3D CREST & ACADEMY STORY SPLIT SECTION
          ============================================================ */}
      <section className="about-story-section">
        <div className="about-page-container">
          <div className="about-story-grid">
            {/* 3D VISUAL CARD */}
            <div className="about-3d-display-card">
              <div className="card-top-tag">3D ACADEMY CREST & EMBLEM</div>
              <div className="canvas-wrapper">
                <About3DCanvas />
              </div>
              <div className="about-crest-footer">
                <h3>MG CRICKETER'S DEN</h3>
                <p>PUDUCHERRY • TRAIN • PLAY • EXCEL</p>
                <div className="crest-stats-row">
                  <div className="c-stat">
                    <strong>2</strong>
                    <span>Venues</span>
                  </div>
                  <div className="c-stat">
                    <strong>100%</strong>
                    <span>Focused</span>
                  </div>
                  <div className="c-stat">
                    <strong>Astro + Natural</strong>
                    <span>Turf Surfaces</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NARRATIVE & MISSION */}
            <div className="about-narrative-card">
              <span className="narrative-eyebrow">OUR MISSION & PHILOSOPHY</span>
              <h2>A Structured Training Ground for Serious Cricketers</h2>

              <p className="narrative-lead">
                Cricket is not just a game of hand-eye coordination—it is a game of surface adaptation, mental discipline, and biomechanical precision.
              </p>

              <div className="narrative-body-text">
                <p>
                  At <strong>MG Cricketer's Den</strong>, we provide an environment where players of all age groups can develop under structured coaching programs. Our dual-surface training approach exposes trainees to both fast-paced bounce on Astro Turf and natural seam and turn on clay turf wickets.
                </p>

                <p>
                  Complementing our practice nets at <strong>Thengaithittu</strong>, our dedicated full-size match arena at <strong>Royapudupakkam</strong> allows trainees to test their techniques under real match pressure, boundary setting, and live game situations.
                </p>
              </div>

              <div className="narrative-highlights-grid">
                <div className="highlight-pill">
                  <span className="h-icon">🎯</span>
                  <div>
                    <strong>Focused Drills</strong>
                    <small>Skill repetition & technique</small>
                  </div>
                </div>
                <div className="highlight-pill">
                  <span className="h-icon">🏟️</span>
                  <div>
                    <strong>Dual Turf Pitches</strong>
                    <small>Astro & Natural clay nets</small>
                  </div>
                </div>
                <div className="highlight-pill">
                  <span className="h-icon">⚡</span>
                  <div>
                    <strong>Match Simulation</strong>
                    <small>Full arena game scenarios</small>
                  </div>
                </div>
                <div className="highlight-pill">
                  <span className="h-icon">📈</span>
                  <div>
                    <strong>Video Analytics</strong>
                    <small>Biomechanical breakdown</small>
                  </div>
                </div>
              </div>

              <div className="narrative-cta-row">
                <button
                  type="button"
                  className="about-primary-btn"
                  onClick={() => onSection && onSection("admission")}
                >
                  Join Academy Batches 📝
                </button>
                <button
                  type="button"
                  className="about-secondary-btn"
                  onClick={() => onSection && onSection("booking")}
                >
                  Book Practice Nets 🏏
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================
              3. 4 CORE PILLARS OF EXCELLENCE
              ============================================================ */}
          <div className="about-pillars-section">
            <div className="pillars-header-center">
              <span className="narrative-eyebrow">THE 4 FOUNDATIONS</span>
              <h2>How We Develop Complete Cricketers</h2>
              <p>Our four-pillar methodology covers every aspect of modern cricket preparation.</p>
            </div>

            <div className="pillars-4-grid">
              <div className="about-pillar-box">
                <div className="p-icon-box">🎯</div>
                <span className="p-num">01</span>
                <h3>Grassroots to Elite Pathway</h3>
                <p>Structured batting and bowling drills designed to refine core fundamentals, balance, and shot execution from beginner to state tournament levels.</p>
              </div>

              <div className="about-pillar-box">
                <div className="p-icon-box">🏟️</div>
                <span className="p-num">02</span>
                <h3>Dual-Surface Pitch Adaptation</h3>
                <p>Practice on both Astro Turf and Natural Turf wickets to train players against varying pace, steep bounce, seam movement, and spin angles.</p>
              </div>

              <div className="about-pillar-box">
                <div className="p-icon-box">🏆</div>
                <span className="p-num">03</span>
                <h3>Match Simulation & Pressure Play</h3>
                <p>Full-ground tactical match play at our Royapudupakkam arena to prepare players for real tournament pressure and tactical awareness.</p>
              </div>

              <div className="about-pillar-box">
                <div className="p-icon-box">📊</div>
                <span className="p-num">04</span>
                <h3>Discipline & Measurable Progress</h3>
                <p>Fitness conditioning, fielding drills, video analysis reviews, and competitive mindset training to build mental stamina and sportsmanship.</p>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. VENUES SHOWCASE
              ============================================================ */}
          <div className="about-venues-section">
            <div className="pillars-header-center">
              <span className="narrative-eyebrow">OUR INFRASTRUCTURE</span>
              <h2>Two Dedicated Venues in Puducherry</h2>
            </div>

            <div className="about-venues-grid">
              <div className="venue-detail-box">
                <div className="v-tag gold-tag">PRACTICE NETS FACILITY</div>
                <h3>Thengaithittu Facility</h3>
                <p className="v-addr">📍 North St, Thengaithittu, Puducherry, 605004</p>
                <div className="v-bullets">
                  <span>🏏 1 Astro Turf Practice Net</span>
                  <span>🌱 1 Natural Clay Turf Wicket</span>
                  <span>⚡ High-Lumen LED Floodlights for Night Practice</span>
                  <span>🎯 Automatic Bowling Machine & Safety Netting</span>
                </div>
                <button
                  type="button"
                  className="v-action-btn"
                  onClick={() => onSection && onSection("booking")}
                >
                  Book Thengaithittu Nets →
                </button>
              </div>

              <div className="venue-detail-box arena-box">
                <div className="v-tag green-tag">FULL MATCH ARENA</div>
                <h3>Royapudupakkam Ground</h3>
                <p className="v-addr">📍 Main Ground, Royapudupakkam, Puducherry</p>
                <div className="v-bullets">
                  <span>🏟️ Full-Size Cricket Match Ground</span>
                  <span>🌱 Natural Turf Center Pitch</span>
                  <span>🏆 Full Match Simulation & League Preparation</span>
                  <span>⚡ Open Match Rentals & Corporate Tournaments</span>
                </div>
                <button
                  type="button"
                  className="v-action-btn arena-btn"
                  onClick={() => onSection && onSection("contact")}
                >
                  Inquire Match Ground →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
