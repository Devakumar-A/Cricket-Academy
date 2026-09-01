import { useEffect, useRef } from "react";
import "./Hero3DVisual.css";

export default function Hero3DVisual() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    // Ambient Particle Canvas Animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Create cricket-inspired gold and white floating dust particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4 - 0.2,
      color: Math.random() > 0.4 ? "rgba(212, 160, 23, " : "rgba(255, 255, 255, ",
      opacity: Math.random() * 0.6 + 0.2,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(212, 160, 23, 0.4)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Subtle 3D mouse parallax tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current || !ballRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotX = -y * 22;
    const rotY = x * 28;
    ballRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (ballRef.current) {
      ballRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    }
  };

  return (
    <div
      className="hero-3d-wrapper"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="hero-particle-canvas" />

      {/* 3D Cricket Scene */}
      <div className="cricket-stage">
        {/* Stadium Floodlight Glows */}
        <div className="stadium-light light-left"></div>
        <div className="stadium-light light-right"></div>
        <div className="pitch-crease-ring"></div>

        {/* 3D Realistic Cricket Ball */}
        <div className="cricket-ball-3d" ref={ballRef}>
          <div className="ball-sphere">
            {/* Seam Stitching */}
            <div className="ball-seam-main"></div>
            <div className="ball-seam-stitches"></div>
            <div className="ball-shine"></div>
            <div className="ball-specular"></div>
            <div className="ball-stamp">
              <span>MG</span>
              <small>DEN</small>
            </div>
          </div>
          <div className="ball-shadow"></div>
        </div>

        {/* Interactive Stats Floating Cards */}
        <div className="hero-floating-stat stat-1">
          <span className="stat-icon">⚡</span>
          <div>
            <strong>100% Match Ready</strong>
            <small>Astro & Natural Turf</small>
          </div>
        </div>

        <div className="hero-floating-stat stat-2">
          <span className="stat-icon">🏆</span>
          <div>
            <strong>Puducherry's Premier</strong>
            <small>Professional Den</small>
          </div>
        </div>
      </div>
    </div>
  );
}
