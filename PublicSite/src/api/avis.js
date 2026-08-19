import { api } from "./client";

export const avisApi = {
  // Public
  getPublies: () => api.get("/api/Avis"),

  creer: (donnees) => api.post("/api/Avis", donnees),

  // Admin
  getTous: (statut = null) =>
    api.get(`/api/Avis/tous${statut ? `?statut=${statut}` : ""}`),

  getById: (id) => api.get(`/api/Avis/${id}`),

  modererStatut: (id, statut) =>
    api.patch(`/api/Avis/${id}/statut`, { statut }),
};
