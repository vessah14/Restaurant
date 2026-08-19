import Footer from '../components/Footer'
import Navbarre2 from '../components/Navbarre2'
import FormResever from './FormResever'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'

export default function Reserver () {
  return (
    <>
      <Seo
        title='Réserver une Table — Les Deux Colombes | Restaurant à Paris'
        description='Réservez votre table en ligne aux Deux Colombes. Restaurant français à Paris, à deux pas de Notre-Dame. Disponibilités en temps réel et confirmation immédiate.'
        url='/Reserver'
        keywords='réserver table, réservation restaurant, Paris, Notre-Dame, Les Deux Colombes, booking'
      />
      <div className='bg-[#f5f1ea]'>
        <Navbarre2 />
        <HeaderTitle />
        <FormResever />
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
        className='min-h-20 bg-gray-800 overflow-hidden object-cover  text-white'
      >
        <div className='flex flex-col justify-center items-center  h-70'>
          <span
            style={{ color: '#C4A060' }}
            className='text-sm   font-light tracking-[0.3em  '
          >
            {t.reserver.titre}
          </span>
          <h1 className="font-['Playfair_Display'] text-6xl font-medium ">
            {t.reserver.titrePage}
          </h1>
          <p className='w-150 text-center text-gray-400'>{t.reserver.desc}</p>
        </div>
      </main>
    </>
  )
}
