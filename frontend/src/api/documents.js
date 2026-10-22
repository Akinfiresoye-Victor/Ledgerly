import api from "./client";

export const documentsApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/documents/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
  get: (id) => api.get(`/api/documents/${id}/`),
  list: () => api.get("/api/documents/"),
};

export default documentsApi;
