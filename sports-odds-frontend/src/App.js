import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./components/Layout/ThemeContext";
import Header from "./components/Layout/Header";
import MatchList from "./components/Matches/MatchList";
import FavoritesList from "./components/Favorites/FavoritesList";
import AIAgent from "./components/AIAgent/AIAgent";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { authAPI, matchesAPI, agentAPI } from "./services/api";

const AppContent = () => {
  const { colors } = useTheme();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState("matches");
  const [matches, setMatches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === "matches" && matches.length > 0) {
      const interval = setInterval(() => {
        getMatches(true);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [token, activeTab, matches.length]);

  const getMatches = async (silent = false) => {
    if (!token) return;
    if (!silent) setLoadingMatches(true);
    try {
      const res = await matchesAPI.getAll();
      setMatches(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      if (!silent) alert("Error fetching matches");
    } finally {
      if (!silent) setLoadingMatches(false);
    }
  };

  const getFavorites = async () => {
    if (!token) return;
    setLoadingFavorites(true);
    try {
      const res = await matchesAPI.getFavorites();
      setFavorites(res.data);
    } catch (err) {
      alert("Error fetching favorites");
    } finally {
      setLoadingFavorites(false);
    }
  };

  const addFavorite = async (matchId) => {
    try {
      await matchesAPI.addFavorite(matchId);
      alert("⭐ Added to favorites!");
      if (activeTab === "favorites") getFavorites();
    } catch (err) {
      alert("Error adding favorite");
    }
  };

  const removeFavorite = async (matchId) => {
    try {
      await matchesAPI.removeFavorite(matchId);
      alert("Removed from favorites");
      getFavorites();
    } catch (err) {
      alert("Error removing favorite");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      setToken(res.data.token);
      setUser(res.data.user);
      alert("✅ Login successful!");
    } catch (err) {
      alert("❌ Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleRegister = async (email, password) => {
    try {
      await authAPI.register(email, password);
      alert("✅ Registration successful! Please login.");
      setIsRegistering(false);
    } catch (err) {
      alert("❌ Registration failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    setMatches([]);
    setFavorites([]);
    alert("Logged out");
  };

  const handleAskAI = async (question) => {
    setAiLoading(true);
    try {
      const res = await agentAPI.query(question);
      return res.data;
    } catch (err) {
      alert("AI error: " + (err.response?.data?.error || err.message));
      return null;
    } finally {
      setAiLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Match", "Team A Odds", "Draw Odds", "Team B Odds", "Team A Prob", "Draw Prob", "Team B Prob"];
    const rows = matches.map((m) => [
      m.teams,
      m.odds?.teamA || "N/A",
      m.odds?.draw || "N/A",
      m.odds?.teamB || "N/A",
      m.probabilities?.teamA ? (m.probabilities.teamA * 100).toFixed(1) + "%" : "N/A",
      m.probabilities?.draw ? (m.probabilities.draw * 100).toFixed(1) + "%" : "N/A",
      m.probabilities?.teamB ? (m.probabilities.teamB * 100).toFixed(1) + "%" : "N/A",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matches_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            width: "350px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>🏆 Sports Odds</h1>
          {!isRegistering ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setIsRegistering(true)} />
          ) : (
            <Register onRegister={handleRegister} onSwitchToLogin={() => setIsRegistering(false)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: colors.background, minHeight: "100vh", transition: "all 0.3s" }}>
      <Header user={user} onLogout={handleLogout} />

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => {
            setActiveTab("matches");
            getMatches();
          }}
          style={{
            padding: "10px 30px",
            background: activeTab === "matches" ? "#667eea" : colors.cardBackground,
            color: activeTab === "matches" ? "white" : colors.textColor,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          📋 All Matches
        </button>
        <button
          onClick={() => {
            setActiveTab("favorites");
            getFavorites();
          }}
          style={{
            padding: "10px 30px",
            background: activeTab === "favorites" ? "#667eea" : colors.cardBackground,
            color: activeTab === "favorites" ? "white" : colors.textColor,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ⭐ Favorites
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          style={{
            padding: "10px 30px",
            background: activeTab === "ai" ? "#667eea" : colors.cardBackground,
            color: activeTab === "ai" ? "white" : colors.textColor,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🤖 AI Agent
        </button>
      </div>

      {activeTab === "matches" && (
        <MatchList
          matches={matches}
          onAddFavorite={addFavorite}
          onLoadMatches={() => getMatches(false)}
          loading={loadingMatches}
          lastUpdated={lastUpdated}
          onExport={exportToCSV}
        />
      )}

      {activeTab === "favorites" && (
        <FavoritesList
          favorites={favorites}
          onRefresh={getFavorites}
          onRemoveFavorite={removeFavorite}
          loading={loadingFavorites}
        />
      )}

      {activeTab === "ai" && <AIAgent onAskQuestion={handleAskAI} loading={aiLoading} />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
