import { api } from "./client";

export const contactMessagesApi = {
  // Public - Envoyer un message de contact
  envoyer: (donnees) => api.post("/api/ContactMessages", donnees),
};
