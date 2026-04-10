import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    darkMode,
    setDarkMode,
    colors: {
      background: darkMode ? "#1a1a2e" : "#f4f6f8",
      cardBackground: darkMode ? "#16213e" : "white",
      textColor: darkMode ? "#eee" : "#333",
      borderColor: darkMode ? "#0f3460" : "#ddd",
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};