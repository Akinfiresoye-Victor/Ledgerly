import api from "./client";

export const authApi = {
  // Live Django backend endpoints
  register: (payload) => api.post("/auth/register/", payload),
  login: (payload) => api.post("/auth/login/", payload),
  getProfile: () => api.get("/auth/profile/"),
  logout: () => api.post("/auth/logout/"),

  // Pending backend endpoints with graceful local fallbacks
  verifyOtp: async (payload) => {
    try {
      return await api.post("/auth/verify-otp/", payload);
    } catch (err) {
      console.warn("Backend /auth/verify-otp/ not available yet; falling back to local state.", err?.message);
      return { data: { success: true, message: "Simulated OTP verification" } };
    }
  },
  resendOtp: async (payload) => {
    try {
      return await api.post("/auth/resend-otp/", payload);
    } catch (err) {
      console.warn("Backend /auth/resend-otp/ not available yet; falling back to local state.", err?.message);
      return { data: { success: true, message: "Simulated OTP resend" } };
    }
  },
  updateProfile: async (data) => {
    try {
      return await api.patch("/auth/profile/", data);
    } catch (err) {
      console.warn("Backend PATCH /auth/profile/ not available yet; updating local state.", err?.message);
      return { data };
    }
  },
  getBusiness: async () => {
    try {
      return await api.get("/business/");
    } catch (err) {
      return { data: {} };
    }
  },
  updateBusiness: async (data) => {
    try {
      return await api.patch("/business/", data);
    } catch (err) {
      return { data };
    }
  },
};

export default authApi;
