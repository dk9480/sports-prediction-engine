import React from "react";
import { useTheme } from "../Layout/ThemeContext";
import MatchCard from "../Matches/MatchCard";

const FavoritesList = ({ favorites, onRefresh, onRemoveFavorite, loading }) => {
  const { colors } = useTheme();

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={onRefresh}
          style={{
            padding: "12px 30px",
            background: "#ffc107",
            color: "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔄 Refresh Favorites
        </button>
      </div>

      {loading && <div style={{ textAlign: "center", padding: "40px", color: colors.textColor }}>⏳ Loading favorites...</div>}

      {!loading && favorites.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: colors.textColor }}>
          No favorites yet. Add some matches to your favorites!
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px 24px",
          padding: "20px 10px 60px 10px",
          marginBottom: "40px",
        }}
      >
        {favorites.map((match) => (
          <MatchCard
            key={match.match_id}
            match={match}
            showFavoriteButton={false}
            isFavorite={true}
            onRemoveFavorite={onRemoveFavorite}
          />
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

export default FavoritesList;
