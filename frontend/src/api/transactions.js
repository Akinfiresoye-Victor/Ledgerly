import api from "./client";

export const transactionsApi = {
  list: (params = {}) => api.get("/transactions/", { params }),
  get: (id) => api.get(`/transactions/${id}/`),
  create: (data) => api.post("/transactions/", data),
  update: (id, data) => api.patch(`/transactions/${id}/`, data),
  confirm: (id, data = {}) => api.post(`/transactions/${id}/confirm/`, data),
  delete: (id) => api.delete(`/transactions/${id}/`),
  getCategories: () => api.get("/categories/"),
};

export default transactionsApi;
