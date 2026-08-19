import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth'
import { utilisateursApi } from '../api/utilisateurs'

const AuthContext = createContext(null)

function lireUtilisateurStocke () {
  try {
    const stored = localStorage.getItem('utilisateur')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider ({ children }) {
  const [utilisateur, setUtilisateur] = useState(lireUtilisateurStocke)
  const [chargement, setChargement] = useState(true)

  // Au premier chargement de l'app, on vérifie si un token existe déjà
  // et on revalide le profil auprès du backend (le localStorage seul
  // pourrait être obsolète si le compte a été désactivé entre-temps)
  useEffect(() => {
    async function verifierSession () {
      const token = localStorage.getItem('token')

      if (!token) {
        setChargement(false)
        return
      }

      try {
        const profil = await utilisateursApi.monProfil()
        setUtilisateur(profil)
      } catch {
        // Token invalide ou expiré → on nettoie tout
        localStorage.removeItem('token')
        localStorage.removeItem('utilisateur')
        setUtilisateur(null)
      } finally {
        setChargement(false)
      }
    }

    verifierSession()
  }, [])

  async function connecter (email, motDePasse) {
    const resultat = await authApi.login(email, motDePasse)

    localStorage.setItem('token', resultat.token)
    localStorage.setItem('utilisateur', JSON.stringify(resultat.utilisateur))
    setUtilisateur(resultat.utilisateur)

    return resultat.utilisateur
  }

  async function inscrire (donnees) {
    const nouvelUtilisateur = await authApi.inscription(donnees)
    // L'inscription ne connecte pas automatiquement — on redirige
    // généralement vers la page de connexion après un succès
    return nouvelUtilisateur
  }

  function deconnecter () {
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')
    setUtilisateur(null)
  }

  const estConnecte = utilisateur !== null
  const estAdmin = utilisateur?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        utilisateur,
        chargement,
        estConnecte,
        estAdmin,
        connecter,
        inscrire,
        deconnecter
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
