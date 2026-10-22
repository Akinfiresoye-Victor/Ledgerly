import api from "./client";

export const dashboardApi = {
  getSummary: (params = {}) => api.get("/api/dashboard/summary/", { params }),
};

export const insightsApi = {
  list: (params = {}) => api.get("/api/dashboard/insights/", { params }),
  dismiss: (id) => api.post(`/api/dashboard/insights/${id}/dismiss/`),
};
