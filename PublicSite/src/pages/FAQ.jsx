import Navbarre2 from '../components/Navbarre2'
import FAQ1 from '../components/FAQ1'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/useLanguage'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function FAQ () {
  return (
    <>
      <Seo
        title='Questions Fréquentes — Resto | Réponses et Informations'
        description='Consultez nos questions fréquentes : horaires, tarifs, réservations, accès pour handicapés, allergies alimentaires, événements privés. Toutes les informations sur Resto.'
        url='/FAQ'
        keywords='FAQ, questions fréquentes, horaires, réservation, tarifs, allergie, restaurant Paris'
      />
      <div className='bg-[#F5F1EA]'>
        <Navbarre2 />
        <HeaderTitle />
        <Body />
        <Footer />
      </div>
    </>
  )
}

function HeaderTitle () {
  const { t } = useLanguage()
  return (
    <main
      id='hero'
      className='min-h-20 bg-gray-800 overflow-hidden object-cover text-white'
    >
      <div className='flex flex-col justify-center items-center mt-10 h-75'>
        <span
          style={{ color: '#C4A060' }}
          className='text-sm font-light tracking-[0.3em]'
        >
          {t.faqPage.titre}
        </span>
        <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium mb-5">
          {t.faqPage.titrePage}
        </h1>
        <p className='w-full max-w-2xl px-4 text-center text-sm text-gray-400 md:text-xl'>
          {t.faqPage.desc}
        </p>
      </div>
    </main>
  )
}

function Body () {
  const { t } = useLanguage()
  return (
    <>
      <FAQ1 />
      <div className='flex justify-cente items-center flex-col mt-10 p-2'>
        <div className='flex justify-cente items-center flex-col text-center p-5 bg-[#C4A060]/10 rounded-2xl w-full lg:w-200'>
          <h1 className="font-['Playfair_Display'] text-4xl font-medium mb-5">
            {t.faqPage.pasTrouve}
          </h1>
          <p className='text-gray-500'>{t.faqPage.pasTrouveDesc}</p>
          <div className='mt-5 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-10'>
            <Link
              to='/Contact'
              className='p-2 px-8 py-3 font-semibold rounded-xl border hover:bg-gray-50/10'
            >
              {t.faqPage.nousContacter}
            </Link>
            <Link
              to='/Reserver'
              className='p-2 px-8 py-3 rounded-xl duration-300 hover:scale-102 hover:shadow-xl font-semibold'
              style={{ backgroundColor: '#C4A060' }}
            >
              {t.faqPage.reserverTable}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
