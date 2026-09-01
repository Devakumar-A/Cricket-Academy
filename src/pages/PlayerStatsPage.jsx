import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./PlayerStatsPage.css";

function PlayerStatsPage({ onBack }) {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    setLoading(true);
    setError("");

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
      console.error("PLAYER STATS ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setPlayers(data || []);
    setLoading(false);
  }

  function formatCategory(category) {
    if (!category) return "Player";
    return category;
  }

  return (
    <div className="players-page-wrapper">
      <div className="players-main-container">
        {/* Header */}
        <div className="players-top-header">
          <button className="players-back-btn" onClick={onBack}>
            ← Back to Home
          </button>

          <div className="players-header-text">
            <span className="players-gold-badge">MG CRICKETERS DEN</span>
            <h1 className="players-main-title">Player Stats & Records</h1>
            <p className="players-main-subtitle">
              Meet our academy athletes and explore their official career statistics.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="players-status-box">
            <span className="loading-icon">🏏</span>
            <p>Loading player records...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="players-status-box error-box">
            <h4>Failed to load players</h4>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && players.length === 0 && (
          <div className="players-status-box">
            <span className="empty-icon">📊</span>
            <h4>No active player records found</h4>
            <p>Player stats will appear here as soon as they are registered.</p>
          </div>
        )}

        {/* Player Cards Grid */}
        {!loading && !error && players.length > 0 && (
          <div className="players-cards-grid">
            {players.map((player) => {
              const photoSrc = player.photo_url
                ? player.photo_url.startsWith("http")
                  ? player.photo_url
                  : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${player.photo_url}`
                : null;

              const isExpanded = selectedPlayer?.id === player.id;

              return (
                <div
                  key={player.id}
                  className={`pro-player-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => setSelectedPlayer(isExpanded ? null : player)}
                >
                  {/* Photo Stage */}
                  <div className="pro-player-photo-box">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={player.name}
                        className="pro-player-img"
                      />
                    ) : (
                      <div className="pro-player-fallback-avatar">
                        <span>{player.name?.charAt(0)?.toUpperCase() || "P"}</span>
                      </div>
                    )}

                    {player.jersey_no !== null && (
                      <div className="pro-jersey-tag">
                        #{player.jersey_no}
                      </div>
                    )}
                    <div className="pro-photo-fade"></div>
                  </div>

                  {/* Player Info */}
                  <div className="pro-player-info">
                    <span className="pro-player-cat">
                      {formatCategory(player.playing_category)}
                    </span>

                    <h3 className="pro-player-name">{player.name}</h3>

                    <div className="pro-details-row">
                      {player.age !== null && (
                        <div className="pro-detail-pill">
                          <strong>{player.age}</strong>
                          <small>Age</small>
                        </div>
                      )}

                      {player.batting_style && (
                        <div className="pro-detail-pill">
                          <strong>{player.batting_style}</strong>
                          <small>Bat</small>
                        </div>
                      )}

                      {player.bowling_style && (
                        <div className="pro-detail-pill">
                          <strong>{player.bowling_style}</strong>
                          <small>Bowl</small>
                        </div>
                      )}
                    </div>

                    <div className="pro-toggle-stats-btn">
                      {isExpanded ? "Hide Career Stats ▲" : "View Career Stats ▼"}
                    </div>
                  </div>

                  {/* Expanded Statistics Matrix */}
                  {isExpanded && (
                    <div
                      className="pro-expanded-matrix"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="pro-stat-cell">
                        <span className="stat-label">Matches</span>
                        <strong className="stat-value">{player.matches ?? 0}</strong>
                      </div>

                      <div className="pro-stat-cell gold-cell">
                        <span className="stat-label">Runs</span>
                        <strong className="stat-value gold-val">{player.runs ?? 0}</strong>
                      </div>

                      <div className="pro-stat-cell green-cell">
                        <span className="stat-label">Wickets</span>
                        <strong className="stat-value green-val">{player.wickets ?? 0}</strong>
                      </div>

                      <div className="pro-stat-cell">
                        <span className="stat-label">Strike Rate</span>
                        <strong className="stat-value">
                          {player.strike_rate ? Number(player.strike_rate).toFixed(1) : "—"}
                        </strong>
                      </div>

                      <div className="pro-stat-cell full-width-cell">
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
      </div>
    </div>
  );
}

export default PlayerStatsPage;
