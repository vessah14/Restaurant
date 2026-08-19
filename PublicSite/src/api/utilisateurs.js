import { api } from "./client";

export const utilisateursApi = {
  // Client connecté — son propre profil
  monProfil: () => api.get("/api/Utilisateurs/moi"),

  modifierMonProfil: (donnees) => api.put("/api/Utilisateurs/moi", donnees),

  // Public
  emailExiste: (email) =>
    api.get(`/api/Utilisateurs/email-existe?email=${encodeURIComponent(email)}`),

  // Admin
  getTous: (inclureInactifs = false) =>
    api.get(`/api/Utilisateurs?inclureInactifs=${inclureInactifs}`),

  getById: (id) => api.get(`/api/Utilisateurs/${id}`),

  desactiver: (id) => api.patch(`/api/Utilisateurs/${id}/desactiver`),

  reactiver: (id) => api.patch(`/api/Utilisateurs/${id}/reactiver`),
};
