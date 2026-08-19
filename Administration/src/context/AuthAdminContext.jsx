import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, utilisateursApi } from '../api'

const AuthAdminContext = createContext()

export const AuthAdminProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  const [estConnecte, setEstConnecte] = useState(false)
  const [erreur, setErreur] = useState(null)

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Vérifier que le token est valide (récupérer le profil)
      verifierToken(token)
    } else {
      setChargement(false)
    }

    const handleUnauthorized = () => {
      setUtilisateur(null)
      setEstConnecte(false)
      setChargement(false)
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [])

  const verifierToken = async token => {
    try {
      const profil = await utilisateursApi.getMoi()
      if (profil.role !== 'admin') {
        throw new Error('Accès réservé aux administrateurs')
      }
      setUtilisateur(profil)
      setEstConnecte(true)
      setChargement(false)
    } catch (error) {
      localStorage.removeItem('adminToken')
      setUtilisateur(null)
      setEstConnecte(false)
      setChargement(false)
    }
  }

  const connecter = async (email, motDePasse) => {
    try {
      setChargement(true)
      setErreur(null)

      const response = await authApi.login(email, motDePasse)

      if (response.token && response.utilisateur) {
        // Vérifier que l'utilisateur est admin
        if (response.utilisateur.role !== 'admin') {
          throw new Error(
            'Accès refusé : seuls les administrateurs peuvent accéder au tableau de bord'
          )
        }

        // Sauvegarder le token et les données utilisateur
        localStorage.setItem('adminToken', response.token)
        setUtilisateur(response.utilisateur)
        setEstConnecte(true)

        return true
      }

      throw new Error('Erreur lors de la connexion')
    } catch (error) {
      setErreur(error.message)
      setEstConnecte(false)
      return false
    } finally {
      setChargement(false)
    }
  }

  const deconnecter = () => {
    authApi.logout()
    setUtilisateur(null)
    setEstConnecte(false)
    localStorage.removeItem('adminToken')
  }

  return (
    <AuthAdminContext.Provider
      value={{
        utilisateur,
        chargement,
        estConnecte,
        erreur,
        connecter,
        deconnecter
      }}
    >
      {children}
    </AuthAdminContext.Provider>
  )
}

export const useAuthAdmin = () => {
  const context = useContext(AuthAdminContext)
  if (!context) {
    throw new Error('useAuthAdmin doit être utilisé dans AuthAdminProvider')
  }
  return context
}
