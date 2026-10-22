import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({ 
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  }
});

// Attach the Knox/DRF Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      const path = window.location.pathname;
      if (
        !path.startsWith("/login") &&
        !path.startsWith("/signup") &&
        !path.startsWith("/verify-otp")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
