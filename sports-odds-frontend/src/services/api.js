import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email, password) => api.post("/register", { email, password }),
  login: (email, password) => api.post("/login", { email, password }),
};

export const matchesAPI = {
  getAll: () => api.get("/matches"),
  getFavorites: () => api.get("/favorites"),
  addFavorite: (matchId) => api.post("/favorites", { match_id: matchId }),
  removeFavorite: (matchId) => api.delete(`/favorites/${matchId}`),
};

export const agentAPI = {
  query: (question) => api.post("/agent/query", { question }),
};

export default api;
