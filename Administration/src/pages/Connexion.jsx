import { useState } from 'react'
import { useAuthAdmin } from '../context/AuthAdminContext'

export default function Connexion () {
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState(null)

  // Formulaire Login
  const [loginNom, setLoginNom] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const { connecter } = useAuthAdmin()

  const handleLogin = async e => {
    e.preventDefault()
    setErreur(null)
    setChargement(true)

    try {
      const success = await connecter(loginNom, loginPassword)
      if (!success) {
        setErreur('Nom ou mot de passe incorrect.')
      }
    } catch (error) {
      setErreur(error.message)
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

        {/* Messages */}
        {erreur && (
          <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm'>
            {erreur}
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-[#2A2A22] mb-2'>
              Nom d'utilisateur
            </label>
            <input
              type='text'
              value={loginNom}
              onChange={e => setLoginNom(e.target.value)}
              placeholder='ADMIN'
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

        <p className='mt-6 text-center text-xs text-[#8A8471]'>
          Compte par défaut : ADMIN / Admin123
        </p>
      </div>
    </div>
  )
}
