import { useState } from "react";
import "./GallerySection.css";

// Curated high-definition Cricket Academy Images
const GALLERY_IMAGES = [
  {
    id: "img-1",
    title: "Power Hitting Net Session",
    tag: "Astro Turf Nets",
    src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=900&auto=format&fit=crop",
    desc: "Intense batting technique preparation on high-speed synthetic turf.",
  },
  {
    id: "img-2",
    title: "Seam & Swing Bowling Drills",
    tag: "Natural Clay Wicket",
    src: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=900&auto=format&fit=crop",
    desc: "Perfecting release points and seam angles with experienced coaches.",
  },
  {
    id: "img-3",
    title: "Floodlit Night Training",
    tag: "Night Nets",
    src: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=900&auto=format&fit=crop",
    desc: "24/7 practice environment with stadium-grade LED illumination.",
  },
  {
    id: "img-4",
    title: "Open Match Ground 20-Over Drills",
    tag: "Royapudupakkam Arena",
    src: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=900&auto=format&fit=crop",
    desc: "Full-field match simulations and tactical boundary fielding setups.",
  },
  {
    id: "img-5",
    title: "Junior Academy Masterclass",
    tag: "Grassroots Coaching",
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop",
    desc: "Developing fundamental footwork and shot selection in young talents.",
  },
  {
    id: "img-6",
    title: "Tournament Victory Moments",
    tag: "Championship Glory",
    src: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?q=80&w=900&auto=format&fit=crop",
    desc: "Celebrating podium finishes in regional domestic cricket tournaments.",
  },
];

// Curated Cricket Academy Video Highlights
const GALLERY_VIDEOS = [
  {
    id: "vid-1",
    title: "Fast Bowling Bio-Mechanics",
    tag: "Pace Lab",
    src: "/videos/hero-video.mp4",
    poster: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=900&auto=format&fit=crop",
    duration: "0:45",
  },
  {
    id: "vid-2",
    title: "Match Day Highlights & Sixes",
    tag: "Match Arena",
    src: "/videos/hero-video-mobile.mp4",
    poster: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=900&auto=format&fit=crop",
    duration: "1:15",
  },
  {
    id: "vid-3",
    title: "Spin Masterclass: Drift & Turn",
    tag: "Natural Turf",
    src: "/videos/hero-video.mp4",
    poster: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=900&auto=format&fit=crop",
    duration: "0:55",
  },
  {
    id: "vid-4",
    title: "Night Turf 24/7 Practice Session",
    tag: "Thengaithittu Hub",
    src: "/videos/hero-video-mobile.mp4",
    poster: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=900&auto=format&fit=crop",
    duration: "1:02",
  },
  {
    id: "vid-5",
    title: "Fielding Agility & Catching Drills",
    tag: "Fitness & Agility",
    src: "/videos/hero-video.mp4",
    poster: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop",
    duration: "0:48",
  },
];

function GallerySection() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  return (
    <section className="mg-gallery-section" id="gallery" aria-label="Academy Gallery">
      <div className="home-section-container">
        {/* Section Heading */}
        <div className="section-heading-center">
          <span className="section-badge">ACADEMY MOMENTS</span>
          <h2 className="section-title">LIFE AT THE DEN</h2>
          <p className="section-subtitle">
            Explore the high-energy training sessions, pro turf wickets, and matchday action at MG Cricketer&apos;s Den.
          </p>
        </div>
      </div>

      {/* ============================================================
          ROW 1: PHOTOS MARQUEE (Continuous Leftward Scroll)
          ============================================================ */}
      <div className="gallery-marquee-block">
        <div className="gallery-row-label">
          <span className="gallery-live-pill">📸 PHOTO ARCHIVE</span>
          <span className="gallery-hint-text">Hover or touch to pause • Tap to expand</span>
        </div>

        <div className="gallery-marquee-wrapper">
          <div className="gallery-marquee-track track-photos">
            {/* Set 1 */}
            {GALLERY_IMAGES.map((item, idx) => (
              <div
                key={`img-1-${idx}`}
                className="gallery-photo-card"
                onClick={() => setSelectedMedia({ ...item, type: "image" })}
                role="button"
                tabIndex={0}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="gallery-card-media"
                />
                <div className="gallery-card-glass-overlay">
                  <span className="gallery-item-tag">{item.tag}</span>
                  <h4 className="gallery-item-title">{item.title}</h4>
                </div>
                <div className="gallery-card-zoom-icon">🔍</div>
              </div>
            ))}

            {/* Set 2 (Duplicate for Seamless Infinite Loop) */}
            {GALLERY_IMAGES.map((item, idx) => (
              <div
                key={`img-2-${idx}`}
                className="gallery-photo-card"
                onClick={() => setSelectedMedia({ ...item, type: "image" })}
                role="button"
                tabIndex={0}
                aria-hidden="true"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="gallery-card-media"
                />
                <div className="gallery-card-glass-overlay">
                  <span className="gallery-item-tag">{item.tag}</span>
                  <h4 className="gallery-item-title">{item.title}</h4>
                </div>
                <div className="gallery-card-zoom-icon">🔍</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          ROW 2: VIDEOS REEL MARQUEE (Continuous Rightward / Counter Scroll)
          ============================================================ */}
      <div className="gallery-marquee-block gallery-videos-block">
        <div className="gallery-row-label">
          <span className="gallery-live-pill gold-pill">🎥 VIDEO REELS</span>
          <span className="gallery-hint-text">Hover or touch to pause • Tap to watch</span>
        </div>

        <div className="gallery-marquee-wrapper">
          <div className="gallery-marquee-track track-videos">
            {/* Set 1 */}
            {GALLERY_VIDEOS.map((item, idx) => (
              <div
                key={`vid-1-${idx}`}
                className="gallery-video-card"
                onClick={() => setSelectedMedia({ ...item, type: "video" })}
                role="button"
                tabIndex={0}
              >
                <div className="video-thumb-container">
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    className="gallery-card-media"
                  />
                  <div className="video-play-badge">
                    <span className="play-triangle">▶</span>
                  </div>
                  <span className="video-duration-pill">{item.duration}</span>
                </div>
                <div className="gallery-card-glass-overlay">
                  <span className="gallery-item-tag gold-tag">{item.tag}</span>
                  <h4 className="gallery-item-title">{item.title}</h4>
                </div>
              </div>
            ))}

            {/* Set 2 (Duplicate for Seamless Infinite Loop) */}
            {GALLERY_VIDEOS.map((item, idx) => (
              <div
                key={`vid-2-${idx}`}
                className="gallery-video-card"
                onClick={() => setSelectedMedia({ ...item, type: "video" })}
                role="button"
                tabIndex={0}
                aria-hidden="true"
              >
                <div className="video-thumb-container">
                  <img
                    src={item.poster}
                    alt={item.title}
                    loading="lazy"
                    className="gallery-card-media"
                  />
                  <div className="video-play-badge">
                    <span className="play-triangle">▶</span>
                  </div>
                  <span className="video-duration-pill">{item.duration}</span>
                </div>
                <div className="gallery-card-glass-overlay">
                  <span className="gallery-item-tag gold-tag">{item.tag}</span>
                  <h4 className="gallery-item-title">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          LIGHTBOX PREVIEW MODAL
          ============================================================ */}
      {selectedMedia && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="gallery-lightbox-close"
              onClick={() => setSelectedMedia(null)}
              aria-label="Close Preview"
            >
              ✕
            </button>

            {selectedMedia.type === "video" ? (
              <div className="lightbox-video-frame">
                <video
                  src={selectedMedia.src}
                  controls
                  autoPlay
                  playsInline
                  className="lightbox-video-player"
                />
              </div>
            ) : (
              <img
                src={selectedMedia.src}
                alt={selectedMedia.title}
                className="lightbox-full-image"
              />
            )}

            <div className="lightbox-caption-bar">
              <span className="lightbox-tag">{selectedMedia.tag}</span>
              <h3 className="lightbox-title">{selectedMedia.title}</h3>
              {selectedMedia.desc && (
                <p className="lightbox-desc">{selectedMedia.desc}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default GallerySection;
