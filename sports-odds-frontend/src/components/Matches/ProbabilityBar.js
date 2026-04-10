import React from "react";

const ProbabilityBar = ({ probability, label, color }) => (
  <div style={{ marginBottom: "8px" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "3px",
        fontSize: "12px",
      }}
    >
      <span>{label}</span>
      <span>{Math.round(probability * 100)}%</span>
    </div>
    <div
      style={{
        background: "#e0e0e0",
        borderRadius: "5px",
        height: "6px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${probability * 100}%`,
          background: color,
          height: "100%",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  </div>
);

export default ProbabilityBar;