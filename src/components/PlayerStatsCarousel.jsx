import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "./PlayerStatsCarousel.css";

// MG Cricketer's Den Realtime Player Stats Carousel
function PlayerStatsCarousel({ onViewAllStats }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    loadPlayers();

    // Dynamic Realtime Postgres Changes Subscription
    const channel = supabase
      .channel("realtime:player_stats_carousel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "player_stats" },
        (payload) => {
          console.log("⚡ Realtime Player Stats Update:", payload);
          loadPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -------------------------------------------------------------
  // AUTO-SWIPE TIMER ENGINE (Smooth Auto-Scroll for dynamic players)
  // -------------------------------------------------------------
  useEffect(() => {
    if (loading || players.length <= 1 || isPaused || isHovered || expandedPlayerId) {
      return;
    }

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // If reached end, smooth scroll back to beginning
      if (container.scrollLeft >= maxScroll - 25) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const scrollStep = container.clientWidth < 640 ? 300 : 344;
        container.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [loading, players.length, isPaused, isHovered, expandedPlayerId]);

  async function loadPlayers() {
    try {
      const { data, error } = await supabase
        .from("player_stats")
        .select(`
          id,
          name,
          photo_url,
          dob,
          age,
          playing_category,
          batting_style,
          bowling_style,
          jersey_no,
          matches,
          runs,
          wickets,
          strike_rate,
          economy
        `)
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("HOME PLAYERS LOAD ERROR:", error);
      } else {
        setPlayers(data || []);
      }
    } catch (err) {
      console.error("PLAYERS FETCH EXCEPTION:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleScroll(direction) {
    if (!scrollContainerRef.current) return;
    const scrollStep = scrollContainerRef.current.clientWidth < 640 ? 300 : 344;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  }

  function toggleExpand(e, playerId) {
    e.stopPropagation();
    setExpandedPlayerId((prev) => (prev === playerId ? null : playerId));
  }

  function formatCategory(category) {
    if (!category) return "BATSMAN";
    return category.toUpperCase();
  }

  return (
    <section className="player-carousel-section" id="players-preview">
      <div className="home-section-container">
        {/* Section Header */}
        <div className="player-carousel-header">
          <div>
            <span className="section-badge">LIVE TRACKING</span>
            <h2 className="section-title">PERFORMANCE THAT SPEAKS</h2>
            <p className="section-subtitle">
              Dynamic statistics recorded directly from match performances at MG Cricketer's Den.
            </p>
          </div>

          {/* Luxury Interactive Carousel Controls: Attractive Arrows + Pause/Resume */}
          <div className="carousel-luxury-controls">
            {/* Prev Arrow */}
            <button
              type="button"
              className="carousel-gold-nav-btn prev-btn"
              onClick={() => handleScroll("left")}
              aria-label="Previous Player"
              title="Previous Player"
            >
              <svg viewBox="0 0 24 24" className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Pause / Resume Button */}
            <button
              type="button"
              className={`carousel-pause-resume-btn ${isPaused ? "is-paused" : "is-playing"}`}
              onClick={() => setIsPaused((prev) => !prev)}
              title={isPaused ? "Resume Auto-Swipe" : "Pause Auto-Swipe"}
            >
              <span className="btn-action-icon">{isPaused ? "▶" : "⏸"}</span>
              <span className="btn-label-text">
                {isPaused ? "Resume" : "Pause"}
              </span>
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              className="carousel-gold-nav-btn next-btn"
              onClick={() => handleScroll("right")}
              aria-label="Next Player"
              title="Next Player"
            >
              <svg viewBox="0 0 24 24" className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dynamic Carousel Container */}
        {loading ? (
          <div className="carousel-loading-state">
            <span className="carousel-loading-spinner">🏏</span>
            <p>Loading real-time player statistics...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="carousel-empty-state">
            <span className="empty-icon">📊</span>
            <h4>Player Records Active</h4>
            <p>Player statistics will appear here dynamically as academy matches conclude.</p>
            <button
              type="button"
              className="carousel-cta-link"
              onClick={onViewAllStats}
            >
              VIEW PLAYER STATS PAGE →
            </button>
          </div>
        ) : (
          <div
            className="carousel-track"
            ref={scrollContainerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            {players.map((player) => {
              const photoSrc = player.photo_url
                ? player.photo_url.startsWith("http")
                  ? player.photo_url
                  : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${player.photo_url}`
                : null;

              const isExpanded = expandedPlayerId === player.id;

              return (
                <div
                  key={player.id}
                  className={`home-player-card ${isExpanded ? "expanded" : ""}`}
                  onClick={(e) => toggleExpand(e, player.id)}
                >
                  {/* Photo Stage */}
                  <div className="home-player-photo-box">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={player.name}
                        className="home-player-img"
                      />
                    ) : (
                      <div className="home-player-fallback-avatar">
                        <svg viewBox="0 0 100 100" className="avatar-vector">
                          <circle cx="50" cy="50" r="48" fill="#d4a017" />
                          <circle cx="50" cy="38" r="18" fill="#fde047" stroke="#111724" strokeWidth="3" />
                          <path
                            d="M 20 85 C 20 60, 80 60, 80 85 Z"
                            fill="#6b7280"
                            stroke="#111724"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    )}

                    {player.jersey_no !== null && player.jersey_no !== undefined && player.jersey_no !== "" && (
                      <div className="home-jersey-tag">
                        #{player.jersey_no}
                      </div>
                    )}

                    <div className="home-photo-fade"></div>
                  </div>

                  {/* Player Info */}
                  <div className="home-player-info">
                    <span className="home-player-cat">
                      {formatCategory(player.playing_category)}
                    </span>

                    <h3 className="home-player-name">{player.name}</h3>

                    {/* Details Row */}
                    <div className="home-details-row">
                      {player.age !== null && player.age !== undefined && player.age !== "" && (
                        <div className="home-detail-pill">
                          <strong>{player.age}</strong>
                          <small>AGE</small>
                        </div>
                      )}

                      {player.batting_style && (
                        <div className="home-detail-pill">
                          <strong>{player.batting_style}</strong>
                          <small>BAT</small>
                        </div>
                      )}

                      {player.bowling_style && (
                        <div className="home-detail-pill">
                          <strong>{player.bowling_style}</strong>
                          <small>BOWL</small>
                        </div>
                      )}
                    </div>

                    {/* Expand Toggle */}
                    <div className="home-toggle-stats-btn">
                      <span>{isExpanded ? "Hide Career Stats ▲" : "View Career Stats ▼"}</span>
                    </div>
                  </div>

                  {/* Dynamic Expanded Career Stats Matrix */}
                  {isExpanded && (
                    <div
                      className="home-expanded-matrix"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="home-stat-cell">
                        <span className="stat-label">Matches</span>
                        <strong className="stat-value">{player.matches ?? 0}</strong>
                      </div>

                      <div className="home-stat-cell gold-cell">
                        <span className="stat-label">Runs</span>
                        <strong className="stat-value gold-val">{player.runs ?? 0}</strong>
                      </div>

                      <div className="home-stat-cell green-cell">
                        <span className="stat-label">Wickets</span>
                        <strong className="stat-value green-val">{player.wickets ?? 0}</strong>
                      </div>

                      <div className="home-stat-cell">
                        <span className="stat-label">Strike Rate</span>
                        <strong className="stat-value">
                          {player.strike_rate ? Number(player.strike_rate).toFixed(1) : "—"}
                        </strong>
                      </div>

                      <div className="home-stat-cell full-width-cell">
                        <span className="stat-label">Economy</span>
                        <strong className="stat-value">{player.economy ?? "—"}</strong>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Global CTA */}
        <div className="player-carousel-bottom">
          <button
            type="button"
            className="view-all-players-btn"
            onClick={onViewAllStats}
          >
            VIEW ALL PLAYER STATS →
          </button>
        </div>
      </div>
    </section>
  );
}

export default PlayerStatsCarousel;
