import { api } from "./client";

export const galerieApi = {
  // Public — categorie optionnelle : "interieur", "plats", "ambiance", "details", "evenements"
  getAll: (langue = "fr", categorie = null) =>
    api.get(
      `/api/Galerie?langue=${langue}${categorie ? `&categorie=${categorie}` : ""}`
    ),

  // Admin
  ajouter: (donnees) => api.post("/api/Galerie", donnees),

  supprimer: (id) => api.delete(`/api/Galerie/${id}`),

  reorganiser: (ordreImages) =>
    api.patch("/api/Galerie/reorganiser", { ordreImages }),
};
