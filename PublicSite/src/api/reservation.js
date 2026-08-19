import { api } from "./client";

export const reservationsApi = {
  creer: (donnees) => api.post("/api/Reservations", donnees),
  mesReservations: () => api.get("/api/Reservations/mes-reservations"),
};