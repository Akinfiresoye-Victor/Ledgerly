import api from "./client";

export const dashboardApi = {
  getSummary: (params = {}) => api.get("/summary/", { params }),
};

export const insightsApi = {
  list: (params = {}) => api.get("/insights/", { params }),
  dismiss: (id) => api.post(`/insights/${id}/dismiss/`),
};
