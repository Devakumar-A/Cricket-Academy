import { useEffect, useRef } from "react";
import "./CoachesPage.css";

const coachesList = [
  {
    id: "george-samuel",
    name: "George Samuel",
    role: "COACH",
    image: "/coaches/george-samuel.jpg",
  },
  {
    id: "tharun",
    name: "Tharun",
    role: "COACH",
    image: "/coaches/tharun.png",
  },
  {
    id: "antony",
    name: "Antony",
    role: "COACH",
    image: "/coaches/antony.png",
  },
];

// -------------------------------------------------------------
// 3D COACHING & BIOMECHANICS TACTICAL PITCH MAP ENGINE
// -------------------------------------------------------------
function Coaches3DCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ rotX: 0.35, rotY: 0, targetX: 0.35, targetY: 0 });

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
      mouseRef.current.targetX = 0.35 + ny * 0.35;
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
      const cy = height * 0.52;
      const fov = 340;

      const project = (x, y, z) => {
        const autoY = mouseRef.current.rotY + Math.sin(time * 0.35) * 0.15;
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

      // 1. Ambient Coaching Studio Glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.48);
      glow.addColorStop(0, "rgba(212, 160, 23, 0.25)");
      glow.addColorStop(0.5, "rgba(212, 160, 23, 0.05)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // 2. 3D Cricket Pitch Surface
      const pw = 60;
      const pl = 120;
      const pitchCorners = [
        project(-pw, 12, -pl),
        project(pw, 12, -pl),
        project(pw, 12, pl),
        project(-pw, 12, pl),
      ];

      ctx.beginPath();
      ctx.moveTo(pitchCorners[0].x, pitchCorners[0].y);
      for (let i = 1; i < pitchCorners.length; i++) {
        ctx.lineTo(pitchCorners[i].x, pitchCorners[i].y);
      }
      ctx.closePath();
      const pGrad = ctx.createLinearGradient(pitchCorners[0].x, pitchCorners[0].y, pitchCorners[2].x, pitchCorners[2].y);
      pGrad.addColorStop(0, "rgba(18, 25, 38, 0.95)");
      pGrad.addColorStop(0.5, "rgba(12, 17, 26, 0.95)");
      pGrad.addColorStop(1, "rgba(8, 12, 18, 0.95)");
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 160, 23, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Batting & Bowling Crease Lines
      const popCrease1 = project(-pw, 12, pl * 0.7);
      const popCrease2 = project(pw, 12, pl * 0.7);
      ctx.beginPath();
      ctx.moveTo(popCrease1.x, popCrease1.y);
      ctx.lineTo(popCrease2.x, popCrease2.y);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      const bowlCrease1 = project(-pw, 12, -pl * 0.7);
      const bowlCrease2 = project(pw, 12, -pl * 0.7);
      ctx.beginPath();
      ctx.moveTo(bowlCrease1.x, bowlCrease1.y);
      ctx.lineTo(bowlCrease2.x, bowlCrease2.y);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 3. 3D Wicket Stumps & Bails at Batting End
      const stumpY = -36;
      [-8, 0, 8].forEach((sx) => {
        const sb = project(sx, 12, pl * 0.7);
        const st = project(sx, stumpY, pl * 0.7);
        ctx.beginPath();
        ctx.moveTo(sb.x, sb.y);
        ctx.lineTo(st.x, st.y);
        ctx.strokeStyle = "#fef08a";
        ctx.lineWidth = 2.5 * sb.scale;
        ctx.stroke();
      });

      const bL = project(-11, stumpY - 2, pl * 0.7);
      const bR = project(11, stumpY - 2, pl * 0.7);
      ctx.beginPath();
      ctx.moveTo(bL.x, bL.y);
      ctx.lineTo(bR.x, bR.y);
      ctx.strokeStyle = "#fde047";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 4. Coaching Tactical Pitch Map Zones (Full, Good Length, Short)
      const zones = [
        { z: pl * 0.4, r: 24, label: "FULL / YORKER", color: "#34d399" },
        { z: 0, r: 28, label: "GOOD LENGTH", color: "#fde047" },
        { z: -pl * 0.35, r: 24, label: "SHORT PITCH", color: "#f87171" },
      ];

      zones.forEach((zone) => {
        ctx.beginPath();
        const steps = 24;
        for (let i = 0; i <= steps; i++) {
          const a = (i * 2 * Math.PI) / steps;
          const p = project(zone.r * Math.cos(a), 11, zone.z + zone.r * 0.4 * Math.sin(a));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = zone.color;
        ctx.lineWidth = zone.z === 0 ? 2 : 1;
        ctx.stroke();
      });

      // 5. 3D Delivery Trajectory Arc with Bounce Simulation
      const deliveryProgress = (time * 0.8) % 1; // 0 to 1
      let ballX, ballY, ballZ;

      if (deliveryProgress < 0.6) {
        // Flight phase before pitch
        const tFlight = deliveryProgress / 0.6;
        ballX = Math.sin(tFlight * Math.PI) * 10;
        ballY = -35 + Math.pow(tFlight, 2) * 47; // Descending to pitch (y=12)
        ballZ = -pl * 0.7 + tFlight * (pl * 0.7);
      } else {
        // Post-bounce seam & rise towards stumps
        const tBounce = (deliveryProgress - 0.6) / 0.4;
        ballX = 10 - tBounce * 8; // Seam cutting off
        ballY = 12 - Math.sin(tBounce * Math.PI * 0.7) * 28; // Rising to stump height
        ballZ = tBounce * (pl * 0.7);
      }

      // Draw dashed trajectory path
      ctx.beginPath();
      const arcSteps = 28;
      for (let i = 0; i <= arcSteps; i++) {
        const pt = i / arcSteps;
        let px, py, pz;
        if (pt < 0.6) {
          const tf = pt / 0.6;
          px = Math.sin(tf * Math.PI) * 10;
          py = -35 + Math.pow(tf, 2) * 47;
          pz = -pl * 0.7 + tf * (pl * 0.7);
        } else {
          const tb = (pt - 0.6) / 0.4;
          px = 10 - tb * 8;
          py = 12 - Math.sin(tb * Math.PI * 0.7) * 28;
          pz = tb * (pl * 0.7);
        }
        const proj = project(px, py, pz);
        if (i === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      }
      ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Impact Shockwave when ball pitches at z = 0
      if (deliveryProgress >= 0.58 && deliveryProgress <= 0.75) {
        const impactP = project(0, 12, 0);
        const waveR = (deliveryProgress - 0.58) * 120;
        ctx.beginPath();
        ctx.arc(impactP.x, impactP.y, waveR * impactP.scale, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(253, 224, 71, ${1 - (deliveryProgress - 0.58) * 5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 7. Render 3D Cricket Ball with Seam Rotation
      const bProj = project(ballX, ballY, ballZ);
      const bRad = 8.5 * bProj.scale;

      const bGrad = ctx.createRadialGradient(
        bProj.x - bRad * 0.3,
        bProj.y - bRad * 0.3,
        bRad * 0.1,
        bProj.x,
        bProj.y,
        bRad
      );
      bGrad.addColorStop(0, "#ffffff");
      bGrad.addColorStop(0.3, "#fde047");
      bGrad.addColorStop(0.7, "#d4a017");
      bGrad.addColorStop(1, "#78350f");

      ctx.beginPath();
      ctx.arc(bProj.x, bProj.y, bRad, 0, Math.PI * 2);
      ctx.fillStyle = bGrad;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#fde047";
      ctx.fill();
      ctx.shadowBlur = 0;

      // 8. 3D Golden Batting Plane Indicator
      const batCenter = project(18, -12, pl * 0.7);
      ctx.beginPath();
      ctx.arc(batCenter.x, batCenter.y, 14 * batCenter.scale, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(253, 224, 71, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Coaching Strategy Sparkles
      for (let i = 0; i < 6; i++) {
        const sa = time * 1.5 + (i * Math.PI) / 3;
        const sr = 62 + Math.sin(time * 2 + i) * 8;
        const sp = project(sr * Math.cos(sa), -22 + Math.sin(sa * 2) * 14, sr * Math.sin(sa));
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, (2.2 + Math.sin(time * 3 + i)) * sp.scale, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "#fde047" : "#34d399";
        ctx.shadowBlur = 8;
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

  return <canvas ref={canvasRef} className="coaches-3d-tactical-canvas" />;
}

// -------------------------------------------------------------
// MAIN COACHES PAGE COMPONENT (CLEAN ORIGINAL CONTENT)
// -------------------------------------------------------------
export default function CoachesPage({ onBack, onSection }) {
  return (
    <div className="coaches-page-wrapper">
      {/* ============================================================
          1. HERO HEADER WITH 3D COACHING ENGINE
          ============================================================ */}
      <section className="coaches-hero-section">
        <div className="coaches-hero-inner">
          <button type="button" className="coaches-back-btn" onClick={onBack}>
            ← Back to Home
          </button>

          <div className="coaches-badge-pill">
            <span className="badge-glow-dot"></span>
            <span>EXPERT MENTORSHIP</span>
          </div>

          <h1 className="coaches-hero-title">
            OUR <span className="coaches-gold-glow">COACHES</span>
          </h1>

          <p className="coaches-hero-subtitle">
            Professional domestic cricket coaches dedicated to player development.
          </p>

          {/* 3D Coaching Tactical Pitch Engine */}
          <div className="coaches-3d-viewport-card">
            <div className="viewport-label">
              <span className="dot-live"></span>
              <span>3D CRICKET COACHING & PITCH MAP LAB</span>
            </div>
            <Coaches3DCanvas />
          </div>
        </div>
      </section>

      {/* ============================================================
          2. COACHES CARDS (CLEAN: IMAGE + NAME + ROLE)
          ============================================================ */}
      <section className="coaches-main-content">
        <div className="coaches-page-container">
          <div className="coaches-cards-grid">
            {coachesList.map((coach) => (
              <div key={coach.id} className="coach-card">
                <div className="coach-avatar-box">
                  <img
                    src={coach.image}
                    alt={coach.name}
                    className="coach-img-full"
                  />
                  <div className="coach-box-overlay"></div>
                </div>

                <div className="coach-details">
                  <h3 className="coach-name">{coach.name}</h3>
                  <span className="coach-role">{coach.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ============================================================
              3. ORIGINAL CTA BANNER
              ============================================================ */}
          <div className="coaches-cta-banner">
            <div>
              <h3>READY TO TRAIN UNDER OUR COACHES?</h3>
              <p>Join our Weekday, Weekend, or Combo batches and elevate your game today.</p>
            </div>
            <button
              type="button"
              className="coaches-enroll-btn"
              onClick={() => onSection && onSection("admission")}
            >
              Apply for Admission →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
