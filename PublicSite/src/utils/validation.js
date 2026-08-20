// ============================================
// Module de validation centralisé
// ============================================

// Vérifie si une valeur est vide
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.trim() !== ''
}

// Vérifie un email valide
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// Vérifie qu'un téléphone contient uniquement des chiffres
export const isValidPhone = (phone) => {
  return /^\d+$/.test(String(phone).trim())
}

// Vérifie un mot de passe fort (min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre)
export const isStrongPassword = (password) => {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

// Vérifie que le mot de passe a au moins 8 caractères
export const hasMinLength = (value, min = 8) => {
  return value.length >= min
}

// Vérifie qu'un nom/texte a une longueur minimale
export const hasMinChars = (value, min = 2) => {
  return value.trim().length >= min
}

// Vérifie une date de réservation (doit être aujourd'hui ou future)
export const isValidReservationDate = (date) => {
  if (!date) return false
  const selected = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected >= today
}

// Vérifie le nombre de personnes (entre 1 et 20)
export const isValidGuestCount = (count) => {
  return count >= 1 && count <= 20
}

// Vérifie qu'une checkbox est cochée (acceptation des conditions)
export const isChecked = (value) => {
  return value === true
}

// ============================================
// Validateurs de formulaires spécifiques
// ============================================

// Validation du formulaire de connexion
export function validateLogin(form) {
  const errors = {}

  if (!isRequired(form.email)) {
    errors.email = 'Veuillez saisir votre adresse e-mail.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Adresse e-mail invalide.'
  }

  if (!isRequired(form.motDePasse)) {
    errors.motDePasse = 'Veuillez saisir votre mot de passe.'
  }

  return errors
}

// Validation du formulaire d'inscription
export function validateInscription(form) {
  const errors = {}

  if (!isRequired(form.prenom)) {
    errors.prenom = 'Veuillez saisir votre prénom.'
  } else if (!hasMinChars(form.prenom, 2)) {
    errors.prenom = 'Le prénom doit contenir au moins 2 caractères.'
  }

  if (!isRequired(form.nom)) {
    errors.nom = 'Veuillez saisir votre nom.'
  } else if (!hasMinChars(form.nom, 2)) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères.'
  }

  if (!isRequired(form.telephone)) {
    errors.telephone = 'Veuillez saisir votre numéro de téléphone.'
  } else if (!isValidPhone(form.telephone)) {
    errors.telephone = 'Numéro de téléphone invalide.'
  }

  if (!isRequired(form.email)) {
    errors.email = 'Veuillez saisir votre adresse e-mail.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Adresse e-mail invalide.'
  }

  if (!isRequired(form.motDePasse)) {
    errors.motDePasse = 'Veuillez saisir un mot de passe.'
  } else if (!isStrongPassword(form.motDePasse)) {
    errors.motDePasse =
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.'
  }

  if (!isRequired(form.confirmation)) {
    errors.confirmation = 'Veuillez confirmer votre mot de passe.'
  } else if (form.motDePasse !== form.confirmation) {
    errors.confirmation = 'Les mots de passe ne correspondent pas.'
  }

  if (!isChecked(form.accepte)) {
    errors.accepte = 'Vous devez accepter la politique de confidentialité.'
  }

  return errors
}

// Validation de l'étape 1 de réservation (date, horaire, personnes)
export function validateReservationStep1(form) {
  const errors = {}

  if (!isRequired(form.date)) {
    errors.date = 'Veuillez sélectionner une date.'
  } else if (!isValidReservationDate(form.date)) {
    errors.date = 'La date doit être aujourd\'hui ou dans le futur.'
  }

  if (!isRequired(form.horaire)) {
    errors.horaire = 'Veuillez sélectionner un horaire.'
  }

  if (!isValidGuestCount(form.people)) {
    errors.people = 'Le nombre de personnes doit être entre 1 et 20.'
  }

  return errors
}

// Validation de l'étape 2 de réservation (coordonnées)
export function validateReservationStep2(form) {
  const errors = {}

  if (!isRequired(form.nom)) {
    errors.nom = 'Veuillez saisir votre nom complet.'
  } else if (!hasMinChars(form.nom, 2)) {
    errors.nom = 'Le nom doit contenir au moins 2 caractères.'
  }

  if (!isRequired(form.email)) {
    errors.email = 'Veuillez saisir votre adresse e-mail.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Adresse e-mail invalide.'
  }

  if (!isRequired(form.telephone)) {
    errors.telephone = 'Veuillez saisir votre numéro de téléphone.'
  } else if (!isValidPhone(form.telephone)) {
    errors.telephone = 'Numéro de téléphone invalide.'
  }

  return errors
}

// Validation du formulaire de contact
export function validateContact(form) {
  const errors = {}

  if (!isRequired(form.nom)) {
    errors.nom = 'Veuillez saisir votre nom.'
  }

  if (!isRequired(form.email)) {
    errors.email = 'Veuillez saisir votre adresse e-mail.'
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Adresse e-mail invalide.'
  }

  if (!isRequired(form.sujet)) {
    errors.sujet = 'Veuillez saisir un sujet.'
  }

  if (!isRequired(form.message)) {
    errors.message = 'Veuillez saisir votre message.'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères.'
  }

  return errors
}

// ============================================
// Helpers
// ============================================

// Vérifie si un objet d'erreurs est vide
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0
}

// Formate les messages d'erreur en objets pour affichage
export function getFieldError(errors, field) {
  return errors[field] || ''
}