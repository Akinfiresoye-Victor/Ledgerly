import api from "./client";

export const documentsApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/documents/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  },
  get: (id) => api.get(`/documents/${id}/`),
  list: () => api.get("/documents/"),
};

export default documentsApi;
