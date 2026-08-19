import { api } from "./client";

export const contactApi = {
  // Public
  getInfos: (langue = "fr") => api.get(`/api/ContactInfos?langue=${langue}`),

  // Admin
  modifierInfos: (donnees) => api.put("/api/ContactInfos", donnees),
};
