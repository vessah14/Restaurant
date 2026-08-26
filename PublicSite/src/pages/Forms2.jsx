import { useLanguage } from '../i18n/useLanguage'
import { useEffect, useState } from 'react'
import ToastNotification from '../components/ToastNotification'

export default function Forms2 ({ reservation, setReservation, setStep }) {
  const { t } = useLanguage()
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    if (!modalMessage) return

    const timeoutId = setTimeout(() => setModalMessage(''), 2000)
    return () => clearTimeout(timeoutId)
  }, [modalMessage])

  const steps = [
    { number: 1, label: t.reserver.dateHeure, status: 'done' },
    { number: 2, label: t.reserver.coordonnees, status: 'active' },
    { number: 3, label: t.reserver.confirmation, status: 'upcoming' }
  ]

  const handleChange = field => e => {
    setReservation({ ...reservation, [field]: e.target.value })
  }

  const handleNext = () => {
    if (
      reservation.nom === '' ||
      reservation.prenom === '' ||
      reservation.email === '' ||
      reservation.telephone === ''
    ) {
      setModalMessage(t.validation.requireChamp)
      return
    }
    setStep(3)
  }

  return (
    <div className='min-h-screen p-8 md:p-16'>
      <div className='flex items-center justify-center max-w-md mx-auto mb-10'>
        {steps.map((step, index) => (
          <div
            key={step.number}
            className='flex items-center flex-1 last:flex-none'
          >
            <div className='flex flex-col items-center'>
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.status === 'upcoming'
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-[#c9a55c] text-white'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-xs whitespace-nowrap ${
                  step.status === 'active'
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 mb-5 ${
                  step.status === 'done' ? 'bg-[#c9a55c]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className='bg-white rounded-2xl shadow-sm max-w-xl mx-auto p-8'>
        <h2 className="font-['Playfair_Display'] text-2xl text-gray-900 mb-6">
          {t.reserver.coordonnees}
        </h2>

        <div className='space-y-5'>
          <div>
            <label className='block text-xs font-bold uppercase tracking-wide text-[#c9a55c] mb-2'>
              {t.inscription.nom}
            </label>
            <input
              type='text'
              placeholder='Dupont'
              value={reservation.nom}
              onChange={handleChange('nom')}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#c9a55c]'
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wide text-[#c9a55c] mb-2'>
              {t.inscription.prenom}
            </label>
            <input
              type='text'
              placeholder='Marie'
              value={reservation.prenom}
              onChange={handleChange('prenom')}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#c9a55c]'
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wide text-[#c9a55c] mb-2'>
              {t.reserver.adresseEmail}
            </label>
            <input
              type='email'
              placeholder='marie@exemple.fr'
              value={reservation.email}
              onChange={handleChange('email')}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#c9a55c]'
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wide text-[#c9a55c] mb-2'>
              {t.inscription.telephone} *
            </label>
            <input
              type='tel'
              placeholder='+33 6 00 00 00 00'
              value={reservation.telephone}
              onChange={handleChange('telephone')}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#c9a55c]'
            />
          </div>

          <div>
            <label className='block text-xs font-bold uppercase tracking-wide text-[#c9a55c] mb-2'>
              {t.reserver.demandeParticuliere}
            </label>
            <textarea
              rows={3}
              placeholder={t.reserver.demandePlaceholder}
              value={reservation.message}
              onChange={handleChange('message')}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#c9a55c] resize-none'
            />
          </div>
        </div>

        <div className='flex gap-3 mt-8'>
          <button
            onClick={() => setStep(1)}
            className='flex-1 border border-gray-300 rounded-lg py-3 font-medium text-gray-700 hover:bg-gray-50 transition'
          >
            {t.reserver.retour}
          </button>
          <button
            onClick={handleNext}
            className='flex-1 bg-[#c9a55c] rounded-lg py-3 font-semibold text-gray-900 hover:bg-[#b8944d] transition'
          >
            {t.reserver.verifier}
          </button>
        </div>
      </div>

      <div className='bg-[#e9e4da] rounded-2xl p-6 max-w-xl mx-auto mt-6'>
        <h3 className='font-bold text-gray-900 mb-2'>
          {t.reserver.infoPratiques}
        </h3>
        <p className='text-gray-500 leading-relaxed'>
          {t.reserver.infoPratiquesDesc}
        </p>
      </div>
      {modalMessage && (
        <ToastNotification
          message={modalMessage}
          onClose={() => setModalMessage('')}
        />
      )}
    </div>
  )
}
