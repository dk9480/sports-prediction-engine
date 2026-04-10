import React, { useState } from "react";
import { useTheme } from "../Layout/ThemeContext";

const AIAgent = ({ onAskQuestion, loading }) => {
  const { colors, darkMode } = useTheme();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reasoning, setReasoning] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }
    const response = await onAskQuestion(question);
    if (response) {
      setAnswer(response.answer);
      setReasoning(response.reasoning || "");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", paddingBottom: "40px" }}>
      <div
        style={{
          background: colors.cardBackground,
          padding: "30px",
          borderRadius: "15px",
          boxShadow: darkMode ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.1)",
          color: colors.textColor,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: colors.textColor }}>
          🤖 AI Sports Analyst
        </h2>
        <p style={{ textAlign: "center", color: darkMode ? "#aaa" : "#666", marginBottom: "20px" }}>
          Advanced ML-powered analysis using team ratings, form, and historical data
        </p>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            placeholder="e.g., Who will win Mumbai Indians vs Chennai Super Kings?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAsk()}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: `1px solid ${colors.borderColor}`,
              background: colors.background,
              color: colors.textColor,
            }}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "20px", color: colors.textColor }}>
            <div>🤔 Analyzing matches with ML model...</div>
          </div>
        )}

        {answer && !loading && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: darkMode ? "#0f3460" : "#e8f4f8",
              borderRadius: "10px",
              borderLeft: "4px solid #667eea",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: colors.textColor }}>💡 Answer:</h4>
            <p style={{ fontSize: "16px", lineHeight: "1.5", whiteSpace: "pre-line", color: colors.textColor }}>
              {answer}
            </p>
            {reasoning && (
              <>
                <hr style={{ margin: "15px 0", borderColor: colors.borderColor }} />
                <h4 style={{ margin: "0 0 10px 0", color: darkMode ? "#aaa" : "#666" }}>🔍 Reasoning:</h4>
                <p style={{ fontSize: "14px", color: darkMode ? "#bbb" : "#555" }}>{reasoning}</p>
              </>
            )}
          </div>
        )}

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: darkMode ? "#0f3460" : "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ margin: "0 0 10px 0", color: colors.textColor }}>📝 Example questions:</h4>
          <ul style={{ margin: 0, color: darkMode ? "#aaa" : "#666" }}>
            <li>"Who will win Mumbai Indians vs Chennai Super Kings?"</li>
            <li>"Who is likely to win?"</li>
            <li>"Give me matches with close odds"</li>
            <li>"Which match is most predictable?"</li>
            <li>"Show me value bets"</li>
            <li>"Platform statistics"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIAgent;
