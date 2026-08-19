import Navbarre2 from '../components/Navbarre2'
import Footer from '../components/Footer'
import fond8 from '../assets/fond8.jpg'
import fond9 from '../assets/fond9.jpg'
import fond7 from '../assets/fond7.jpg'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'

export default function Histoire () {
  return (
    <>
      <Seo
        title='Notre Histoire — Les Deux Colombes | Restaurant Parisien'
        description="Découvrez l'histoire des Deux Colombes, restaurant français emblématique de Paris. Une passion pour la gastronomie française et les traditions culinaires."
        url='/About'
        keywords='histoire restaurant, tradition française, Paris, gastronomie, restaurant familial'
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
      className='min-h-[60vh] md:min-h-[70vh] bg-cover bg-center bg-no-repeat text-white flex items-end'
      style={{ backgroundImage: `url(${fond7})` }}
    >
      <div className='flex flex-col px-6 sm:px-10 md:px-20 pb-10 sm:pb-16 md:pb-20 max-w-3xl'>
        <span
          style={{ color: '#C4A060' }}
          className='text-xs sm:text-sm font-light tracking-[0.3em] uppercase'
        >
          {t.histoire.titre}
        </span>
        <p className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-6xl font-medium mt-3 sm:mt-4">
          {t.histoire.titrePage}
        </p>
      </div>
    </main>
  )
}

function Body () {
  const { t } = useLanguage()
  return (
    <>
      <div className='flex flex-col-reverse lg:flex-row items-center justify-center gap-14 mt-20 mb-20 px-6 lg:px-20'>
        <div className='w-full lg:w-1/2'>
          <h1 className="font-['Playfair_Display'] text-2xl md:text-3xl lg:text-3xl italic font-light text-center lg:text-left leading-relaxed">
            {t.histoire.citation}
          </h1>
          <p className='text-gray-500 leading-8 mt-8 text-center lg:text-left'>
            {t.histoire.p1}
          </p>
          <p className='text-gray-500 leading-8 mt-5 text-center lg:text-left'>
            {t.histoire.p2}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className='w-full lg:w-1/2 flex justify-center'
        >
          <img
            src={fond8}
            alt='Restaurant Les Deux Colombes'
            className='w-full max-w-xl rounded-3xl object-cover shadow-2xl duration-500 hover:scale-[1.02]'
          />
        </motion.div>
      </div>

      <div className='bg-[#e9e4da] p-8 md:p-12'>
        <div className='flex flex-col justify-center items-center text-center l mb-10'>
          <span style={{ color: '#C4A060' }} className='text-sm'>
            {t.histoire.chronologie}
          </span>
          <h1 className="font-['Playfair_Display'] text-4xl font-medium mb-10">
            {t.histoire.grandesEtapes}
          </h1>
        </div>
        <Timeline />
      </div>

      <div>
        <div className='flex flex-col lg:flex-row items-center justify-center gap-16 mt-20 px-6 lg:px-20'>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className='w-full lg:w-1/2 flex justify-center'
          >
            <img
              src={fond9}
              alt={t.histoire.philosophie}
              className='w-full max-w-xl h-[400px] object-cover rounded-3xl shadow-2xl duration-500 hover:scale-[1.02]'
            />
          </motion.div>

          <div className='w-full lg:w-1/2'>
            <span
              style={{ color: '#C4A060' }}
              className='uppercase tracking-[3px] text-sm font-semibold'
            >
              {t.histoire.philosophie}
            </span>
            <h1 className="font-['Playfair_Display'] text-3xl md:text-3xl lg:text-4xl font-medium leading-tight mt-4 mb-8">
              {t.histoire.philosophieTitle}
            </h1>
            <p className='text-gray-500 leading-8'>
              {t.histoire.philosophieP1}
            </p>
            <p className='text-gray-500 leading-8 mt-5 mb-10'>
              {t.histoire.philosophieP2}
            </p>
            <Link
              to='/Reserver'
              className='inline-block px-8 py-4 rounded-2xl font-semibold text-black duration-500 shadow-lg hover:-translate-y-1 hover:shadow-2xl'
              style={{ backgroundColor: '#C4A060' }}
            >
              {t.histoire.reserverTable}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

function Timeline () {
  const { t } = useLanguage()
  const events = t.histoire.timeline

  return (
    <div>
      <div className='max-w-3xl mx-auto'>
        {events.map((event, index) => (
          <div key={index} className='relative pl-16 pb-12 last:pb-0'>
            {index !== events.length - 1 && (
              <span className='absolute left-[52px] top-3 bottom-0 w-px bg-amber-700/30' />
            )}
            <span className='absolute left-[46px] top-1 w-3 h-3 rounded-full bg-amber-700/60' />
            <span className="absolute left-0 top-0 w-10 text-right font-['Playfair_Display'] text-amber-800 text-sm">
              {event.year}
            </span>
            <h3 className="font-['Playfair_Display'] text-xl text-gray-900 mb-2">
              {event.title}
            </h3>
            <p className='text-gray-500 leading-relaxed'>{event.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
