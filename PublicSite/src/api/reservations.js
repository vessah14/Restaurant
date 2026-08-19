import { api } from "./client";

export const reservationsApi = {
  // Public — avec ou sans compte
  creer: (donnees) => api.post("/api/Reservations", donnees),

  // Client connecté
  mesReservations: () => api.get("/api/Reservations/mes-reservations"),

  // Admin
  getTous: (statut = null) =>
    api.get(`/api/Reservations${statut ? `?statut=${statut}` : ""}`),

  getById: (id) => api.get(`/api/Reservations/${id}`),

  modifierStatut: (id, statut) =>
    api.patch(`/api/Reservations/${id}/statut`, { statut }),
};

export default reservationsApi;
