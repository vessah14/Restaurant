import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import { ExternalLink, Navigation } from 'lucide-react'
import { useState } from 'react'
import { contactMessagesApi } from '../api/contactMessages'

export default function Contact1 () {
  const adresse = '2, rue de la Colombe, 75004 Paris'
  const { t } = useLanguage()
  const horairesLines = t.contact.horairesDetail.split('\n')
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await contactMessagesApi.envoyer(formData)
      setSuccess(true)
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      })
    } catch (err) {
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className='flex justify-center items-center'>
      <div className='flex justify-center items-center flex-col px-6 py-12 mx-auto'>
        <div className='grid grid-cols-1 gap-12 mt-10 lg:grid-cols-2'>
          <div>
            <div>
              <p className='font-light text-[#C4A060]'>
                {t.contact.informations}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl font-['Playfair_Display'] mb-5">
                {t.contact.lesDeuxColombes}
              </h1>
            </div>

            <div>
              <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
                <div>
                  <span className='inline-block p-3 text-pink-400 rounded-full bg-pink-100/80'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'
                      />
                    </svg>
                  </span>
                  <h2 className='mt-4 text-base font-medium text-[#C4A060]'>
                    {t.contact.email}
                  </h2>
                  <p className='mt-2 text-sm text-gray-400'>
                    contact@lesdeuxcolombes.fr
                  </p>
                </div>

                <div>
                  <span className='inline-block p-3 text-pink-400 rounded-full bg-pink-100/80'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                      />
                    </svg>
                  </span>
                  <h2 className='mt-4 text-base font-medium text-[#C4A060]'>
                    {t.contact.adresse}
                  </h2>
                  <p className='mt-2 text-sm text-gray-400'>
                    {t.contact.adresseDetail}
                  </p>
                </div>

                <div>
                  <span className='inline-block p-3 text-pink-400 rounded-full bg-pink-100/80'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
                      />
                    </svg>
                  </span>
                  <h2 className='mt-4 text-base font-medium text-[#C4A060]'>
                    {t.contact.horaires}
                  </h2>
                  <p className='mt-2 text-sm text-gray-400'>
                    {horairesLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < horairesLines.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>

                <div>
                  <span className='inline-block p-3 text-pink-400 rounded-full bg-pink-100/80'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'
                      />
                    </svg>
                  </span>
                  <h2 className='mt-4 text-base font-medium text-[#C4A060]'>
                    {t.contact.telephone}
                  </h2>
                  <p className='mt-2 text-sm text-gray-400'>
                    +33 (0)1 46 33 37 08
                  </p>
                </div>
              </div>

              <div className='flex flex-col justify-center items-center'>
                <div className='w-full max-w-md sm:max-w-none mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6'>
                  <a
                    href='tel:+33146333708'
                    className='w-full sm:w-auto px-8 py-3 font-semibold rounded-xl border hover:bg-gray-50/10 text-center transition'
                  >
                    {t.contact.nousAppeler}
                  </a>
                  <Link
                    to='/Reserver'
                    className='w-full sm:w-auto px-8 py-3 rounded-xl duration-300 hover:scale-105 hover:shadow-xl font-semibold text-center transition'
                    style={{ backgroundColor: '#C4A060' }}
                  >
                    {t.contact.reserverTable}
                  </Link>
                </div>
                {/*Maps*/};
                <div className='w-200'>
                  <div className='rounded-2xl w-full overflow-hidden shadow-lg h-[420px]'>
                    <iframe
                      title='Localisation du restaurant'
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      loading='lazy'
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        adresse
                      )}&output=embed`}
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      adresse
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 flex items-center justify-center gap-2 bg-[#C4A060] text-ivory px-6 py-3 rounded-full font-medium  text-white text-lg transition group'
                  >
                    <Navigation size={16} />
                    Get directions
                    <ExternalLink
                      size={14}
                      className='opacity-60 group-hover:opacity-100 transition'
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className='ml-10 '>
              <p className='font-light text-[#C4A060]'>
                {t.contact.formulaire}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl font-['Playfair_Display'] mb-5">
                {t.contact.formulaireTitle}
              </h1>
            </div>
            <div className='p-4 py-6 rounded-lg md:p-8'>
              {success && (
                <div className='mb-4 p-4 bg-green-100 text-green-700 rounded-lg'>
                  Message envoyé avec succès !
                </div>
              )}
              {error && (
                <div className='mb-4 p-4 bg-red-100 text-red-700 rounded-lg'>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className='-mx-2 md:items-center md:flex'>
                  <div className='flex-1 px-2'>
                    <label className='block mb-2 text-sm text-[#C4A060] font-bold'>
                      {t.contact.nom}
                    </label>
                    <input
                      type='text'
                      name='nom'
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder='John'
                      required
                      className='block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40'
                    />
                  </div>
                  <div className='flex-1 px-2 mt-4 md:mt-0'>
                    <label className='block mb-2 text-sm text-[#C4A060] font-bold'>
                      {t.contact.emailLabel}
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='john@example.com'
                      required
                      className='block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40'
                    />
                  </div>
                </div>
                <div className='mt-4'>
                  <label className='block mb-2 text-sm text-[#C4A060] font-bold'>
                    Téléphone (optionnel)
                  </label>
                  <input
                    type='tel'
                    name='telephone'
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder='+33 1 23 45 67 89'
                    className='block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40'
                  />
                </div>
                <div className='mt-4'>
                  <label className='block mb-2 text-sm text-[#C4A060] font-bold'>
                    {t.contact.sujet}
                  </label>
                  <input
                    type='text'
                    name='sujet'
                    value={formData.sujet}
                    onChange={handleChange}
                    placeholder='Votre sujet'
                    required
                    className='block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-opacity-40'
                  />
                </div>
                <div className='w-full mt-4'>
                  <label className='block mb-2 text-sm text-[#C4A060] font-bold'>
                    {t.contact.message}
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className='block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 focus:outline-none focus:ring focus:ring-opacity-40'
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>
                <button 
                  type='submit'
                  disabled={loading}
                  className='w-full px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Envoi en cours...' : t.contact.envoyer}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
