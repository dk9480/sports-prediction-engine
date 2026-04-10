import React, { useState } from "react";

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password);
  };

  return (
    <>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "20px", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Register
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} style={{ background: "none", border: "none", color: "#667eea", cursor: "pointer" }}>
          Login
        </button>
      </p>
    </>
  );
};

export default Register;