import { api } from "./client";

export const avisApi = {
  // Public
  getPublies: (langue = "fr") => api.get(`/api/Avis?langue=${langue}`),

  creer: (donnees) => api.post("/api/Avis", donnees),

  // Admin
  getTous: (statut = null) =>
    api.get(`/api/Avis/tous${statut ? `?statut=${statut}` : ""}`),

  getById: (id) => api.get(`/api/Avis/${id}`),

  modererStatut: (id, statut) =>
    api.patch(`/api/Avis/${id}/statut`, { statut }),
};
