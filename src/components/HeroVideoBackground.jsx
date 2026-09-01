import { useState, useEffect, useRef } from "react";
import "./HeroVideoBackground.css";

function HeroVideoBackground({ onBookTurf, onJoinAcademy }) {
  const canvasRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

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

    // Track mouse & touch movements for 3D parallax
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / height - 0.5) * 2;
      mouseRef.current.targetX = nx;
      mouseRef.current.targetY = ny;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const nx = ((touch.clientX - rect.left) / width - 0.5) * 2;
        const ny = ((touch.clientY - rect.top) / height - 0.5) * 2;
        mouseRef.current.targetX = nx;
        mouseRef.current.targetY = ny;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // -------------------------------------------------------------
    // 3D SCENE DATA: Sphere with Cricket Seam & Floating Particles
    // -------------------------------------------------------------
    const isMobile = window.innerWidth <= 768;
    const SPHERE_RADIUS = isMobile ? 85 : 125;
    const FOV = 400;

    // 1. Generate 3D Cricket Sphere & Seam points
    const spherePoints = [];
    const seamPoints = [];
    const sphereLayers = isMobile ? 12 : 18;
    const ptsPerLayer = isMobile ? 16 : 24;

    for (let i = 0; i <= sphereLayers; i++) {
      const theta = (i * Math.PI) / sphereLayers;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j < ptsPerLayer; j++) {
        const phi = (j * 2 * Math.PI) / ptsPerLayer;
        spherePoints.push({
          x: SPHERE_RADIUS * sinTheta * Math.cos(phi),
          y: SPHERE_RADIUS * cosTheta,
          z: SPHERE_RADIUS * sinTheta * Math.sin(phi),
          baseAlpha: Math.random() * 0.4 + 0.2,
        });
      }
    }

    // Cricket prominent Seam Ring (elevated double stitches)
    const seamCount = isMobile ? 48 : 72;
    for (let i = 0; i < seamCount; i++) {
      const angle = (i * 2 * Math.PI) / seamCount;
      const seamR = SPHERE_RADIUS * 1.03;
      // Main center seam line
      seamPoints.push({
        x: seamR * Math.cos(angle),
        y: (Math.sin(angle * 6) * 4), // subtle stitch wiggle
        z: seamR * Math.sin(angle),
        isStitch: i % 2 === 0,
      });
    }

    // 2. Floating Golden Energy Embers
    const emberCount = isMobile ? 35 : 65;
    const embers = Array.from({ length: emberCount }, () => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 600,
      z: (Math.random() - 0.5) * 600,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.6 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      speedZ: (Math.random() - 0.5) * 0.4,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.3 ? "#d4a017" : "#ffe066",
    }));

    // 3. Orbiting Energy Rings
    const ringCount = 2;
    const ringRadii = [SPHERE_RADIUS * 1.45, SPHERE_RADIUS * 1.8];

    // Animation Loop
    let angleY = 0;
    let angleX = 0.25;
    let time = 0;

    const render = () => {
      time += 0.018;
      angleY += 0.007;

      // Smooth mouse follow (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const currentAngleX = angleX + mouseRef.current.y * 0.35;
      const currentAngleY = angleY + mouseRef.current.x * 0.45;

      ctx.clearRect(0, 0, width, height);

      // Center of 3D projection
      const centerX = width * 0.5;
      const centerY = isMobile ? height * 0.38 : height * 0.46;

      // 3D rotation helper
      const project = (px, py, pz) => {
        // Rotate around Y
        const cosY = Math.cos(currentAngleY);
        const sinY = Math.sin(currentAngleY);
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // Rotate around X
        const cosX = Math.cos(currentAngleX);
        const sinX = Math.sin(currentAngleX);
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective scale
        const scale = FOV / (FOV + z2 + 350);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          scale,
          z: z2,
        };
      };

      // -------------------------------------------------------------
      // A. Draw Perspective Stadium Ground Grid (Pitch Depth)
      // -------------------------------------------------------------
      const gridLines = isMobile ? 8 : 14;
      const gridDepth = 600;
      const groundY = centerY + (isMobile ? 120 : 180);

      ctx.save();
      ctx.strokeStyle = "rgba(212, 160, 23, 0.07)";
      ctx.lineWidth = 1;

      // Longitudinal pitch lines converging to center
      for (let i = -gridLines; i <= gridLines; i++) {
        const xStart = centerX + i * (isMobile ? 35 : 55);
        ctx.beginPath();
        ctx.moveTo(centerX + (i * (isMobile ? 5 : 8)), groundY);
        ctx.lineTo(xStart + mouseRef.current.x * 30, height + 100);
        ctx.stroke();
      }

      // Transverse horizontal crease rings
      for (let z = 1; z <= 6; z++) {
        const lineY = groundY + Math.pow(z / 6, 1.8) * (height - groundY + 80);
        const lineAlpha = (z / 6) * 0.12;
        ctx.strokeStyle = `rgba(212, 160, 23, ${lineAlpha})`;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // B. Ambient Stadium Floodlight Beams
      // -------------------------------------------------------------
      ctx.save();
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        isMobile ? 220 : 340
      );
      glowGrad.addColorStop(0, "rgba(212, 160, 23, 0.18)");
      glowGrad.addColorStop(0.5, "rgba(212, 160, 23, 0.05)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, isMobile ? 220 : 340, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // C. Draw 3D Orbiting Energy Rings
      // -------------------------------------------------------------
      ringRadii.forEach((r, rIdx) => {
        ctx.save();
        ctx.beginPath();
        const steps = isMobile ? 36 : 60;
        const ringSpeed = (rIdx + 1) * 0.4;
        for (let i = 0; i <= steps; i++) {
          const a = (i * 2 * Math.PI) / steps;
          const rx = r * Math.cos(a);
          const rz = r * Math.sin(a);
          const ry = Math.sin(a * 2 + time * ringSpeed) * (15 + rIdx * 10);
          const p = project(rx, ry, rz);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.strokeStyle = rIdx === 0
          ? "rgba(253, 224, 71, 0.22)"
          : "rgba(212, 160, 23, 0.12)";
        ctx.lineWidth = rIdx === 0 ? 1.5 : 1;
        ctx.stroke();
        ctx.restore();
      });

      // -------------------------------------------------------------
      // D. Draw 3D Sphere Lattice (Cricket Ball Surface)
      // -------------------------------------------------------------
      spherePoints.forEach((pt) => {
        const p = project(pt.x, pt.y, pt.z);
        // Only draw points with positive scale / depth
        if (p.scale > 0) {
          const depthAlpha = Math.max(0.08, Math.min(0.7, (p.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2)));
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.6, 1.6 * p.scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 160, 23, ${depthAlpha * pt.baseAlpha})`;
          ctx.fill();
        }
      });

      // -------------------------------------------------------------
      // E. Draw Glowing Cricket Seam & Stitches
      // -------------------------------------------------------------
      ctx.save();
      for (let i = 0; i < seamPoints.length; i++) {
        const curr = seamPoints[i];
        const next = seamPoints[(i + 1) % seamPoints.length];
        const p1 = project(curr.x, curr.y, curr.z);
        const p2 = project(next.x, next.y, next.z);

        if (p1.scale > 0 && p2.scale > 0) {
          const depthAlpha = Math.max(0.2, (p1.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2));

          // Draw connecting seam line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(253, 224, 71, ${depthAlpha * 0.8})`;
          ctx.lineWidth = Math.max(1, 2.5 * p1.scale);
          ctx.stroke();

          // Golden stitch node
          if (curr.isStitch) {
            ctx.beginPath();
            ctx.arc(p1.x, p1.y, Math.max(1.2, 2.8 * p1.scale), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 245, 180, ${depthAlpha})`;
            ctx.shadowBlur = 6 * p1.scale;
            ctx.shadowColor = "#fde047";
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // F. Draw Floating Golden Energy Embers / Fireflies
      // -------------------------------------------------------------
      embers.forEach((emb) => {
        emb.y += emb.speedY;
        emb.x += emb.speedX;
        emb.z += emb.speedZ;
        emb.pulse += 0.04;

        if (emb.y < -400) emb.y = 400;
        if (emb.x < -400) emb.x = 400;
        if (emb.x > 400) emb.x = -400;
        if (emb.z < -400) emb.z = 400;
        if (emb.z > 400) emb.z = -400;

        const p = project(emb.x, emb.y, emb.z);
        if (p.scale > 0) {
          const alpha = (Math.sin(emb.pulse) * 0.3 + 0.7) * Math.min(1, p.scale * 1.5);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.8, emb.radius * p.scale), 0, Math.PI * 2);
          ctx.fillStyle = emb.color;
          ctx.globalAlpha = Math.max(0.1, alpha * 0.75);
          ctx.shadowBlur = 8 * p.scale;
          ctx.shadowColor = "#d4a017";
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1.0;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="hero-video-wrapper">
      {/* 3D High-Performance Dynamic Canvas Background */}
      <canvas ref={canvasRef} className="hero-3d-bg-canvas" />

      {/* Optional Background Video if added */}
      <video
        className={`hero-bg-video ${videoLoaded ? "loaded" : ""}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src="/videos/cricket-hero.mp4" type="video/mp4" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Atmospheric dark overlays for readability & luxury depth */}
      <div className="hero-video-overlay overlay-gradient"></div>
      <div className="hero-video-overlay overlay-radial"></div>
      <div className="hero-video-overlay overlay-vignette"></div>

      {/* Hero Central Content */}
      <div className="hero-content-container">
        {/* Badge Pill */}
        <div className="hero-badge-pill">
          <span className="badge-dot"></span>
          <span>MG CRICKETER'S DEN</span>
        </div>

        {/* Main Title */}
        <h1 className="hero-main-heading">
          <span className="hero-heading-white">WHERE PASSION</span>
          <span className="hero-heading-gold">MEETS PERFORMANCE</span>
        </h1>

        {/* Sub headline */}
        <p className="hero-subtext">
          TRAIN. COMPETE. IMPROVE.
        </p>

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
          <div className="highlight-sep"></div>
          <div className="highlight-item">
            <span className="highlight-val">TURF & ASTRO</span>
            <span className="highlight-label">Dedicated Practice Nets</span>
          </div>
          <div className="highlight-sep"></div>
          <div className="highlight-item">
            <span className="highlight-val">EXPERT COACHES</span>
            <span className="highlight-label">Professional Mentorship</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroVideoBackground;
