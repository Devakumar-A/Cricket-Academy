import { useEffect, useRef, useState } from "react";
import { BarChart2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./PlayerStatsCarousel.css";

// MG Cricketer's Den Realtime Player Stats Carousel
function PlayerStatsCarousel({ onViewAllStats }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const scrollContainerRef = useRef(null);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
  // TRADITIONAL AUTO-SWIPE ENGINE (Smooth 5-second rotation)
  // -------------------------------------------------------------
  useEffect(() => {
    if (loading || players.length <= 1 || isHovered || expandedPlayerId) {
      return;
    }

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      setActivePlayerIndex((prev) => {
        const next = (prev + 1) % players.length;
        const container = scrollContainerRef.current;
        if (container && container.children[next]) {
          const card = container.children[next];
          const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
          container.scrollTo({
            left: targetLeft,
            behavior: "smooth",
          });
        }
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, players.length, isHovered, expandedPlayerId]);

  function scrollToPlayer(index) {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.children[index];
    if (card) {
      const targetLeft = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
      container.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
    }
    setActivePlayerIndex(index);
  }

  const handleTrackScroll = () => {
    if (!scrollContainerRef.current || players.length === 0) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth < 640 ? 290 : 330;
    const newIdx = Math.round(container.scrollLeft / cardWidth);
    setActivePlayerIndex(Math.min(Math.max(0, newIdx), players.length - 1));
  };

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
        {/* Section Header — Clean without bulky controls */}
        <div className="player-carousel-header">
          <div className="player-carousel-heading-wrap">
            <span className="section-badge">LIVE TRACKING</span>
            <h2 className="section-title">PERFORMANCE THAT SPEAKS</h2>
            <p className="section-subtitle">
              Dynamic statistics recorded directly from match performances at MG Cricketer's Den.
            </p>
          </div>
        </div>

        {/* Dynamic Carousel Container */}
        {loading ? (
          <div className="carousel-loading-state">
            <div className="gold-spinner" style={{ width: 28, height: 28, margin: "0 auto 12px" }}></div>
            <p>Loading real-time player statistics...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="carousel-empty-state">
            <BarChart2 size={32} style={{ color: "#d4af37", marginBottom: 12 }} />
            <h3 className="empty-state-title">Player Records Active</h3>
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
          <>
            <div
              className="carousel-track"
              ref={scrollContainerRef}
              onScroll={handleTrackScroll}
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
                        alt={`${player.name} - MG Cricketer's Den Academy Cricket Player Pondicherry`}
                        width="320"
                        height="368"
                        loading="lazy"
                        decoding="async"
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

            {/* Traditional Active Player Indicators */}
            {players.length > 1 && (
              <div className="player-carousel-dots-row">
                {players.map((p, idx) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-label={`View player ${p.name}`}
                    onClick={() => scrollToPlayer(idx)}
                    className="player-carousel-dot-btn"
                  >
                    <span
                      className={`player-carousel-dot-pill ${idx === activePlayerIndex ? "active" : ""}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
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
