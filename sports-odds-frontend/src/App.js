// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // function App() {
// //   // Auth state
// //   const [token, setToken] = useState(localStorage.getItem("token") || "");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [isRegistering, setIsRegistering] = useState(false);
// //   const [regEmail, setRegEmail] = useState("");
// //   const [regPassword, setRegPassword] = useState("");
// //   const [user, setUser] = useState(null);

// //   // Data state
// //   const [matches, setMatches] = useState([]);
// //   const [favorites, setFavorites] = useState([]);
// //   const [loadingMatches, setLoadingMatches] = useState(false);
// //   const [loadingFavorites, setLoadingFavorites] = useState(false);
// //   const [activeTab, setActiveTab] = useState("matches");
// //   const [lastUpdated, setLastUpdated] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [selectedSport, setSelectedSport] = useState("all");
// //   const [darkMode, setDarkMode] = useState(false);

// //   // AI Agent state
// //   const [question, setQuestion] = useState("");
// //   const [answer, setAnswer] = useState("");
// //   const [reasoning, setReasoning] = useState("");
// //   const [aiLoading, setAiLoading] = useState(false);

// //   // Auto-login if token exists
// //   useEffect(() => {
// //     if (token) {
// //       localStorage.setItem("token", token);
// //     }
// //   }, [token]);

// //   // Auto-refresh odds every 30 seconds
// //   useEffect(() => {
// //     if (token && activeTab === 'matches' && matches.length > 0) {
// //       const interval = setInterval(() => {
// //         getMatches(true);
// //       }, 30000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [token, activeTab]);

// //   // Dark mode styles
// //   const theme = {
// //     background: darkMode ? "#1a1a2e" : "#f4f6f8",
// //     cardBackground: darkMode ? "#16213e" : "white",
// //     textColor: darkMode ? "#eee" : "#333",
// //     borderColor: darkMode ? "#0f3460" : "#ddd"
// //   };

// //   // 🔐 Login
// //   const login = async () => {
// //     try {
// //       const res = await axios.post("http://localhost:5000/login", {
// //         email,
// //         password,
// //       });
// //       setToken(res.data.token);
// //       setUser(res.data.user);
// //       localStorage.setItem("token", res.data.token);
// //       alert("✅ Login successful!");
// //       setEmail("");
// //       setPassword("");
// //     } catch (err) {
// //       alert("❌ Login failed: " + (err.response?.data?.error || err.message));
// //     }
// //   };

// //   // 📝 Register
// //   const register = async () => {
// //     try {
// //       await axios.post("http://localhost:5000/register", {
// //         email: regEmail,
// //         password: regPassword,
// //       });
// //       alert("✅ Registration successful! Please login.");
// //       setIsRegistering(false);
// //       setRegEmail("");
// //       setRegPassword("");
// //     } catch (err) {
// //       alert("❌ Registration failed: " + (err.response?.data?.error || err.message));
// //     }
// //   };

// //   // Logout
// //   const logout = () => {
// //     setToken("");
// //     setUser(null);
// //     localStorage.removeItem("token");
// //     setMatches([]);
// //     setFavorites([]);
// //     setAnswer("");
// //     alert("Logged out");
// //   };

// //   // 📊 Get matches
// //   const getMatches = async (silent = false) => {
// //     if (!token) {
// //       alert("Please login first");
// //       return;
// //     }
    
// //     if (!silent) setLoadingMatches(true);
// //     try {
// //       const res = await axios.get("http://localhost:5000/matches", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setMatches(res.data);
// //       setLastUpdated(new Date().toLocaleTimeString());
// //     } catch (err) {
// //       if (!silent) alert("Error fetching matches: " + (err.response?.data?.error || err.message));
// //     } finally {
// //       if (!silent) setLoadingMatches(false);
// //     }
// //   };

// //   // ⭐ Get favorites
// //   const getFavorites = async () => {
// //     if (!token) return;
    
// //     setLoadingFavorites(true);
// //     try {
// //       const res = await axios.get("http://localhost:5000/favorites", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setFavorites(res.data);
// //     } catch (err) {
// //       alert("Error fetching favorites");
// //     } finally {
// //       setLoadingFavorites(false);
// //     }
// //   };

// //   // ⭐ Add to favorites
// //   const addFavorite = async (matchId) => {
// //     if (!token) {
// //       alert("Please login first");
// //       return;
// //     }
    
// //     try {
// //       await axios.post(
// //         "http://localhost:5000/favorites",
// //         { match_id: matchId },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       alert("⭐ Added to favorites!");
// //       if (activeTab === "favorites") {
// //         getFavorites();
// //       }
// //     } catch (err) {
// //       alert("Error adding favorite");
// //     }
// //   };

// //   // ❌ Remove from favorites
// //   const removeFavorite = async (matchId) => {
// //     try {
// //       await axios.delete(`http://localhost:5000/favorites/${matchId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       alert("Removed from favorites");
// //       getFavorites();
// //     } catch (err) {
// //       alert("Error removing favorite");
// //     }
// //   };

// //   // 🤖 AI Agent
// //   const askAI = async () => {
// //     if (!token) {
// //       alert("Please login first");
// //       return;
// //     }
// //     if (!question.trim()) {
// //       alert("Please enter a question");
// //       return;
// //     }
    
// //     setAiLoading(true);
// //     try {
// //       const res = await axios.post(
// //         "http://localhost:5000/agent/query",
// //         { question },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       setAnswer(res.data.answer);
// //       setReasoning(res.data.reasoning || "");
// //     } catch (err) {
// //       alert("AI error: " + (err.response?.data?.error || err.message));
// //     } finally {
// //       setAiLoading(false);
// //     }
// //   };

// //   // 📊 Export to CSV
// //   const exportToCSV = () => {
// //     const headers = ["Match", "Team A Odds", "Draw Odds", "Team B Odds", "Team A Prob", "Draw Prob", "Team B Prob"];
// //     const rows = matches.map(m => [
// //       m.teams,
// //       m.odds?.teamA || "N/A",
// //       m.odds?.draw || "N/A",
// //       m.odds?.teamB || "N/A",
// //       m.probabilities?.teamA ? (m.probabilities.teamA * 100).toFixed(1) + "%" : "N/A",
// //       m.probabilities?.draw ? (m.probabilities.draw * 100).toFixed(1) + "%" : "N/A",
// //       m.probabilities?.teamB ? (m.probabilities.teamB * 100).toFixed(1) + "%" : "N/A"
// //     ]);
    
// //     const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
// //     const blob = new Blob([csvContent], { type: "text/csv" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = `matches_${new Date().toISOString()}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   // Countdown Timer Component
// //   const CountdownTimer = ({ startTime }) => {
// //     const [timeLeft, setTimeLeft] = useState("");
    
// //     useEffect(() => {
// //       const timer = setInterval(() => {
// //         const now = new Date();
// //         const matchTime = new Date(startTime);
// //         const diff = matchTime - now;
        
// //         if (diff <= 0) {
// //           setTimeLeft("🔴 Live Now!");
// //           clearInterval(timer);
// //         } else {
// //           const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //           const hours = Math.floor((diff % (86400000)) / 3600000);
// //           const minutes = Math.floor((diff % 3600000) / 60000);
          
// //           if (days > 0) {
// //             setTimeLeft(`📅 ${days}d ${hours}h left`);
// //           } else if (hours > 0) {
// //             setTimeLeft(`⏰ ${hours}h ${minutes}m left`);
// //           } else {
// //             setTimeLeft(`⏰ ${minutes}m left`);
// //           }
// //         }
// //       }, 1000);
      
// //       return () => clearInterval(timer);
// //     }, [startTime]);
    
// //     return <span style={{ fontSize: "12px", color: "#666" }}>{timeLeft}</span>;
// //   };

// //   // Probability bar component
// //   const ProbabilityBar = ({ probability, label, color }) => (
// //     <div style={{ marginBottom: "8px" }}>
// //       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", fontSize: "12px" }}>
// //         <span>{label}</span>
// //         <span>{Math.round(probability * 100)}%</span>
// //       </div>
// //       <div style={{ background: "#e0e0e0", borderRadius: "5px", height: "6px", overflow: "hidden" }}>
// //         <div 
// //           style={{ 
// //             width: `${probability * 100}%`, 
// //             background: color, 
// //             height: "100%",
// //             transition: "width 0.3s ease"
// //           }} 
// //         />
// //       </div>
// //     </div>
// //   );

// //   // Match card component - COMPACT VERSION
// //   const MatchCard = ({ match, showFavoriteButton = true, isFavorite = false, onRemoveFavorite = null }) => (
// //     <div style={{
// //       background: theme.cardBackground,
// //       padding: "15px",
// //       borderRadius: "12px",
// //       boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
// //       transition: "transform 0.2s, box-shadow 0.2s",
// //       color: theme.textColor,
// //       display: "flex",
// //       flexDirection: "column",
// //       height: "100%",
// //       cursor: "pointer",
// //       ':hover': {
// //         transform: "translateY(-4px)",
// //         boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.15)"
// //       }
// //     }}>
// //       {/* Sport Badge */}
// //       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
// //         <span style={{
// //           background: match.sport === "Football" ? "#28a745" : match.sport === "Cricket" ? "#ffc107" : "#dc3545",
// //           color: "white",
// //           padding: "2px 8px",
// //           borderRadius: "20px",
// //           fontSize: "10px",
// //           fontWeight: "bold"
// //         }}>
// //           {match.sport}
// //         </span>
// //         {match.league && <span style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.league}</span>}
// //       </div>

// //       {/* Teams */}
// //       <h3 style={{ textAlign: "center", marginBottom: "5px", fontSize: "16px", color: theme.textColor }}>
// //         {match.team_a} <span style={{ color: "#ffc107" }}>vs</span> {match.team_b}
// //       </h3>
      
// //       {/* Time */}
// //       {match.start_time && (
// //         <div style={{ textAlign: "center", marginBottom: "10px" }}>
// //           <CountdownTimer startTime={match.start_time} />
// //           <p style={{ fontSize: "10px", color: darkMode ? "#888" : "#999", marginTop: "3px" }}>
// //             🕐 {new Date(match.start_time).toLocaleString()}
// //           </p>
// //         </div>
// //       )}

// //       {/* Odds Display - Compact */}
// //       {match.odds && (
// //         <>
// //           <div style={{ 
// //             display: "flex", 
// //             justifyContent: "space-around", 
// //             marginBottom: "12px",
// //             padding: "8px",
// //             background: darkMode ? "#0f3460" : "#f8f9fa",
// //             borderRadius: "8px"
// //           }}>
// //             <div style={{ textAlign: "center" }}>
// //               <div style={{ fontWeight: "bold", color: "#28a745", fontSize: "16px" }}>{match.odds.teamA}</div>
// //               <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.team_a?.split(" ").pop()}</div>
// //             </div>
// //             {match.odds.draw !== null && match.odds.draw !== "N/A" && (
// //               <div style={{ textAlign: "center" }}>
// //                 <div style={{ fontWeight: "bold", color: "#ffc107", fontSize: "16px" }}>{match.odds.draw}</div>
// //                 <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>Draw</div>
// //               </div>
// //             )}
// //             <div style={{ textAlign: "center" }}>
// //               <div style={{ fontWeight: "bold", color: "#dc3545", fontSize: "16px" }}>{match.odds.teamB}</div>
// //               <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.team_b?.split(" ").pop()}</div>
// //             </div>
// //           </div>

// //           {/* Probability Bars - Compact */}
// //           {match.probabilities && (
// //             <div style={{ marginBottom: "10px" }}>
// //               <ProbabilityBar 
// //                 probability={match.probabilities.teamA} 
// //                 label={match.team_a?.split(" ").pop() || "Team A"} 
// //                 color="#28a745"
// //               />
// //               {match.probabilities.draw > 0 && (
// //                 <ProbabilityBar 
// //                   probability={match.probabilities.draw} 
// //                   label="Draw" 
// //                   color="#ffc107"
// //                 />
// //               )}
// //               <ProbabilityBar 
// //                 probability={match.probabilities.teamB} 
// //                 label={match.team_b?.split(" ").pop() || "Team B"} 
// //                 color="#dc3545"
// //               />
// //             </div>
// //           )}

// //           {/* Analysis Badge */}
// //           {match.analysis && match.analysis.is_close_match && (
// //             <div style={{ marginBottom: "10px", padding: "4px", background: "#fff3cd", borderRadius: "4px", textAlign: "center", fontSize: "10px", color: "#856404" }}>
// //               🔥 Close Match
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {/* Favorite Button */}
// //       {showFavoriteButton && (
// //         <div style={{ textAlign: "center", marginTop: "auto", paddingTop: "10px" }}>
// //           <button 
// //             onClick={() => addFavorite(match.match_id)}
// //             style={{
// //               padding: "6px 12px",
// //               background: "#ffc107",
// //               color: "#333",
// //               border: "none",
// //               borderRadius: "5px",
// //               cursor: "pointer",
// //               fontSize: "12px",
// //               width: "100%"
// //             }}
// //           >
// //             ⭐ Add to Favorites
// //           </button>
// //         </div>
// //       )}
      
// //       {isFavorite && onRemoveFavorite && (
// //         <div style={{ textAlign: "center", marginTop: "auto", paddingTop: "10px" }}>
// //           <button 
// //             onClick={() => onRemoveFavorite(match.match_id)}
// //             style={{
// //               padding: "6px 12px",
// //               background: "#dc3545",
// //               color: "white",
// //               border: "none",
// //               borderRadius: "5px",
// //               cursor: "pointer",
// //               fontSize: "12px",
// //               width: "100%"
// //             }}
// //           >
// //             ❌ Remove
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );

// //   // Filter matches
// //   const getUniqueSports = () => {
// //     const sports = matches.map(m => m.sport);
// //     return ["all", ...new Set(sports)];
// //   };

// //   const filteredMatches = matches.filter(match => {
// //     const matchesSearch = match.teams.toLowerCase().includes(searchTerm.toLowerCase());
// //     const matchesSport = selectedSport === "all" || match.sport === selectedSport;
// //     return matchesSearch && matchesSport;
// //   });

// //   // Auth form
// //   if (!token) {
// //     return (
// //       <div style={{ 
// //         minHeight: "100vh", 
// //         display: "flex", 
// //         justifyContent: "center", 
// //         alignItems: "center",
// //         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
// //       }}>
// //         <div style={{
// //           background: "white",
// //           padding: "40px",
// //           borderRadius: "20px",
// //           width: "350px",
// //           boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
// //         }}>
// //           <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
// //             🏆 Sports Odds
// //           </h1>
          
// //           {!isRegistering ? (
// //             <>
// //               <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
// //               <input
// //                 placeholder="Email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 style={{ width: "100%", marginBottom: "10px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
// //               />
// //               <input
// //                 type="password"
// //                 placeholder="Password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && login()}
// //                 style={{ width: "100%", marginBottom: "20px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
// //               />
// //               <button 
// //                 onClick={login}
// //                 style={{ width: "100%", padding: "12px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
// //               >
// //                 Login
// //               </button>
// //               <p style={{ textAlign: "center", marginTop: "15px" }}>
// //                 Don't have an account?{" "}
// //                 <button 
// //                   onClick={() => setIsRegistering(true)}
// //                   style={{ background: "none", border: "none", color: "#667eea", cursor: "pointer" }}
// //                 >
// //                   Register
// //                 </button>
// //               </p>
// //             </>
// //           ) : (
// //             <>
// //               <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
// //               <input
// //                 placeholder="Email"
// //                 value={regEmail}
// //                 onChange={(e) => setRegEmail(e.target.value)}
// //                 style={{ width: "100%", marginBottom: "10px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
// //               />
// //               <input
// //                 type="password"
// //                 placeholder="Password"
// //                 value={regPassword}
// //                 onChange={(e) => setRegPassword(e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && register()}
// //                 style={{ width: "100%", marginBottom: "20px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
// //               />
// //               <button 
// //                 onClick={register}
// //                 style={{ width: "100%", padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
// //               >
// //                 Register
// //               </button>
// //               <p style={{ textAlign: "center", marginTop: "15px" }}>
// //                 Already have an account?{" "}
// //                 <button 
// //                   onClick={() => setIsRegistering(false)}
// //                   style={{ background: "none", border: "none", color: "#667eea", cursor: "pointer" }}
// //                 >
// //                   Login
// //                 </button>
// //               </p>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Main app (logged in)
// //   return (
// //     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: theme.background, minHeight: "100vh", transition: "all 0.3s" }}>
      
// //       {/* Header */}
// //       <div style={{
// //         background: theme.cardBackground,
// //         padding: "15px 30px",
// //         borderRadius: "10px",
// //         marginBottom: "20px",
// //         display: "flex",
// //         justifyContent: "space-between",
// //         alignItems: "center",
// //         flexWrap: "wrap",
// //         gap: "10px",
// //         boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
// //         color: theme.textColor
// //       }}>
// //         <h1 style={{ margin: 0, fontSize: "24px", color: theme.textColor }}>🏆 Sports Odds Platform</h1>
// //         <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
// //           <button 
// //             onClick={() => setDarkMode(!darkMode)}
// //             style={{
// //               padding: "8px 16px",
// //               background: darkMode ? "#ffc107" : "#333",
// //               color: darkMode ? "#333" : "white",
// //               border: "none",
// //               borderRadius: "5px",
// //               cursor: "pointer"
// //             }}
// //           >
// //             {darkMode ? "☀️ Light" : "🌙 Dark"}
// //           </button>
// //           <span>👋 {user?.email?.split("@")[0] || "User"}</span>
// //           <button 
// //             onClick={logout}
// //             style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </div>

// //       {/* Tabs */}
// //       <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
// //         <button
// //           onClick={() => { setActiveTab("matches"); getMatches(); }}
// //           style={{
// //             padding: "10px 30px",
// //             background: activeTab === "matches" ? "#667eea" : theme.cardBackground,
// //             color: activeTab === "matches" ? "white" : theme.textColor,
// //             border: "none",
// //             borderRadius: "8px",
// //             cursor: "pointer"
// //           }}
// //         >
// //           📋 All Matches
// //         </button>
// //         <button
// //           onClick={() => { setActiveTab("favorites"); getFavorites(); }}
// //           style={{
// //             padding: "10px 30px",
// //             background: activeTab === "favorites" ? "#667eea" : theme.cardBackground,
// //             color: activeTab === "favorites" ? "white" : theme.textColor,
// //             border: "none",
// //             borderRadius: "8px",
// //             cursor: "pointer"
// //           }}
// //         >
// //           ⭐ Favorites
// //         </button>
// //         <button
// //           onClick={() => setActiveTab("ai")}
// //           style={{
// //             padding: "10px 30px",
// //             background: activeTab === "ai" ? "#667eea" : theme.cardBackground,
// //             color: activeTab === "ai" ? "white" : theme.textColor,
// //             border: "none",
// //             borderRadius: "8px",
// //             cursor: "pointer"
// //           }}
// //         >
// //           🤖 AI Agent
// //         </button>
// //       </div>

// //       {/* Matches Tab */}
// //       {activeTab === "matches" && (
// //         <div>
// //           <div style={{ textAlign: "center", marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
// //             <button 
// //               onClick={() => getMatches(false)}
// //               style={{ padding: "12px 30px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
// //             >
// //               🔄 Load Matches & AI Odds
// //             </button>
// //             <button 
// //               onClick={exportToCSV}
// //               style={{ padding: "12px 30px", background: "#17a2b8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
// //             >
// //               📥 Export to CSV
// //             </button>
// //           </div>

// //           {/* Search and Filter */}
// //           <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
// //             <input
// //               type="text"
// //               placeholder="🔍 Search matches..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               style={{
// //                 padding: "10px",
// //                 width: "250px",
// //                 borderRadius: "8px",
// //                 border: `1px solid ${theme.borderColor}`,
// //                 background: theme.cardBackground,
// //                 color: theme.textColor
// //               }}
// //             />
// //             <select
// //               value={selectedSport}
// //               onChange={(e) => setSelectedSport(e.target.value)}
// //               style={{
// //                 padding: "10px",
// //                 borderRadius: "8px",
// //                 border: `1px solid ${theme.borderColor}`,
// //                 background: theme.cardBackground,
// //                 color: theme.textColor,
// //                 cursor: "pointer"
// //               }}
// //             >
// //               {getUniqueSports().map(sport => (
// //                 <option key={sport} value={sport}>{sport === "all" ? "All Sports" : sport}</option>
// //               ))}
// //             </select>
// //           </div>

// //           {/* Last Updated */}
// //           {lastUpdated && (
// //             <p style={{ textAlign: "center", fontSize: "12px", color: darkMode ? "#888" : "#999", marginBottom: "10px" }}>
// //               🔄 Auto-refreshes every 30s | Last updated: {lastUpdated}
// //             </p>
// //           )}

// //           {loadingMatches && (
// //             <div style={{ textAlign: "center", padding: "40px", color: theme.textColor }}>
// //               <div style={{ fontSize: "20px" }}>⏳ Loading odds from AI model...</div>
// //               <div style={{ color: darkMode ? "#888" : "#666", marginTop: "10px" }}>Fetching real-time probabilities using ML model</div>
// //             </div>
// //           )}

// //           {!loadingMatches && filteredMatches.length === 0 && (
// //             <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#888" : "#666" }}>
// //               {matches.length === 0 ? "No matches loaded. Click 'Load Matches & AI Odds' to see matches." : "No matches match your search."}
// //             </div>
// //           )}

// //           {/* ✅ IMPROVED: GRID LAYOUT - Cards side by side */}
// //           <div style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
// //             gap: "20px",
// //             padding: "10px"
// //           }}>
// //             {filteredMatches.map((match) => (
// //               <MatchCard key={match.match_id} match={match} showFavoriteButton={true} />
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Favorites Tab */}
// //       {activeTab === "favorites" && (
// //         <div>
// //           <div style={{ textAlign: "center", marginBottom: "20px" }}>
// //             <button 
// //               onClick={getFavorites}
// //               style={{ padding: "12px 30px", background: "#ffc107", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
// //             >
// //               🔄 Refresh Favorites
// //             </button>
// //           </div>

// //           {loadingFavorites && <div style={{ textAlign: "center", padding: "40px", color: theme.textColor }}>⏳ Loading favorites...</div>}

// //           {!loadingFavorites && favorites.length === 0 && (
// //             <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#888" : "#666" }}>
// //               No favorites yet. Add some matches to your favorites!
// //             </div>
// //           )}

// //           {/* ✅ IMPROVED: GRID LAYOUT for favorites too */}
// //           <div style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
// //             gap: "20px",
// //             padding: "10px"
// //           }}>
// //             {favorites.map((match) => (
// //               <MatchCard 
// //                 key={match.match_id} 
// //                 match={match} 
// //                 showFavoriteButton={false}
// //                 isFavorite={true}
// //                 onRemoveFavorite={removeFavorite}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* AI Agent Tab */}
// //       {activeTab === "ai" && (
// //         <div style={{ maxWidth: "600px", margin: "0 auto" }}>
// //           <div style={{
// //             background: theme.cardBackground,
// //             padding: "30px",
// //             borderRadius: "15px",
// //             boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.1)",
// //             color: theme.textColor
// //           }}>
// //             <h2 style={{ textAlign: "center", marginBottom: "20px", color: theme.textColor }}>🤖 AI Sports Analyst</h2>
// //             <p style={{ textAlign: "center", color: darkMode ? "#aaa" : "#666", marginBottom: "20px" }}>
// //               Advanced ML-powered analysis using team ratings, form, and historical data
// //             </p>
            
// //             <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
// //               <input
// //                 placeholder="e.g., Who will win Mumbai Indians vs Chennai Super Kings?"
// //                 value={question}
// //                 onChange={(e) => setQuestion(e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && askAI()}
// //                 style={{ 
// //                   flex: 1, 
// //                   padding: "12px", 
// //                   borderRadius: "8px", 
// //                   border: `1px solid ${theme.borderColor}`,
// //                   background: theme.background,
// //                   color: theme.textColor
// //                 }}
// //               />
// //               <button 
// //                 onClick={askAI}
// //                 disabled={aiLoading}
// //                 style={{
// //                   padding: "12px 24px",
// //                   background: "#667eea",
// //                   color: "white",
// //                   border: "none",
// //                   borderRadius: "8px",
// //                   cursor: "pointer"
// //                 }}
// //               >
// //                 {aiLoading ? "Thinking..." : "Ask"}
// //               </button>
// //             </div>

// //             {aiLoading && (
// //               <div style={{ textAlign: "center", padding: "20px", color: theme.textColor }}>
// //                 <div>🤔 Analyzing matches with ML model...</div>
// //               </div>
// //             )}

// //             {answer && !aiLoading && (
// //               <div style={{
// //                 marginTop: "20px",
// //                 padding: "20px",
// //                 background: darkMode ? "#0f3460" : "#e8f4f8",
// //                 borderRadius: "10px",
// //                 borderLeft: "4px solid #667eea"
// //               }}>
// //                 <h4 style={{ margin: "0 0 10px 0", color: theme.textColor }}>💡 Answer:</h4>
// //                 <p style={{ fontSize: "16px", lineHeight: "1.5", whiteSpace: "pre-line", color: theme.textColor }}>{answer}</p>
// //                 {reasoning && (
// //                   <>
// //                     <hr style={{ margin: "15px 0", borderColor: theme.borderColor }} />
// //                     <h4 style={{ margin: "0 0 10px 0", color: darkMode ? "#aaa" : "#666" }}>🔍 Reasoning:</h4>
// //                     <p style={{ fontSize: "14px", color: darkMode ? "#bbb" : "#555" }}>{reasoning}</p>
// //                   </>
// //                 )}
// //               </div>
// //             )}

// //             <div style={{ marginTop: "20px", padding: "15px", background: darkMode ? "#0f3460" : "#f8f9fa", borderRadius: "8px" }}>
// //               <h4 style={{ margin: "0 0 10px 0", color: theme.textColor }}>📝 Example questions:</h4>
// //               <ul style={{ margin: 0, color: darkMode ? "#aaa" : "#666" }}>
// //                 <li>"Who will win Mumbai Indians vs Chennai Super Kings?"</li>
// //                 <li>"Who is likely to win?"</li>
// //                 <li>"Give me matches with close odds"</li>
// //                 <li>"Which match is most predictable?"</li>
// //                 <li>"Show me value bets"</li>
// //                 <li>"Platform statistics"</li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default App;




// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function App() {
//   // Auth state
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [regEmail, setRegEmail] = useState("");
//   const [regPassword, setRegPassword] = useState("");
//   const [user, setUser] = useState(null);

//   // Data state
//   const [matches, setMatches] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loadingMatches, setLoadingMatches] = useState(false);
//   const [loadingFavorites, setLoadingFavorites] = useState(false);
//   const [activeTab, setActiveTab] = useState("matches");
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSport, setSelectedSport] = useState("all");
//   const [darkMode, setDarkMode] = useState(false);

//   // AI Agent state
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [reasoning, setReasoning] = useState("");
//   const [aiLoading, setAiLoading] = useState(false);

//   // Auto-login if token exists
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     }
//   }, [token]);

//   // Auto-refresh odds every 30 seconds
//   useEffect(() => {
//     if (token && activeTab === 'matches' && matches.length > 0) {
//       const interval = setInterval(() => {
//         getMatches(true);
//       }, 30000);
//       return () => clearInterval(interval);
//     }
//   }, [token, activeTab]);

//   // Dark mode styles
//   const theme = {
//     background: darkMode ? "#1a1a2e" : "#f4f6f8",
//     cardBackground: darkMode ? "#16213e" : "white",
//     textColor: darkMode ? "#eee" : "#333",
//     borderColor: darkMode ? "#0f3460" : "#ddd"
//   };

//   // 🔐 Login
//   const login = async () => {
//     try {
//       const res = await axios.post("http://localhost:5000/login", {
//         email,
//         password,
//       });
//       setToken(res.data.token);
//       setUser(res.data.user);
//       localStorage.setItem("token", res.data.token);
//       alert("✅ Login successful!");
//       setEmail("");
//       setPassword("");
//     } catch (err) {
//       alert("❌ Login failed: " + (err.response?.data?.error || err.message));
//     }
//   };

//   // 📝 Register
//   const register = async () => {
//     try {
//       await axios.post("http://localhost:5000/register", {
//         email: regEmail,
//         password: regPassword,
//       });
//       alert("✅ Registration successful! Please login.");
//       setIsRegistering(false);
//       setRegEmail("");
//       setRegPassword("");
//     } catch (err) {
//       alert("❌ Registration failed: " + (err.response?.data?.error || err.message));
//     }
//   };

//   // Logout
//   const logout = () => {
//     setToken("");
//     setUser(null);
//     localStorage.removeItem("token");
//     setMatches([]);
//     setFavorites([]);
//     setAnswer("");
//     alert("Logged out");
//   };

//   // 📊 Get matches
//   const getMatches = async (silent = false) => {
//     if (!token) {
//       alert("Please login first");
//       return;
//     }
    
//     if (!silent) setLoadingMatches(true);
//     try {
//       const res = await axios.get("http://localhost:5000/matches", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMatches(res.data);
//       setLastUpdated(new Date().toLocaleTimeString());
//     } catch (err) {
//       if (!silent) alert("Error fetching matches: " + (err.response?.data?.error || err.message));
//     } finally {
//       if (!silent) setLoadingMatches(false);
//     }
//   };

//   // ⭐ Get favorites
//   const getFavorites = async () => {
//     if (!token) return;
    
//     setLoadingFavorites(true);
//     try {
//       const res = await axios.get("http://localhost:5000/favorites", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFavorites(res.data);
//     } catch (err) {
//       alert("Error fetching favorites");
//     } finally {
//       setLoadingFavorites(false);
//     }
//   };

//   // ⭐ Add to favorites
//   const addFavorite = async (matchId) => {
//     if (!token) {
//       alert("Please login first");
//       return;
//     }
    
//     try {
//       await axios.post(
//         "http://localhost:5000/favorites",
//         { match_id: matchId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("⭐ Added to favorites!");
//       if (activeTab === "favorites") {
//         getFavorites();
//       }
//     } catch (err) {
//       alert("Error adding favorite");
//     }
//   };

//   // ❌ Remove from favorites
//   const removeFavorite = async (matchId) => {
//     try {
//       await axios.delete(`http://localhost:5000/favorites/${matchId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("Removed from favorites");
//       getFavorites();
//     } catch (err) {
//       alert("Error removing favorite");
//     }
//   };

//   // 🤖 AI Agent
//   const askAI = async () => {
//     if (!token) {
//       alert("Please login first");
//       return;
//     }
//     if (!question.trim()) {
//       alert("Please enter a question");
//       return;
//     }
    
//     setAiLoading(true);
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/agent/query",
//         { question },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setAnswer(res.data.answer);
//       setReasoning(res.data.reasoning || "");
//     } catch (err) {
//       alert("AI error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   // 📊 Export to CSV
//   const exportToCSV = () => {
//     const headers = ["Match", "Team A Odds", "Draw Odds", "Team B Odds", "Team A Prob", "Draw Prob", "Team B Prob"];
//     const rows = matches.map(m => [
//       m.teams,
//       m.odds?.teamA || "N/A",
//       m.odds?.draw || "N/A",
//       m.odds?.teamB || "N/A",
//       m.probabilities?.teamA ? (m.probabilities.teamA * 100).toFixed(1) + "%" : "N/A",
//       m.probabilities?.draw ? (m.probabilities.draw * 100).toFixed(1) + "%" : "N/A",
//       m.probabilities?.teamB ? (m.probabilities.teamB * 100).toFixed(1) + "%" : "N/A"
//     ]);
    
//     const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `matches_${new Date().toISOString()}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   // Countdown Timer Component
//   const CountdownTimer = ({ startTime }) => {
//     const [timeLeft, setTimeLeft] = useState("");
    
//     useEffect(() => {
//       const timer = setInterval(() => {
//         const now = new Date();
//         const matchTime = new Date(startTime);
//         const diff = matchTime - now;
        
//         if (diff <= 0) {
//           setTimeLeft("🔴 Live Now!");
//           clearInterval(timer);
//         } else {
//           const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//           const hours = Math.floor((diff % (86400000)) / 3600000);
//           const minutes = Math.floor((diff % 3600000) / 60000);
          
//           if (days > 0) {
//             setTimeLeft(`📅 ${days}d ${hours}h left`);
//           } else if (hours > 0) {
//             setTimeLeft(`⏰ ${hours}h ${minutes}m left`);
//           } else {
//             setTimeLeft(`⏰ ${minutes}m left`);
//           }
//         }
//       }, 1000);
      
//       return () => clearInterval(timer);
//     }, [startTime]);
    
//     return <span style={{ fontSize: "12px", color: "#666" }}>{timeLeft}</span>;
//   };

//   // Probability bar component
//   const ProbabilityBar = ({ probability, label, color }) => (
//     <div style={{ marginBottom: "8px" }}>
//       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", fontSize: "12px" }}>
//         <span>{label}</span>
//         <span>{Math.round(probability * 100)}%</span>
//       </div>
//       <div style={{ background: "#e0e0e0", borderRadius: "5px", height: "6px", overflow: "hidden" }}>
//         <div 
//           style={{ 
//             width: `${probability * 100}%`, 
//             background: color, 
//             height: "100%",
//             transition: "width 0.3s ease"
//           }} 
//         />
//       </div>
//     </div>
//   );

//   // Match card component - with proper spacing
//   const MatchCard = ({ match, showFavoriteButton = true, isFavorite = false, onRemoveFavorite = null }) => (
//     <div style={{
//       background: theme.cardBackground,
//       padding: "15px",
//       borderRadius: "12px",
//       boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
//       transition: "transform 0.2s, box-shadow 0.2s",
//       color: theme.textColor,
//       display: "flex",
//       flexDirection: "column",
//       height: "auto",
//       minHeight: "380px",
//       cursor: "pointer",
//       ':hover': {
//         transform: "translateY(-4px)",
//         boxShadow: darkMode ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.15)"
//       }
//     }}>
//       {/* Sport Badge */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexShrink: 0 }}>
//         <span style={{
//           background: match.sport === "Football" ? "#28a745" : match.sport === "Cricket" ? "#ffc107" : "#dc3545",
//           color: "white",
//           padding: "2px 8px",
//           borderRadius: "20px",
//           fontSize: "10px",
//           fontWeight: "bold"
//         }}>
//           {match.sport}
//         </span>
//         {match.league && <span style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.league}</span>}
//       </div>

//       {/* Teams */}
//       <h3 style={{ textAlign: "center", marginBottom: "5px", fontSize: "16px", color: theme.textColor, flexShrink: 0 }}>
//         {match.team_a} <span style={{ color: "#ffc107" }}>vs</span> {match.team_b}
//       </h3>
      
//       {/* Time */}
//       {match.start_time && (
//         <div style={{ textAlign: "center", marginBottom: "10px", flexShrink: 0 }}>
//           <CountdownTimer startTime={match.start_time} />
//           <p style={{ fontSize: "10px", color: darkMode ? "#888" : "#999", marginTop: "3px" }}>
//             🕐 {new Date(match.start_time).toLocaleString()}
//           </p>
//         </div>
//       )}

//       {/* Odds Display - Compact */}
//       {match.odds && (
//         <>
//           <div style={{ 
//             display: "flex", 
//             justifyContent: "space-around", 
//             marginBottom: "12px",
//             padding: "8px",
//             background: darkMode ? "#0f3460" : "#f8f9fa",
//             borderRadius: "8px",
//             flexShrink: 0
//           }}>
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontWeight: "bold", color: "#28a745", fontSize: "16px" }}>{match.odds.teamA}</div>
//               <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.team_a?.split(" ").pop()}</div>
//             </div>
//             {match.odds.draw !== null && match.odds.draw !== "N/A" && (
//               <div style={{ textAlign: "center" }}>
//                 <div style={{ fontWeight: "bold", color: "#ffc107", fontSize: "16px" }}>{match.odds.draw}</div>
//                 <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>Draw</div>
//               </div>
//             )}
//             <div style={{ textAlign: "center" }}>
//               <div style={{ fontWeight: "bold", color: "#dc3545", fontSize: "16px" }}>{match.odds.teamB}</div>
//               <div style={{ fontSize: "10px", color: darkMode ? "#aaa" : "#666" }}>{match.team_b?.split(" ").pop()}</div>
//             </div>
//           </div>

//           {/* Probability Bars - Compact */}
//           {match.probabilities && (
//             <div style={{ marginBottom: "10px", flexShrink: 0 }}>
//               <ProbabilityBar 
//                 probability={match.probabilities.teamA} 
//                 label={match.team_a?.split(" ").pop() || "Team A"} 
//                 color="#28a745"
//               />
//               {match.probabilities.draw > 0 && (
//                 <ProbabilityBar 
//                   probability={match.probabilities.draw} 
//                   label="Draw" 
//                   color="#ffc107"
//                 />
//               )}
//               <ProbabilityBar 
//                 probability={match.probabilities.teamB} 
//                 label={match.team_b?.split(" ").pop() || "Team B"} 
//                 color="#dc3545"
//               />
//             </div>
//           )}

//           {/* Analysis Badge */}
//           {match.analysis && match.analysis.is_close_match && (
//             <div style={{ marginBottom: "10px", padding: "4px", background: "#fff3cd", borderRadius: "4px", textAlign: "center", fontSize: "10px", color: "#856404", flexShrink: 0 }}>
//               🔥 Close Match
//             </div>
//           )}
//         </>
//       )}

//       {/* Favorite Button */}
//       <div style={{ textAlign: "center", marginTop: "auto", paddingTop: "15px", flexShrink: 0 }}>
//         {showFavoriteButton ? (
//           <button 
//             onClick={() => addFavorite(match.match_id)}
//             style={{
//               padding: "8px 12px",
//               background: "#ffc107",
//               color: "#333",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "12px",
//               width: "100%"
//             }}
//           >
//             ⭐ Add to Favorites
//           </button>
//         ) : isFavorite && onRemoveFavorite ? (
//           <button 
//             onClick={() => onRemoveFavorite(match.match_id)}
//             style={{
//               padding: "8px 12px",
//               background: "#dc3545",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "12px",
//               width: "100%"
//             }}
//           >
//             ❌ Remove
//           </button>
//         ) : null}
//       </div>
//     </div>
//   );

//   // Filter matches
//   const getUniqueSports = () => {
//     const sports = matches.map(m => m.sport);
//     return ["all", ...new Set(sports)];
//   };

//   const filteredMatches = matches.filter(match => {
//     const matchesSearch = match.teams.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesSport = selectedSport === "all" || match.sport === selectedSport;
//     return matchesSearch && matchesSport;
//   });

//   // Auth form
//   if (!token) {
//     return (
//       <div style={{ 
//         minHeight: "100vh", 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center",
//         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//       }}>
//         <div style={{
//           background: "white",
//           padding: "40px",
//           borderRadius: "20px",
//           width: "350px",
//           boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
//         }}>
//           <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
//             🏆 Sports Odds
//           </h1>
          
//           {!isRegistering ? (
//             <>
//               <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>
//               <input
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 style={{ width: "100%", marginBottom: "10px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && login()}
//                 style={{ width: "100%", marginBottom: "20px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
//               />
//               <button 
//                 onClick={login}
//                 style={{ width: "100%", padding: "12px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
//               >
//                 Login
//               </button>
//               <p style={{ textAlign: "center", marginTop: "15px" }}>
//                 Don't have an account?{" "}
//                 <button 
//                   onClick={() => setIsRegistering(true)}
//                   style={{ background: "none", border: "none", color: "#667eea", cursor: "pointer" }}
//                 >
//                   Register
//                 </button>
//               </p>
//             </>
//           ) : (
//             <>
//               <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
//               <input
//                 placeholder="Email"
//                 value={regEmail}
//                 onChange={(e) => setRegEmail(e.target.value)}
//                 style={{ width: "100%", marginBottom: "10px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={regPassword}
//                 onChange={(e) => setRegPassword(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && register()}
//                 style={{ width: "100%", marginBottom: "20px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
//               />
//               <button 
//                 onClick={register}
//                 style={{ width: "100%", padding: "12px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
//               >
//                 Register
//               </button>
//               <p style={{ textAlign: "center", marginTop: "15px" }}>
//                 Already have an account?{" "}
//                 <button 
//                   onClick={() => setIsRegistering(false)}
//                   style={{ background: "none", border: "none", color: "#667eea", cursor: "pointer" }}
//                 >
//                   Login
//                 </button>
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main app (logged in)
//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", background: theme.background, minHeight: "100vh", transition: "all 0.3s" }}>
      
//       {/* Header */}
//       <div style={{
//         background: theme.cardBackground,
//         padding: "15px 30px",
//         borderRadius: "10px",
//         marginBottom: "20px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         flexWrap: "wrap",
//         gap: "10px",
//         boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.1)",
//         color: theme.textColor
//       }}>
//         <h1 style={{ margin: 0, fontSize: "24px", color: theme.textColor }}>🏆 Sports Odds Platform</h1>
//         <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
//           <button 
//             onClick={() => setDarkMode(!darkMode)}
//             style={{
//               padding: "8px 16px",
//               background: darkMode ? "#ffc107" : "#333",
//               color: darkMode ? "#333" : "white",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer"
//             }}
//           >
//             {darkMode ? "☀️ Light" : "🌙 Dark"}
//           </button>
//           <span>👋 {user?.email?.split("@")[0] || "User"}</span>
//           <button 
//             onClick={logout}
//             style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
//         <button
//           onClick={() => { setActiveTab("matches"); getMatches(); }}
//           style={{
//             padding: "10px 30px",
//             background: activeTab === "matches" ? "#667eea" : theme.cardBackground,
//             color: activeTab === "matches" ? "white" : theme.textColor,
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer"
//           }}
//         >
//           📋 All Matches
//         </button>
//         <button
//           onClick={() => { setActiveTab("favorites"); getFavorites(); }}
//           style={{
//             padding: "10px 30px",
//             background: activeTab === "favorites" ? "#667eea" : theme.cardBackground,
//             color: activeTab === "favorites" ? "white" : theme.textColor,
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer"
//           }}
//         >
//           ⭐ Favorites
//         </button>
//         <button
//           onClick={() => setActiveTab("ai")}
//           style={{
//             padding: "10px 30px",
//             background: activeTab === "ai" ? "#667eea" : theme.cardBackground,
//             color: activeTab === "ai" ? "white" : theme.textColor,
//             border: "none",
//             borderRadius: "8px",
//             cursor: "pointer"
//           }}
//         >
//           🤖 AI Agent
//         </button>
//       </div>

//       {/* Matches Tab */}
//       {activeTab === "matches" && (
//         <div>
//           <div style={{ textAlign: "center", marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
//             <button 
//               onClick={() => getMatches(false)}
//               style={{ padding: "12px 30px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
//             >
//               🔄 Load Matches & AI Odds
//             </button>
//             <button 
//               onClick={exportToCSV}
//               style={{ padding: "12px 30px", background: "#17a2b8", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
//             >
//               📥 Export to CSV
//             </button>
//           </div>

//           {/* Search and Filter */}
//           <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
//             <input
//               type="text"
//               placeholder="🔍 Search matches..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 padding: "10px",
//                 width: "250px",
//                 borderRadius: "8px",
//                 border: `1px solid ${theme.borderColor}`,
//                 background: theme.cardBackground,
//                 color: theme.textColor
//               }}
//             />
//             <select
//               value={selectedSport}
//               onChange={(e) => setSelectedSport(e.target.value)}
//               style={{
//                 padding: "10px",
//                 borderRadius: "8px",
//                 border: `1px solid ${theme.borderColor}`,
//                 background: theme.cardBackground,
//                 color: theme.textColor,
//                 cursor: "pointer"
//               }}
//             >
//               {getUniqueSports().map(sport => (
//                 <option key={sport} value={sport}>{sport === "all" ? "All Sports" : sport}</option>
//               ))}
//             </select>
//           </div>

//           {/* Last Updated */}
//           {lastUpdated && (
//             <p style={{ textAlign: "center", fontSize: "12px", color: darkMode ? "#888" : "#999", marginBottom: "10px" }}>
//               🔄 Auto-refreshes every 30s | Last updated: {lastUpdated}
//             </p>
//           )}

//           {loadingMatches && (
//             <div style={{ textAlign: "center", padding: "40px", color: theme.textColor }}>
//               <div style={{ fontSize: "20px" }}>⏳ Loading odds from AI model...</div>
//               <div style={{ color: darkMode ? "#888" : "#666", marginTop: "10px" }}>Fetching real-time probabilities using ML model</div>
//             </div>
//           )}

//           {!loadingMatches && filteredMatches.length === 0 && (
//             <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#888" : "#666" }}>
//               {matches.length === 0 ? "No matches loaded. Click 'Load Matches & AI Odds' to see matches." : "No matches match your search."}
//             </div>
//           )}

//           {/* FIXED: 4 cards per row with PROPER ROW SPACING - no overlap */}
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "30px 24px",
//             padding: "20px 10px 60px 10px",
//             marginBottom: "40px"
//           }}>
//             {filteredMatches.map((match) => (
//               <MatchCard key={match.match_id} match={match} showFavoriteButton={true} />
//             ))}
//           </div>
          
//           {/* Responsive behavior for smaller screens */}
//           <style>{`
//             @media (max-width: 1200px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(3, 1fr) !important;
//                 gap: 30px 20px !important;
//               }
//             }
//             @media (max-width: 900px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(2, 1fr) !important;
//                 gap: 30px 20px !important;
//               }
//             }
//             @media (max-width: 600px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(1, 1fr) !important;
//                 gap: 30px !important;
//               }
//             }
//           `}</style>
//         </div>
//       )}

//       {/* Favorites Tab */}
//       {activeTab === "favorites" && (
//         <div>
//           <div style={{ textAlign: "center", marginBottom: "20px" }}>
//             <button 
//               onClick={getFavorites}
//               style={{ padding: "12px 30px", background: "#ffc107", color: "#333", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}
//             >
//               🔄 Refresh Favorites
//             </button>
//           </div>

//           {loadingFavorites && <div style={{ textAlign: "center", padding: "40px", color: theme.textColor }}>⏳ Loading favorites...</div>}

//           {!loadingFavorites && favorites.length === 0 && (
//             <div style={{ textAlign: "center", padding: "40px", color: darkMode ? "#888" : "#666" }}>
//               No favorites yet. Add some matches to your favorites!
//             </div>
//           )}

//           {/* FIXED: 4 cards per row with PROPER ROW SPACING for favorites */}
//           <div style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(4, 1fr)",
//             gap: "30px 24px",
//             padding: "20px 10px 60px 10px",
//             marginBottom: "40px"
//           }}>
//             {favorites.map((match) => (
//               <MatchCard 
//                 key={match.match_id} 
//                 match={match} 
//                 showFavoriteButton={false}
//                 isFavorite={true}
//                 onRemoveFavorite={removeFavorite}
//               />
//             ))}
//           </div>
          
//           {/* Responsive behavior for favorites */}
//           <style>{`
//             @media (max-width: 1200px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(3, 1fr) !important;
//                 gap: 30px 20px !important;
//               }
//             }
//             @media (max-width: 900px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(2, 1fr) !important;
//                 gap: 30px 20px !important;
//               }
//             }
//             @media (max-width: 600px) {
//               div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
//                 grid-template-columns: repeat(1, 1fr) !important;
//                 gap: 30px !important;
//               }
//             }
//           `}</style>
//         </div>
//       )}

//       {/* AI Agent Tab */}
//       {activeTab === "ai" && (
//         <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "40px" }}>
//           <div style={{
//             background: theme.cardBackground,
//             padding: "30px",
//             borderRadius: "15px",
//             boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.1)",
//             color: theme.textColor
//           }}>
//             <h2 style={{ textAlign: "center", marginBottom: "20px", color: theme.textColor }}>🤖 AI Sports Analyst</h2>
//             <p style={{ textAlign: "center", color: darkMode ? "#aaa" : "#666", marginBottom: "20px" }}>
//               Advanced ML-powered analysis using team ratings, form, and historical data
//             </p>
            
//             <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
//               <input
//                 placeholder="e.g., Who will win Mumbai Indians vs Chennai Super Kings?"
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && askAI()}
//                 style={{ 
//                   flex: 1, 
//                   padding: "12px", 
//                   borderRadius: "8px", 
//                   border: `1px solid ${theme.borderColor}`,
//                   background: theme.background,
//                   color: theme.textColor
//                 }}
//               />
//               <button 
//                 onClick={askAI}
//                 disabled={aiLoading}
//                 style={{
//                   padding: "12px 24px",
//                   background: "#667eea",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   cursor: "pointer"
//                 }}
//               >
//                 {aiLoading ? "Thinking..." : "Ask"}
//               </button>
//             </div>

//             {aiLoading && (
//               <div style={{ textAlign: "center", padding: "20px", color: theme.textColor }}>
//                 <div>🤔 Analyzing matches with ML model...</div>
//               </div>
//             )}

//             {answer && !aiLoading && (
//               <div style={{
//                 marginTop: "20px",
//                 padding: "20px",
//                 background: darkMode ? "#0f3460" : "#e8f4f8",
//                 borderRadius: "10px",
//                 borderLeft: "4px solid #667eea"
//               }}>
//                 <h4 style={{ margin: "0 0 10px 0", color: theme.textColor }}>💡 Answer:</h4>
//                 <p style={{ fontSize: "16px", lineHeight: "1.5", whiteSpace: "pre-line", color: theme.textColor }}>{answer}</p>
//                 {reasoning && (
//                   <>
//                     <hr style={{ margin: "15px 0", borderColor: theme.borderColor }} />
//                     <h4 style={{ margin: "0 0 10px 0", color: darkMode ? "#aaa" : "#666" }}>🔍 Reasoning:</h4>
//                     <p style={{ fontSize: "14px", color: darkMode ? "#bbb" : "#555" }}>{reasoning}</p>
//                   </>
//                 )}
//               </div>
//             )}

//             <div style={{ marginTop: "20px", padding: "15px", background: darkMode ? "#0f3460" : "#f8f9fa", borderRadius: "8px" }}>
//               <h4 style={{ margin: "0 0 10px 0", color: theme.textColor }}>📝 Example questions:</h4>
//               <ul style={{ margin: 0, color: darkMode ? "#aaa" : "#666" }}>
//                 <li>"Who will win Mumbai Indians vs Chennai Super Kings?"</li>
//                 <li>"Who is likely to win?"</li>
//                 <li>"Give me matches with close odds"</li>
//                 <li>"Which match is most predictable?"</li>
//                 <li>"Show me value bets"</li>
//                 <li>"Platform statistics"</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;




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