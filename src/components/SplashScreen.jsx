import CinematicLogoReveal from "./CinematicLogoReveal";

/**
 * SplashScreen — High-end cinematic brand intro wrapper
 * 
 * Houses the "The Awakening" cinematic logo reveal for MG CRICKETER'S DEN.
 * Respects original master logo fidelity from public/logoo.png.
 */
export default function SplashScreen({ onFinish, duration = 3.0 }) {
  return (
    <CinematicLogoReveal
      onFinish={onFinish}
      duration={duration}
      enableParticles={true}
      particleDensity={1.0}
      showSkip={true}
    />
  );
}
