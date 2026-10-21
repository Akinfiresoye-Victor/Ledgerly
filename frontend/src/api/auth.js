import api from "./client";

export const authApi = {
  register: (payload) => api.post("/auth/register/", payload),
  verifyOtp: (payload) => api.post("/auth/verify-otp/", payload),
  resendOtp: (payload) => api.post("/auth/resend-otp/", payload),
  login: (payload) => api.post("/auth/login/", payload),
  refreshToken: (payload) => api.post("/auth/refresh/", payload),
  getProfile: () => api.get("/auth/profile/"),
  updateProfile: (data) => api.patch("/auth/profile/", data),
  getBusiness: () => api.get("/business/"),
  updateBusiness: (data) => api.patch("/business/", data),
};

export default authApi;
