import { api } from './client'

const cleSession = () => {
  const cle = 'resto-visit-session'
  let sessionId = sessionStorage.getItem(cle)

  if (!sessionId) {
    sessionId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
    sessionStorage.setItem(cle, sessionId)
  }

  return sessionId
}

const sourceVisite = () => {
  if (!document.referrer) return 'Direct'

  try {
    return new URL(document.referrer).hostname.slice(0, 100)
  } catch {
    return 'Autre'
  }
}

export const visitesApi = {
  enregistrer: () =>
    api.post('/api/Visites', {
      sessionId: cleSession(),
      source: sourceVisite(),
      page: window.location.pathname
    })
}