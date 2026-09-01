import { useEffect, useState } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState("intro"); // "intro" | "reveal" | "exit"

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage("reveal");
    }, 1200);

    const t2 = setTimeout(() => {
      setStage("exit");
    }, 2800);

    const t3 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div className={`splash-overlay ${stage}`}>
      {/* Dynamic 3D Particle & Light Arena Background */}
      <div className="splash-arena">
        <div className="arena-light light-top"></div>
        <div className="arena-light light-bottom"></div>
        <div className="arena-crease"></div>
        <div className="splash-sparks">
          <span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span>
        </div>
      </div>

      {/* 3D Animated Cricket Ball & Trophy Emblem */}
      <div className="splash-center-stage">
        <div className="splash-3d-ball">
          <div className="ball-sphere-3d">
            <div className="ball-seam-line"></div>
            <div className="ball-shine-highlight"></div>
            <div className="ball-crest-logo">MG</div>
          </div>
          <div className="ball-shadow-3d"></div>
        </div>

        {/* Cinematic Text Reveal */}
        <div className="splash-text-group">
          <span className="splash-sub-eyebrow">WELCOME TO</span>
          <h1 className="splash-den-title">
            MG CRICKETER'S DEN
          </h1>
          <p className="splash-motto">
            DEVELOPING CRICKETERS. BUILDING CHAMPIONS.
          </p>
          <div className="splash-loading-bar">
            <div className="splash-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
