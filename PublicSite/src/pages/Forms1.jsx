import { FaPlus, FaMinus } from 'react-icons/fa6'
import { useLanguage } from '../i18n/useLanguage'
import { useEffect, useState } from 'react'
import ToastNotification from '../components/ToastNotification'

export default function Forms1 ({ reservation, setReservation, setStep }) {
  const { t } = useLanguage()
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    if (!modalMessage) return

    const timeoutId = setTimeout(() => setModalMessage(''), 2000)
    return () => clearTimeout(timeoutId)
  }, [modalMessage])
  const horaires = [
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30'
  ]

  const increasePeople = () => {
    setReservation({
      ...reservation,
      nombrePersonnes: reservation.nombrePersonnes + 1
    })
  }

  const decreasePeople = () => {
    if (reservation.nombrePersonnes > 1) {
      setReservation({
        ...reservation,
        nombrePersonnes: reservation.nombrePersonnes - 1
      })
    }
  }

  const handleNext = () => {
    if (reservation.dateReservation === '') {
      setModalMessage(t.validation.dateRequis)
      return
    }

    setStep(2)
  }

  return (
    <section className='min-h-screen py-20 px-6'>
      <div className='max-w-6xl mx-auto flex flex-col items-center'>
        {/*===================================
                      STEPPER
        ===================================*/}

        <div className='flex justify-center items-center gap-1 mb-20 flex-wrap'>
          {/* Etape 1 */}

          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-[#C4A060] text-white font-bold flex justify-center items-center shadow-sm'>
              1
            </div>

            <span className='mt-3 font-medium text-sm'>
              {t.reserver.dateHeure}
            </span>
          </div>

          <div className='w-20 h-[1px] bg-gray-300'></div>

          {/* Etape 2 */}

          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-white text-gray-500 font-bold flex justify-center items-center shadow'>
              2
            </div>

            <span className='mt-3 text-sm text-gray-500'>
              {t.reserver.coordonnees}
            </span>
          </div>

          <div className='w-20 h-[1px] bg-gray-300'></div>

          {/* Etape 3 */}

          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-white text-gray-500 font-bold flex justify-center items-center shadow'>
              3
            </div>

            <span className='mt-3 text-sm text-gray-500'>
              {t.reserver.confirmation}
            </span>
          </div>
        </div>

        {/*===================================
                    CARD
        ===================================*/}

        <div
          className='
          w-full
          max-w-xl
          rounded-[35px]
          bg-white
          shadow-2xl
          p-12
          '
        >
          {/* Titre */}

          <h1
            className="
            text-2xl
            font-semibold
            font-['Playfair_Display']
            text-[#222]
            mb-12
            "
          >
            {t.reserver.choisirDate}
          </h1>

          {/*===================================
                        DATE
          ===================================*/}

          <div>
            <label className='uppercase font-bold text-sm text-[#C4A060]'>
              {t.reserver.date}
            </label>

            <div className='relative mt-4'>
              <input
                type='date'
                value={reservation.dateReservation}
                onChange={e =>
                  setReservation({
                    ...reservation,
                    dateReservation: e.target.value
                  })
                }
                className='
                w-full
                rounded-2xl
                text-sm
                border
                border-gray-300
                p-4
                duration-300
                focus:outline-none
                focus:border-[#C4A060]
                focus:ring-2
                focus:ring-[#C4A060]/20
                '
              />
            </div>
          </div>

          {/*===================================
                      HORAIRES
          ===================================*/}

          <div className='mt-10'>
            <h2 className='uppercase font-bold text-sm text-[#C4A060] mb-6'>
              {t.reserver.horaire}
            </h2>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {horaires.map(horaire => (
                <button
                  type='button'
                  key={horaire}
                  onClick={() =>
                    setReservation({
                      ...reservation,
                      heureReservation: horaire
                    })
                  }
                  className={`
                  text-sm
                  py-3
                  rounded-2xl
                  border
                  font-semibold
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg

                  ${
                    reservation.heureReservation === horaire
                      ? 'bg-[#C4A060] text-white shadow-lg'
                      : 'bg-white hover:bg-[#C4A060]/10'
                  }
                  `}
                >
                  {horaire}
                </button>
              ))}
            </div>
          </div>

          {/*===================================
                NOMBRE DE PERSONNES
          ===================================*/}

          <div className='mt-10'>
            <h2 className='uppercase font-bold text-sm text-[#C4A060] mb-6'>
              {t.reserver.personnes}
            </h2>

            <div className='flex items-center gap-5 flex-wrap'>
              {/* Bouton moins */}

              <button
                type='button'
                onClick={decreasePeople}
                className='
                w-10
                h-10
                rounded-xl
                border
                flex
                justify-center
                items-center
                duration-300
                hover:bg-gray-100
                '
              >
                <FaMinus size={10} />
              </button>

              {/* Nombre */}

              <span
                className='
                text-3xl
                font-semibold
                w-10
                text-center
                '
              >
                {reservation.nombrePersonnes}
              </span>

              {/* Bouton plus */}

              <button
                type='button'
                onClick={increasePeople}
                className='
                w-10
                h-10
                rounded-xl
                border
                flex
                justify-center
                items-center
                duration-300
                hover:bg-gray-100
                '
              >
                <FaPlus size={10} />
              </button>

              <span className='text-gray-500 text-lg font-semibold'>
                {t.reserver.personnesLabel}
              </span>
            </div>
          </div>

          {/*===================================
                      BOUTON
          ===================================*/}

          <button
            onClick={handleNext}
            className='
            w-full
            mt-10
            py-4
            rounded-2xl
            bg-[#C4A060]
            text-black
            font-bold
            text-lg
            duration-500
            hover:bg-[#b58f4c]
            hover:-translate-y-1
            hover:shadow-2xl
            '
          >
            {t.reserver.continuer}
          </button>
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
      {modalMessage && (
        <ToastNotification
          message={modalMessage}
          onClose={() => setModalMessage('')}
        />
      )}
    </section>
  )
}
