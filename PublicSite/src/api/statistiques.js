import { api } from "./client";

export const statistiquesApi = {
  // Admin uniquement
  getStatistiquesGenerales: () => api.get("/api/Statistiques"),
};
