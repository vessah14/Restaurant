import { api } from "./client";

export const authApi = {
  login: (email, motDePasse) =>
    api.post("/api/Auth/login", { email, motDePasse }),

  inscription: (donnees) =>
    api.post("/api/Auth/inscription", donnees),

  motDePasseOublie: (email) =>
    api.post("/api/Auth/mot-de-passe-oublie", { email }),

  resetMotDePasse: (token, nouveauMotDePasse, confirmationMotDePasse) =>
    api.post("/api/Auth/reset-mot-de-passe", {
      token,
      nouveauMotDePasse,
      confirmationMotDePasse,
    }),
};
