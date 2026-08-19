import { useState } from 'react'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { api } from '../api/client'

export default function Connexion () {
  const [mode, setMode] = useState('login') // 'login' ou 'signup'
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [message, setMessage] = useState(null)

  // Formulaire Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Formulaire Signup
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [signupPrenom, setSignupPrenom] = useState('')
  const [signupNom, setSignupNom] = useState('')
  const [signupTelephone, setSignupTelephone] = useState('')

  const { connecter } = useAuthAdmin()

  const handleLogin = async e => {
    e.preventDefault()
    setErreur(null)
    setChargement(true)

    try {
      const success = await connecter(loginEmail, loginPassword)
      if (!success) {
        setErreur('Email ou mot de passe incorrect.')
      }
      // Si succès, App.jsx affiche automatiquement <Container /> via estConnecte
    } catch (error) {
      setErreur(error.message)
    } finally {
      setChargement(false)
    }
  }

  const handleSignup = async e => {
    e.preventDefault()
    setErreur(null)
    setMessage(null)
    setChargement(true)

    try {
      // Vérifier les mots de passe
      if (signupPassword !== signupConfirm) {
        setErreur('Les mots de passe ne correspondent pas.')
        setChargement(false)
        return
      }

      // Appel API pour créer l'admin
      const response = await api.post('/api/Auth/creer-admin', {
        email: signupEmail,
        motDePasse: signupPassword,
        prenom: signupPrenom,
        nom: signupNom,
        telephone: signupTelephone || null
      })

      if (response.token) {
        // Sauvegarder le token
        localStorage.setItem('adminToken', response.token)

        setMessage('Compte admin créé avec succès!')
        // App.jsx affiche automatiquement <Container /> via estConnecte
      }
    } catch (error) {
      setErreur(
        error?.message ||
          'Erreur lors de la création du compte. Veuillez réessayer.'
      )
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>
        {/* Logo/Titre */}
        <div className='text-center mb-8'>
          <h1 className='font-serif text-3xl font-bold text-[#0B1F3A] mb-2'>
            Les Deux Colombes
          </h1>
          <p className='text-[#8A8471]'>Administration</p>
        </div>

        {/* Onglets */}
        <div className='flex gap-4 mb-8'>
          <button
            type='button'
            onClick={() => {
              setMode('login')
              setErreur(null)
              setMessage(null)
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              mode === 'login'
                ? 'bg-[#D9A15C] text-white'
                : 'bg-[#F0EBDD] text-[#8A8471]'
            }`}
          >
            Connexion
          </button>
          <button
            type='button'
            onClick={() => {
              setMode('signup')
              setErreur(null)
              setMessage(null)
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              mode === 'signup'
                ? 'bg-[#D9A15C] text-white'
                : 'bg-[#F0EBDD] text-[#8A8471]'
            }`}
          >
            Créer Admin
          </button>
        </div>

        {/* Messages */}
        {erreur && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
            {erreur}
          </div>
        )}

        {message && (
          <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm'>
            {message}
          </div>
        )}

        {/* Mode Connexion */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Email
              </label>
              <input
                type='email'
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder='admin@lesdeuxcolombes.fr'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Mot de passe
              </label>
              <input
                type='password'
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                required
              />
            </div>

            <button
              type='submit'
              disabled={chargement}
              className='w-full bg-[#D9A15C] hover:bg-[#C17A3E] text-white font-bold py-2 rounded-lg transition disabled:opacity-50'
            >
              {chargement ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* Mode Inscription */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                  Prénom
                </label>
                <input
                  type='text'
                  value={signupPrenom}
                  onChange={e => setSignupPrenom(e.target.value)}
                  placeholder='Jean'
                  className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                  Nom
                </label>
                <input
                  type='text'
                  value={signupNom}
                  onChange={e => setSignupNom(e.target.value)}
                  placeholder='Dupont'
                  className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Email
              </label>
              <input
                type='email'
                value={signupEmail}
                onChange={e => setSignupEmail(e.target.value)}
                placeholder='admin@lesdeuxcolombes.fr'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Téléphone (optionnel)
              </label>
              <input
                type='tel'
                value={signupTelephone}
                onChange={e => setSignupTelephone(e.target.value)}
                placeholder='+33 6 00 00 00 00'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Mot de passe
              </label>
              <input
                type='password'
                value={signupPassword}
                onChange={e => setSignupPassword(e.target.value)}
                placeholder='Min. 8 caractères, 1 majuscule, 1 chiffre'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
                Confirmer le mot de passe
              </label>
              <input
                type='password'
                value={signupConfirm}
                onChange={e => setSignupConfirm(e.target.value)}
                placeholder='••••••••'
                className='w-full px-4 py-2 border border-[#EAE4D6] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                required
              />
            </div>

            <p className='text-xs text-[#8A8471]'>
              Mot de passe: minimum 8 caractères, une majuscule et un chiffre.
            </p>

            <button
              type='submit'
              disabled={chargement}
              className='w-full bg-[#D9A15C] hover:bg-[#C17A3E] text-white font-bold py-2 rounded-lg transition disabled:opacity-50'
            >
              {chargement ? 'Création en cours...' : 'Créer le compte admin'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
