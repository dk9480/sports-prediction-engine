import React, { useState, useEffect } from "react";

const CountdownTimer = ({ startTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const matchTime = new Date(startTime);
      const diff = matchTime - now;

      if (diff <= 0) {
        setTimeLeft("🔴 Live Now!");
        clearInterval(timer);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);

        if (days > 0) {
          setTimeLeft(`📅 ${days}d ${hours}h left`);
        } else if (hours > 0) {
          setTimeLeft(`⏰ ${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`⏰ ${minutes}m left`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return <span style={{ fontSize: "12px", color: "#666" }}>{timeLeft}</span>;
};

export default CountdownTimer;