import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const api = axios.create({ 
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  }
});

// Attach the access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If we get a 401, try once to refresh the token, then retry the request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const { data } = await axios.post(`${BASE}/auth/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem("access", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (refreshErr) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        // Only redirect if not already on an auth page
        if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/signup") && !window.location.pathname.startsWith("/verify-otp")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
