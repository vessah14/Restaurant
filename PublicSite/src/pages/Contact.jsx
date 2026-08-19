import Navbarre2 from '../components/Navbarre2'
import Contact1 from '../components/Contact1'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'

export default function Contact () {
  return (
    <>
      <Seo
        title='Nous Contacter — Les Deux Colombes | Restaurant à Paris'
        description='Contactez Les Deux Colombes pour toute demande. Adresse, téléphone, email, horaires et formulaire de contact. À deux pas de Notre-Dame de Paris.'
        url='/Contact'
        keywords='contact restaurant, téléphone, email, adresse, horaires, Les Deux Colombes, Paris'
      />
      <div className='bg-[#f5f1ea]'>
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
      <div className='flex flex-col justify-center mt-10 items-center h-75'>
        <span
          style={{ color: '#C4A060' }}
          className='text-sm font-light tracking-[0.3em]'
        >
          {t.contact.titre}
        </span>
        <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium mb-5">
          {t.contact.titrePage}
        </h1>
        <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
          {t.contact.desc}
        </p>
      </div>
    </main>
  )
}

function Body () {
  return <Contact1 />
}
