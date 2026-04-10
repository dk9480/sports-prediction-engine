import React, { useState } from "react";
import { useTheme } from "../Layout/ThemeContext";
import MatchCard from "./MatchCard";

const MatchList = ({ matches, onAddFavorite, onLoadMatches, loading, lastUpdated, onExport }) => {
  const { colors, darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");

  const getUniqueSports = () => {
    const sports = matches.map((m) => m.sport);
    return ["all", ...new Set(sports)];
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.teams.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === "all" || match.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={onLoadMatches}
          style={{
            padding: "12px 30px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔄 Load Matches & AI Odds
        </button>
        <button
          onClick={onExport}
          style={{
            padding: "12px 30px",
            background: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          📥 Export to CSV
        </button>
      </div>

      {/* Search and Filter */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="🔍 Search matches..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderColor}`,
            background: colors.cardBackground,
            color: colors.textColor,
          }}
        />
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: `1px solid ${colors.borderColor}`,
            background: colors.cardBackground,
            color: colors.textColor,
            cursor: "pointer",
          }}
        >
          {getUniqueSports().map((sport) => (
            <option key={sport} value={sport}>
              {sport === "all" ? "All Sports" : sport}
            </option>
          ))}
        </select>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p style={{ textAlign: "center", fontSize: "12px", color: darkMode ? "#888" : "#999", marginBottom: "10px" }}>
          🔄 Auto-refreshes every 30s | Last updated: {lastUpdated}
        </p>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: colors.textColor }}>
          <div style={{ fontSize: "20px" }}>⏳ Loading odds from AI model...</div>
          <div style={{ color: darkMode ? "#888" : "#666", marginTop: "10px" }}>
            Fetching real-time probabilities using ML model
          </div>
        </div>
      )}

      {!loading && filteredMatches.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#888" : "#666" }}>
          {matches.length === 0
            ? "No matches loaded. Click 'Load Matches & AI Odds' to see matches."
            : "No matches match your search."}
        </div>
      )}

      {/* Matches Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px 24px",
          padding: "20px 10px 60px 10px",
          marginBottom: "40px",
        }}
      >
        {filteredMatches.map((match) => (
          <MatchCard key={match.match_id} match={match} onAddFavorite={onAddFavorite} showFavoriteButton={true} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1200px) {
          div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 30px 20px !important;
          }
        }
        @media (max-width: 900px) {
          div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 30px 20px !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(1, 1fr) !important;
            gap: 30px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MatchList;