import { useEffect, useRef } from "react";
import "./About3DCard.css";

function About3DCard({ onExplore }) {
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
      mouseRef.current.targetY = nx * 0.6;
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
      const fov = 300;

      const project = (x, y, z) => {
        const autoY = mouseRef.current.rotY + Math.sin(time * 0.5) * 0.15;
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
          z: z2
        };
      };

      // 1. Ambient Golden Shield Glow
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.45);
      glow.addColorStop(0, "rgba(212, 160, 23, 0.2)");
      glow.addColorStop(0.6, "rgba(212, 160, 23, 0.04)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // 2. 3D Golden Octagon Crest Wireframe
      const crestR = Math.min(width, height) * 0.32;
      const shieldCorners = 8;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= shieldCorners; i++) {
        const a = (i * 2 * Math.PI) / shieldCorners - Math.PI / 8;
        const p = project(crestR * Math.cos(a), crestR * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(253, 224, 71, 0.5)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#d4a017";
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner crest ring
      ctx.beginPath();
      for (let i = 0; i <= shieldCorners; i++) {
        const a = (i * 2 * Math.PI) / shieldCorners - Math.PI / 8;
        const p = project(crestR * 0.82 * Math.cos(a), crestR * 0.82 * Math.sin(a), 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(212, 160, 23, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. 3D Crossed Golden Cricket Bats
      const batLen = crestR * 1.05;
      const angles = [Math.PI / 4, (3 * Math.PI) / 4];
      angles.forEach((ba) => {
        const handleStart = project(
          -batLen * 0.4 * Math.cos(ba),
          -batLen * 0.4 * Math.sin(ba),
          -10
        );
        const bladeEnd = project(
          batLen * 0.7 * Math.cos(ba),
          batLen * 0.7 * Math.sin(ba),
          10
        );
        ctx.beginPath();
        ctx.moveTo(handleStart.x, handleStart.y);
        ctx.lineTo(bladeEnd.x, bladeEnd.y);
        ctx.strokeStyle = "rgba(254, 240, 138, 0.75)";
        ctx.lineWidth = 3.5 * handleStart.scale;
        ctx.stroke();
      });

      // 4. Center 3D Cricket Ball Sphere with glowing seam
      const ballRadius = crestR * 0.38;
      const bCenter = project(0, 0, 15);
      ctx.beginPath();
      ctx.arc(bCenter.x, bCenter.y, ballRadius * bCenter.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#fde047";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Seam ring rotating on ball
      ctx.beginPath();
      const seamSteps = 24;
      for (let s = 0; s <= seamSteps; s++) {
        const sa = (s * 2 * Math.PI) / seamSteps;
        const sx = ballRadius * Math.cos(sa);
        const sz = 15 + ballRadius * Math.sin(sa);
        const sy = Math.sin(sa * 4) * 3;
        const sp = project(sx, sy, sz);
        if (s === 0) ctx.moveTo(sp.x, sp.y);
        else ctx.lineTo(sp.x, sp.y);
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 5. Orbiting Golden Sparkles
      for (let k = 0; k < 6; k++) {
        const sparkAngle = time * 1.2 + (k * Math.PI) / 3;
        const sparkR = crestR * (1.1 + Math.sin(time + k) * 0.15);
        const sp = project(sparkR * Math.cos(sparkAngle), sparkR * Math.sin(sparkAngle), Math.sin(sparkAngle * 2) * 20);
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2.2 * sp.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#fef08a";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#fde047";
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

  return (
    <div className="about-3d-card-wrapper">
      <div className="card-top-tag">
        <span className="gold-sparkle-dot"></span>
        <span>THE DEN ADVANTAGE</span>
      </div>

      {/* 3D Crest Canvas */}
      <div className="about-canvas-box">
        <canvas ref={canvasRef} className="about-crest-canvas" />
        <div className="canvas-badge-text">
          <strong>MG CRICKETER'S DEN</strong>
          <small>Puducherry's Cricket Excellence Hub</small>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="about-metrics-grid">
        <div className="about-metric-cell">
          <span className="metric-label">FACILITIES</span>
          <strong className="metric-val">2 Active Venues</strong>
        </div>
        <div className="about-metric-cell">
          <span className="metric-label">TURF TYPES</span>
          <strong className="metric-val">Astro & Natural</strong>
        </div>
        <div className="about-metric-cell">
          <span className="metric-label">BATCHES</span>
          <strong className="metric-val">Daily & Weekend</strong>
        </div>
        <div className="about-metric-cell">
          <span className="metric-label">MATCH ARENA</span>
          <strong className="metric-val">Open Ground</strong>
        </div>
      </div>
    </div>
  );
}

export default About3DCard;
