import { useLanguage } from '../i18n/useLanguage'
import { useState } from 'react'
import reservationsApi from '../api/reservations'

export default function Forms3 ({ reservation, setReservation, setStep }) {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const steps = [
    { number: 1, label: t.reserver.dateHeure, status: 'done' },
    { number: 2, label: t.reserver.coordonnees, status: 'done' },
    { number: 3, label: t.reserver.confirmation, status: 'active' }
  ]

  const summary = [
    { label: t.reserver.date, value: reservation.dateReservation },
    { label: t.reserver.horaire, value: reservation.heureReservation },
    {
      label: t.reserver.personnes,
      value: `${reservation.nombrePersonnes} ${t.reserver.recapPersonnes}`
    },
    { label: t.inscription.nom, value: reservation.nom },
    { label: t.inscription.prenom, value: reservation.prenom },
    { label: t.inscription.email, value: reservation.email },
    { label: t.inscription.telephone, value: reservation.telephone },
    {
      label: t.reserver.recapDemande,
      value:
        reservation.message === '' ? t.reserver.aucune : reservation.message
    }
  ]

  const confirmerReservation = async () => {
    try {
      setLoading(true)
      setError(null)

      // Préparer les données pour l'API
      const donnees = {
        nom: reservation.nom,
        prenom: reservation.prenom,
        email: reservation.email,
        telephone: reservation.telephone,
        nombrePersonnes: reservation.nombrePersonnes,
        dateReservation: reservation.dateReservation, // Format: YYYY-MM-DD
        heureReservation: reservation.heureReservation, // Format: HH:mm
        message: reservation.message || null
      }

      // Appeler l'API
      const response = await reservationsApi.creer(donnees)

      setSuccess(true)
      console.log('Réservation créée:', response)

      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setReservation({
          dateReservation: '',
          heureReservation: '13:00',
          nombrePersonnes: 2,
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          message: ''
        })
        setStep(1)
      }, 2000)
    } catch (err) {
      setError(err.message || t.validation.erreurReservation)
      console.error('Erreur lors de la création de la réservation:', err)
    } finally {
      setLoading(false)
    }
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
              <div className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold bg-[#c9a55c] text-white'>
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
              <div className='flex-1 h-px mx-3 mb-5 bg-[#c9a55c]' />
            )}
          </div>
        ))}
      </div>

      <div className='bg-white rounded-3xl shadow-sm max-w-xl mx-auto p-8'>
        <h2 className="font-['Playfair_Display'] text-3xl text-gray-900 mb-8">
          {t.reserver.confirmation}
        </h2>

        {success ? (
          <div className='text-center py-8'>
            <div className='mb-6 text-5xl'>✓</div>
            <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
              {t.validation.reservationSuccess}
            </h3>
            <p className='text-gray-500 mb-6'>
              Nous avons bien reçu votre réservation. Un email de confirmation a
              été envoyé à {reservation.email}
            </p>
            <button
              onClick={() => setStep(1)}
              className='bg-[#c9a55c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#b8944d]'
            >
              Nouvelle réservation
            </button>
          </div>
        ) : (
          <>
            <div>
              {summary.map((item, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center gap-5 py-4 border-b border-[#c9a55c]/30'
                >
                  <span className='text-xs font-bold uppercase tracking-wide text-[#c9a55c]'>
                    {item.label}
                  </span>
                  <span className='text-gray-900 text-right'>{item.value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className='mt-6 p-4 bg-red-100 border border-red-300 rounded-lg'>
                <p className='text-red-700 font-medium'>{error}</p>
              </div>
            )}

            <div className='flex gap-4 mt-10'>
              <button
                onClick={() => setStep(2)}
                disabled={loading}
                className='flex-1 border border-gray-300 rounded-xl py-4 font-medium text-gray-700 duration-300 hover:bg-gray-50 disabled:opacity-50'
              >
                {t.reserver.modifier}
              </button>
              <button
                onClick={confirmerReservation}
                disabled={loading}
                className='flex-1 bg-gray-900 rounded-xl py-4 font-semibold text-white duration-300 hover:bg-black hover:shadow-xl disabled:opacity-50'
              >
                {loading ? 'Traitement...' : t.reserver.confirmer}
              </button>
            </div>
          </>
        )}
      </div>

      <div className='bg-[#e9e4da] rounded-2xl p-6 max-w-xl mx-auto mt-6'>
        <h3 className='font-bold text-gray-900 mb-2'>
          {t.reserver.infoPratiques}
        </h3>
        <p className='text-gray-500 leading-relaxed'>
          {t.reserver.infoPratiquesDesc}
        </p>
      </div>
    </div>
  )
}
