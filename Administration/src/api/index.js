import { api } from "./client";

export const utilisateursApi = {
  getAll: (inclureInactifs = false) =>
    api.get(
      `/api/Utilisateurs?inclureInactifs=${inclureInactifs}`
    ),

  getMoi: () =>
    api.get('/api/Utilisateurs/moi'),

  modifierMoi: (donnees) =>
    api.put('/api/Utilisateurs/moi', donnees),

  getById: id =>
    api.get(`/api/Utilisateurs/${id}`),

  modifier: (id, donnees) =>
    api.put(`/api/Utilisateurs/${id}`, donnees),

  desactiver: id =>
    api.patch(`/api/Utilisateurs/${id}/desactiver`),

  reactiver: id =>
    api.patch(`/api/Utilisateurs/${id}/reactiver`)
}

export const authApi = {
  login: (nom, motDePasse) =>
    api.post('/api/Auth/login', {
      nom,
      motDePasse
    }),

  logout: () => {
    api.setToken(null)
  }
}

export const reservationsApi = {
  // Récupérer toutes les réservations
  getAll: (statut = null) =>
    api.get(`/api/Reservations${statut ? `?statut=${encodeURIComponent(statut)}` : ''}`),

  // Récupérer une réservation par ID
  getById: (id) => api.get(`/api/Reservations/${id}`),

  // Mettre à jour le statut d'une réservation
  modifierStatut: (id, statut) => api.patch(`/api/Reservations/${id}/statut`, { statut }),

  // Annuler une réservation
  annuler: (id) => api.patch(`/api/Reservations/${id}/statut`, { statut: "annulee" }),
};

export const avisApi = {
  // Récupérer tous les avis (admin)
  getAll: (statut = null) =>
    api.get(`/api/Avis/tous${statut ? `?statut=${encodeURIComponent(statut)}` : ''}`),

  // Récupérer les avis en attente de modération
  getEnAttente: () => api.get("/api/Avis/tous?statut=en_attente"),

  // Approuver un avis
  approuver: (id) => api.patch(`/api/Avis/${id}/statut`, { statut: "publie" }),

  // Rejeter un avis
  rejeter: (id) => api.patch(`/api/Avis/${id}/statut`, { statut: "refuse" }),

  // Supprimer un avis
  supprimer: (id) => api.delete(`/api/Avis/${id}`),
};

export const statistiquesApi = {
  // Récupérer les statistiques du tableau de bord
  getDashboard: () => api.get("/api/Statistiques"),

  // Récupérer les statistiques menssuelles
  getMensuel: (mois, annee) =>
    api.get(`/api/Statistiques/mensuel?mois=${mois}&annee=${annee}`),

  // Récupérer les statistiques par plat
  getParPlat: () => api.get("/api/Statistiques/par-plat"),

  // Récupérer les statistiques par jour de la semaine
  getParJourSemaine: () => api.get("/api/Statistiques/par-jour-semaine"),
};

export const platsApi = {
  getCarte: () => api.get('/api/Plats/carte'),
  // Récupérer tous les plats
  getAll: () => api.get("/api/Plats"),

  // Récupérer un plat par ID
  getById: (id) => api.get(`/api/Plats/${id}`),

  // Créer un plat (avec FormData pour l'image)
  creer: (donnees) => {
    if (donnees instanceof FormData) {
      return api.postFormData("/api/Plats", donnees)
    }
    return api.post("/api/Plats", donnees)
  },

  // Modifier un plat (avec FormData pour l'image)
  modifier: (id, donnees) => {
    if (donnees instanceof FormData) {
      return api.putFormData(`/api/Plats/${id}`, donnees)
    }
    return api.put(`/api/Plats/${id}`, donnees)
  },

  // Supprimer un plat
  supprimer: (id) => api.delete(`/api/Plats/${id}`),
};

export const faqApi = {
  // Récupérer toutes les FAQ
  getAll: () => api.get("/api/Faq"),

  // Créer une FAQ
  creer: (donnees) => api.post("/api/Faq", donnees),

  // Modifier une FAQ
  modifier: (id, donnees) => api.put(`/api/Faq/${id}`, donnees),

  // Supprimer une FAQ
  supprimer: (id) => api.delete(`/api/Faq/${id}`),
};

export const contactInfosApi = {
  get: () => api.get('/api/ContactInfos?langue=fr'),

  modifier: (donnees) => api.put('/api/ContactInfos', donnees)
};

export const galerieApi = {
  // Récupérer toutes les images
  getAll: () => api.get("/api/Galerie"),

  // Créer une image (avec FormData pour l'image)
  creer: (donnees) => {
    if (donnees instanceof FormData) {
      return api.postFormData("/api/Galerie", donnees)
    }
    return api.post("/api/Galerie", donnees)
  },

  // Supprimer une image
  supprimer: (id) => api.delete(`/api/Galerie/${id}`),
};

export const uploadsApi = {
  // Uploader une image vers wwwroot/upload
  uploaderImage: (fichier) => {
    const formData = new FormData()
    formData.append('fichier', fichier)
    return api.upload('/api/Uploads', formData)
  }
};

export const pagesApi = {
  // Récupérer une page par slug
  getBySlug: (slug, langue = 'fr') => api.get(`/api/Pages/${slug}?langue=${langue}`),

  // Récupérer toutes les pages
  getAll: (langue = 'fr') => api.get(`/api/Pages?langue=${langue}`),

  // Modifier une page
  modifier: (id, donnees) => api.put(`/api/Pages/${id}`, donnees),
};

export const contactMessagesApi = {
  // Récupérer tous les messages
  getAll: (statut = null) => api.get(`/api/ContactMessages${statut ? `?statut=${statut}` : ""}`),

  // Récupérer un message par ID
  getById: (id) => api.get(`/api/ContactMessages/${id}`),

  // Marquer comme lu
  marquerLu: (id) => api.patch(`/api/ContactMessages/${id}/marquer-lu`),

  // Répondre à un message
  repondre: (id, reponse) => api.patch(`/api/ContactMessages/${id}/repondre`, { reponse }),

  // Supprimer un message
  supprimer: (id) => api.delete(`/api/ContactMessages/${id}`),
};

export const notificationsApi = {
  // Récupérer toutes les notifications
  getAll: (estLu = null, type = null) => {
    const params = new URLSearchParams();
    if (estLu !== null) params.append('estLu', estLu);
    if (type !== null) params.append('type', type);
    const queryString = params.toString();
    return api.get(`/api/Notifications${queryString ? `?${queryString}` : ""}`);
  },

  // Récupérer le nombre de notifications non lues
  getNombreNonLus: () => api.get('/api/Notifications/non-lus'),

  // Récupérer une notification par ID
  getById: (id) => api.get(`/api/Notifications/${id}`),

  // Marquer comme lu
  marquerLu: (id) => api.patch(`/api/Notifications/${id}/marquer-lu`),

  // Marquer tous comme lus
  marquerTousLus: () => api.post('/api/Notifications/marquer-tous-lus'),

  // Supprimer une notification
  supprimer: (id) => api.delete(`/api/Notifications/${id}`),
};
