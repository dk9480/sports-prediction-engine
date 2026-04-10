import React from "react";
import { useTheme } from "./ThemeContext";

const Header = ({ user, onLogout }) => {
  const { darkMode, setDarkMode, colors } = useTheme();

  return (
    <div
      style={{
        background: colors.cardBackground,
        padding: "15px 30px",
        borderRadius: "10px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
        color: colors.textColor,
      }}
    >
      <h1 style={{ margin: 0, fontSize: "24px", color: colors.textColor }}>
        🏆 Sports Odds Platform
      </h1>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "8px 16px",
            background: darkMode ? "#ffc107" : "#333",
            color: darkMode ? "#333" : "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <span>👋 {user?.email?.split("@")[0] || "User"}</span>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 16px",
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;