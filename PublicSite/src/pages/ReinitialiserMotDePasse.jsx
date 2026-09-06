import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbarre2 from '../components/Navbarre2'
import Footer from '../components/Footer'
import { authApi } from '../api/auth'
import AppModal from '../components/AppModal'

export default function ReinitialiserMotDePasse () {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [form, setForm] = useState({
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')

    if (!token) {
      setError('Le lien de réinitialisation est invalide.')
      return
    }
    if (form.nouveauMotDePasse !== form.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}/.test(form.nouveauMotDePasse)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.'
      )
      return
    }

    setLoading(true)
    try {
      await authApi.resetMotDePasse(
        token,
        form.nouveauMotDePasse,
        form.confirmationMotDePasse
      )
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.message || 'Le lien est invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-[#f5f1ea]'>
      <Navbarre2 />
      <main className='flex min-h-[70vh] items-center justify-center px-6 py-16'>
        <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'>
          <h1 className="font-['Playfair_Display'] text-3xl text-gray-900">
            Nouveau mot de passe
          </h1>
          <p className='mt-2 text-sm text-gray-500'>
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <input
              type='password'
              required
              value={form.nouveauMotDePasse}
              onChange={event =>
                setForm({ ...form, nouveauMotDePasse: event.target.value })
              }
              placeholder='Nouveau mot de passe'
              className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#c9a55c] focus:outline-none'
            />
            <input
              type='password'
              required
              value={form.confirmationMotDePasse}
              onChange={event =>
                setForm({ ...form, confirmationMotDePasse: event.target.value })
              }
              placeholder='Confirmer le mot de passe'
              className='w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#c9a55c] focus:outline-none'
            />
            {error && <p className='text-sm text-red-600'>{error}</p>}
            <button
              type='submit'
              disabled={loading || success}
              className='w-full rounded-xl bg-gray-800 py-3 font-semibold text-white hover:bg-black disabled:opacity-50'
            >
              {loading ? 'Enregistrement...' : 'Réinitialiser le mot de passe'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      {success && (
        <AppModal
          title='Mot de passe modifié'
          message='Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.'
          confirmLabel='Se connecter'
          onClose={() => {
            window.location.href = `${import.meta.env.BASE_URL}Connexion`
          }}
        />
      )}
    </div>
  )
}
