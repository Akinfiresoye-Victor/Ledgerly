import api from "./client";

export const transactionsApi = {
  list: (params = {}) => api.get("/api/transactions/", { params }),
  get: (id) => api.get(`/api/transactions/${id}/`),
  create: (data) => api.post("/api/transactions/", data),
  update: (id, data) => api.patch(`/api/transactions/${id}/`, data),
  confirm: (id, data = {}) => api.post(`/api/transactions/${id}/confirm/`, data),
  delete: (id) => api.delete(`/api/transactions/${id}/`),
  getCategories: () => api.get("/api/categories/"),
};

export default transactionsApi;
