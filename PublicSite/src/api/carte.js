import { api } from "./client";

export const carteApi = {
  // Public
  getCarte: (langue = "fr") => api.get(`/api/Plats/carte?langue=${langue}`),

  getPlat: (id, langue = "fr") => api.get(`/api/Plats/${id}?langue=${langue}`),

  // Admin
  creerPlat: (donnees) => api.post("/api/Plats", donnees),

  modifierPlat: (id, donnees) => api.put(`/api/Plats/${id}`, donnees),

  supprimerPlat: (id) => api.delete(`/api/Plats/${id}`),
};
