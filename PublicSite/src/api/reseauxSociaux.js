import { api } from "./client";

export const reseauxSociauxApi = {
  // Public
  getAll: () => api.get("/api/ReseauxSociaux"),

  // Admin
  creer: (donnees) => api.post("/api/ReseauxSociaux", donnees),

  modifier: (id, donnees) => api.put(`/api/ReseauxSociaux/${id}`, donnees),

  supprimer: (id) => api.delete(`/api/ReseauxSociaux/${id}`),
};
