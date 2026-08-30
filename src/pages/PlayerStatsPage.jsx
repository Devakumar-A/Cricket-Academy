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
        best_score
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
    <div className="players-page">

      <div className="players-container">

        {/* Header */}
        <div className="players-header">

          <button
            className="players-back"
            onClick={onBack}
          >
            ← Back
          </button>

          <div>
            <span className="players-eyebrow">
              MG CRICKETERS DEN
            </span>

            <h1>Player Stats</h1>

            <p>
              Meet our players and explore their performance.
            </p>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div className="players-message">
            Loading players...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="players-message error">
            Failed to load players.
            <br />
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && players.length === 0 && (
          <div className="players-message">
            No active players found.
          </div>
        )}

        {/* Player Cards */}
        {!loading && !error && players.length > 0 && (
          <div className="players-grid">

            {players.map((player) => (

              <div
                key={player.id}
                className={
                  selectedPlayer?.id === player.id
                    ? "player-card selected"
                    : "player-card"
                }
                onClick={() =>
                  setSelectedPlayer(
                    selectedPlayer?.id === player.id
                      ? null
                      : player
                  )
                }
              >

                {/* Photo */}
                <div className="player-photo-wrapper">

                  {player.photo_url ? (
                    <img
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${player.photo_url}`}
                      alt={player.name}
                      className="player-photo"
                    />
                  ) : (
                    <div className="player-photo-placeholder">
                      {player.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                  )}

                  {player.jersey_no !== null && (
                    <div className="jersey-number">
                      #{player.jersey_no}
                    </div>
                  )}

                </div>

                {/* Basic Info */}
                <div className="player-info">

                  <h2>{player.name}</h2>

                  <span className="player-category">
                    {formatCategory(player.playing_category)}
                  </span>

                  <div className="player-details">

                    {player.age !== null && (
                      <span>
                        <strong>{player.age}</strong>
                        <small>Age</small>
                      </span>
                    )}

                    {player.batting_style && (
                      <span>
                        <strong>
                          {player.batting_style}
                        </strong>
                        <small>Batting</small>
                      </span>
                    )}

                    {player.bowling_style && (
                      <span>
                        <strong>
                          {player.bowling_style}
                        </strong>
                        <small>Bowling</small>
                      </span>
                    )}

                  </div>

                  <div className="view-stats">
                    {selectedPlayer?.id === player.id
                      ? "Hide Statistics ↑"
                      : "View Statistics ↓"}
                  </div>

                </div>

                {/* Expanded Statistics */}
                {selectedPlayer?.id === player.id && (
                  <div
                    className="player-stats"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <div className="stat">
                      <span>Matches</span>
                      <strong>
                        {player.matches ?? 0}
                      </strong>
                    </div>

                    <div className="stat">
                      <span>Runs</span>
                      <strong>
                        {player.runs ?? 0}
                      </strong>
                    </div>

                    <div className="stat">
                      <span>Wickets</span>
                      <strong>
                        {player.wickets ?? 0}
                      </strong>
                    </div>

                    <div className="stat">
                      <span>Strike Rate</span>
                      <strong>
                        {player.strike_rate ?? "—"}
                      </strong>
                    </div>

                    <div className="stat">
                      <span>Best Score</span>
                      <strong>
                        {player.best_score ?? "—"}
                      </strong>
                    </div>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default PlayerStatsPage;