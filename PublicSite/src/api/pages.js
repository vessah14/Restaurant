import { api } from "./client";

export const pagesApi = {
  // Public — utilisé par le frontend pour afficher le contenu de chaque page
  getAll: (langue = "fr") => api.get(`/api/Pages?langue=${langue}`),

  getBySlug: (slug, langue = "fr") =>
    api.get(`/api/Pages/${slug}?langue=${langue}`),

  // Admin — édite FR + EN d'un coup
  modifier: (slug, donnees) => api.put(`/api/Pages/${slug}`, donnees),
};
