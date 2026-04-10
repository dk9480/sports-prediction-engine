import React from "react";
import { useTheme } from "../Layout/ThemeContext";
import CountdownTimer from "./CountdownTimer";
import ProbabilityBar from "./ProbabilityBar";

const MatchCard = ({ match, onAddFavorite, onRemoveFavorite, showFavoriteButton = true, isFavorite = false }) => {
  const { colors, darkMode } = useTheme();

  const getSportColor = (sport) => {
    if (sport === "Football") return "#28a745";
    if (sport === "Cricket") return "#ffc107";
    return "#dc3545";
  };

  return (
    <div
      style={{
        background: colors.cardBackground,
        padding: "15px",
        borderRadius: "12px",
        boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
        color: colors.textColor,
        display: "flex",
        flexDirection: "column",
        minHeight: "380px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = darkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* Sport Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span
          style={{
            background: getSportColor(match.sport),
            color: "white",
            padding: "2px 8px",
            borderRadius: "20px",
            fontSize: "10px",
            fontWeight: "bold",
          }}
        >
          {match.sport}
        </span>
        {match.league && <span style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.league}</span>}
      </div>

      {/* Teams */}
      <h3 style={{ textAlign: "center", marginBottom: "5px", fontSize: "16px", color: colors.textColor }}>
        {match.team_a} <span style={{ color: "#ffc107" }}>vs</span> {match.team_b}
      </h3>

      {/* Time */}
      {match.start_time && (
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <CountdownTimer startTime={match.start_time} />
          <p style={{ fontSize: "10px", color: darkMode ? "#888" : "#999", marginTop: "3px" }}>
            🕐 {new Date(match.start_time).toLocaleString()}
          </p>
        </div>
      )}

      {/* Odds Display */}
      {match.odds && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: "12px",
              padding: "8px",
              background: darkMode ? "#0f3460" : "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", color: "#28a745", fontSize: "16px" }}>{match.odds.teamA}</div>
              <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>
                {match.team_a?.split(" ").pop()}
              </div>
            </div>
            {match.odds.draw !== null && match.odds.draw !== "N/A" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: "bold", color: "#ffc107", fontSize: "16px" }}>{match.odds.draw}</div>
                <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>Draw</div>
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", color: "#dc3545", fontSize: "16px" }}>{match.odds.teamB}</div>
              <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>
                {match.team_b?.split(" ").pop()}
              </div>
            </div>
          </div>

          {/* Probability Bars */}
          {match.probabilities && (
            <div style={{ marginBottom: "10px" }}>
              <ProbabilityBar
                probability={match.probabilities.teamA}
                label={match.team_a?.split(" ").pop() || "Team A"}
                color="#28a745"
              />
              {match.probabilities.draw > 0 && (
                <ProbabilityBar probability={match.probabilities.draw} label="Draw" color="#ffc107" />
              )}
              <ProbabilityBar
                probability={match.probabilities.teamB}
                label={match.team_b?.split(" ").pop() || "Team B"}
                color="#dc3545"
              />
            </div>
          )}

          {/* Analysis Badge */}
          {match.analysis?.is_close_match && (
            <div
              style={{
                marginBottom: "10px",
                padding: "4px",
                background: "#fff3cd",
                borderRadius: "4px",
                textAlign: "center",
                fontSize: "10px",
                color: "#856404",
              }}
            >
              🔥 Close Match
            </div>
          )}
        </>
      )}

      {/* Favorite Button */}
      <div style={{ textAlign: "center", marginTop: "auto", paddingTop: "15px" }}>
        {showFavoriteButton ? (
          <button
            onClick={() => onAddFavorite(match.match_id)}
            style={{
              padding: "8px 12px",
              background: "#ffc107",
              color: "#333",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
              width: "100%",
            }}
          >
            ⭐ Add to Favorites
          </button>
        ) : (
          isFavorite &&
          onRemoveFavorite && (
            <button
              onClick={() => onRemoveFavorite(match.match_id)}
              style={{
                padding: "8px 12px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "12px",
                width: "100%",
              }}
            >
              ❌ Remove
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default MatchCard;