import { api } from "./client";

export const faqApi = {
  // Public
  getAll: (langue = "fr") => api.get(`/api/Faq?langue=${langue}`),

  // Admin
  creer: (donnees) => api.post("/api/Faq", donnees),

  modifier: (id, donnees) => api.put(`/api/Faq/${id}`, donnees),

  supprimer: (id) => api.delete(`/api/Faq/${id}`),
};
