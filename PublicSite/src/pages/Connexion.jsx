import Footer from '../components/Footer'
import Navbarre2 from '../components/Navbarre2'
import { useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'
import { validateLogin, hasErrors } from '../utils/validation'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Connexion () {
  return (
    <>
      <div className='bg-[#f5f1ea]'>
        <Navbarre2 />
        <HeaderTitle />
        <Forms />
        <Footer />
      </div>
    </>
  )
}

function HeaderTitle () {
  const { t } = useLanguage()
  return (
    <>
      <main
        id='hero'
        className='min-h-20 bg-gray-800 overflow-hidden object-cover text-white'
      >
        <div className='flex flex-col justify-center items-center mt-10 h-70'>
          <span
            style={{ color: '#C4A060' }}
            className='text-sm font-light tracking-[0.3em]'
          >
            {t.connexion.titre}
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium">
            {t.connexion.titrePage}
          </h1>
          <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
            {t.connexion.desc}
          </p>
        </div>
      </main>
    </>
  )
}

function Forms () {
  const { t } = useLanguage()
  const [form, setForm] = useState({ email: '', motDePasse: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const [chargement, setChargement] = useState(false)
  const messageSucces = location.state?.message
  const { connecter } = useAuth()

  const handleChange = field => e => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validateLogin(form)
    setErrors(errs)
    if (hasErrors(errs)) return

    setChargement(true)

    try {
      const utilisateur = await connecter(form.email, form.motDePasse)

      // Redirection selon le rôle — l'admin va vers son dashboard,
      // le client accède à son espace client
      navigate(utilisateur.role === 'admin' ? '/admin' : '/Compte')
    } catch (err) {
      // Le backend renvoie volontairement un message générique
      // ("Email ou mot de passe incorrect.") sans préciser lequel est faux
      setErrors({ motDePasse: err.message })
    } finally {
      setChargement(false)
    }
  }

  const inputClass = field => `
    border px-4 p-2 rounded-xl text-gray-500 focus:outline-none
    ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `

  return (
    <>
      <div className='flex justify-center items-center mt-20 mb-30'>
        <div className='bg-white shadow-2xl p-5 w-100 py-10 rounded-2xl'>
          {messageSucces && (
            <p className='bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm mb-4'>
              {messageSucces}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col space-y-2 border-b py-5 mb-2 border-b-gray-400'
          >
            <div className='flex flex-col justify-center'>
              <label
                htmlFor='Email'
                className='text-sm font-bold mb-3 text-[#C4A060]'
              >
                {t.connexion.email}
              </label>
              <input
                type='email'
                value={form.email}
                onChange={handleChange('email')}
                placeholder='Exemple@gmail.com'
                className={inputClass('email')}
              />
              {errors.email && (
                <span className='mt-1 text-xs text-red-600'>
                  {errors.email}
                </span>
              )}
            </div>
            <div className='flex flex-col justify-center'>
              <label
                htmlFor='motDePasse'
                className='text-sm font-bold mb-3 text-[#C4A060]'
              >
                {t.connexion.motDePasse}
              </label>
              <input
                type='password'
                value={form.motDePasse}
                onChange={handleChange('motDePasse')}
                className={inputClass('motDePasse')}
                placeholder='*******'
              />
              {errors.motDePasse && (
                <span className='mt-1 text-xs text-red-600'>
                  {errors.motDePasse}
                </span>
              )}
            </div>
            <div>
              <a
                href=''
                onClick={e => e.preventDefault()}
                className='text-sm flex justify-end underline text-gray-500'
              >
                {t.connexion.motDePasseOublie}
              </a>
            </div>
            <button
              type='submit'
              disabled={chargement}
              className='text-white bg-gray-700 py-2 font-bold rounded-xl'
            >
              {chargement ? '...' : t.connexion.seConnecter}
            </button>
          </form>
          <span className='text-sm text-gray-400 font-semibold flex justify-center'>
            {t.connexion.pasDeCompte}{' '}
            <Link to='/Inscription' className='text-[#C4A060]'>
              {t.connexion.creerCompte}
            </Link>
          </span>
        </div>
      </div>
    </>
  )
}
