import Footer from '../components/Footer'
import Navbarre2 from '../components/Navbarre2'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage'
import { validateInscription, hasErrors } from '../utils/validation'
import { useAuth } from '../context/AuthContext'

export default function Inscription () {
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
            {t.inscription.titre}
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium">
            {t.inscription.titrePage}
          </h1>
          <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
            {t.inscription.desc}
          </p>
        </div>
      </main>
    </>
  )
}

function Forms () {
  const { t } = useLanguage()
  const { inscrire } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    motDePasse: '',
    confirmation: '',
    accepte: false
  })
  const [errors, setErrors] = useState({})
  const [chargement, setChargement] = useState(false)
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false)
  const [afficherConfirmation, setAfficherConfirmation] = useState(false)

  const handleChange = field => e => {
    const value = field === 'accepte' ? e.target.checked : e.target.value
    setForm({ ...form, [field]: value })
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
    const errs = validateInscription(form)
    setErrors(errs)
    if (hasErrors(errs)) return

    setChargement(true)

    try {
      await inscrire({
        prenom: form.prenom,
        nom: form.nom,
        telephone: form.telephone || null,
        email: form.email,
        motDePasse: form.motDePasse
      })

      navigate('/Connexion', {
        state: {
          message: t.validation.inscriptionSuccess || 'Inscription réussie !'
        }
      })
    } catch (err) {
      // L'erreur du backend (ex: "Cet email est déjà utilisé.") s'affiche
      // sous le champ email plutôt qu'en alert — plus cohérent avec le reste du formulaire
      setErrors({ email: err.message })
    } finally {
      setChargement(false)
    }
  }

  const inputClass = field => `
    border rounded-xl p-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C4A060]
    ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}
  `

  const errorMsg = field =>
    errors[field] ? (
      <span className='mt-1 text-xs text-red-600'>{errors[field]}</span>
    ) : null

  return (
    <>
      <div className='flex justify-center items-center py-24 px-6'>
        <div className='bg-white shadow-2xl rounded-3xl p-10 w-full max-w-xl'>
          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate className='space-y-6'>
            {/* Nom et prénom */}
            <div className='grid md:grid-cols-2 gap-5'>
              <div className='flex flex-col'>
                <label className='font-semibold text-[#C4A060] mb-2'>
                  {t.inscription.prenom}
                </label>
                <input
                  type='text'
                  placeholder='Jean'
                  value={form.prenom}
                  onChange={handleChange('prenom')}
                  className={inputClass('prenom')}
                />
                {errorMsg('prenom')}
              </div>

              <div className='flex flex-col'>
                <label className='font-semibold text-[#C4A060] mb-2'>
                  {t.inscription.nom}
                </label>
                <input
                  type='text'
                  placeholder='Dupont'
                  value={form.nom}
                  onChange={handleChange('nom')}
                  className={inputClass('nom')}
                />
                {errorMsg('nom')}
              </div>
            </div>

            {/* Téléphone */}
            <div className='flex flex-col'>
              <label className='font-semibold text-[#C4A060] mb-2'>
                {t.inscription.telephone}
              </label>
              <input
                type='tel'
                placeholder='+33 6 00 00 00 00'
                value={form.telephone}
                onChange={handleChange('telephone')}
                className={inputClass('telephone')}
              />
              {errorMsg('telephone')}
            </div>

            {/* Email */}
            <div className='flex flex-col'>
              <label className='font-semibold text-[#C4A060] mb-2'>
                {t.inscription.email}
              </label>
              <input
                type='email'
                placeholder='jean@gmail.com'
                value={form.email}
                onChange={handleChange('email')}
                className={inputClass('email')}
              />
              {errorMsg('email')}
            </div>

            {/* Mot de passe */}
            <div className='flex flex-col'>
              <label className='font-semibold text-[#C4A060] mb-2'>
                {t.inscription.motDePasse}
              </label>
              <div className='relative'>
                <input
                  type={afficherMotDePasse ? 'text' : 'password'}
                  placeholder='********'
                  value={form.motDePasse}
                  onChange={handleChange('motDePasse')}
                  className={`${inputClass('motDePasse')} w-full pr-11`}
                />
                <button
                  type='button'
                  onClick={() => setAfficherMotDePasse(prev => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C4A060]'
                  aria-label={
                    afficherMotDePasse
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                >
                  {afficherMotDePasse ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errorMsg('motDePasse')}
            </div>

            {/* Confirmation */}
            <div className='flex flex-col'>
              <label className='font-semibold text-[#C4A060] mb-2'>
                {t.inscription.confirmation}
              </label>
              <div className='relative'>
                <input
                  type={afficherConfirmation ? 'text' : 'password'}
                  placeholder='********'
                  value={form.confirmation}
                  onChange={handleChange('confirmation')}
                  className={`${inputClass('confirmation')} w-full pr-11`}
                />
                <button
                  type='button'
                  onClick={() => setAfficherConfirmation(prev => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#C4A060]'
                  aria-label={
                    afficherConfirmation
                      ? 'Masquer la confirmation'
                      : 'Afficher la confirmation'
                  }
                >
                  {afficherConfirmation ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errorMsg('confirmation')}
            </div>

            {/* Checkbox */}
            <div className='flex items-start gap-3'>
              <input
                type='checkbox'
                checked={form.accepte}
                onChange={handleChange('accepte')}
                className='mt-1'
              />
              <p className='text-sm text-gray-500 leading-6 font-semibold'>
                {t.inscription.politique}{' '}
                <Link to='/Conditions' className='text-[#C4A060]'>
                  {t.inscription.politiqueLien}
                </Link>{' '}
                et {t.inscription.conditions}
              </p>
            </div>
            {errors.accepte && (
              <span className='text-xs text-red-600'>{errors.accepte}</span>
            )}

            {/* Bouton */}
            <button
              type='submit'
              disabled={chargement}
              className='w-full py-4 rounded-2xl font-semibold text-white bg-[#C4A060] duration-300 hover:scale-[1.01] hover:shadow-xl'
            >
              {chargement ? '...' : t.inscription.creer}
            </button>
          </form>

          {/* Connexion */}
          <div className='mt-8 text-center'>
            <span className='text-gray-500 font-semibold'>
              {t.inscription.dejaCompte}
            </span>
            <Link
              to='/Connexion'
              className='ml-2 font-semibold text-[#C4A060] hover:underline'
            >
              {t.inscription.seConnecter}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
