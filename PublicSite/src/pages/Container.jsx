import Navbarre from '../components/Navbarre'
import Commentaire from '../components/Commentaite'
import Footer from '../components/Footer'
import image4 from '../assets/fond1.jfif'
import card1 from '../assets/card1.jpg'
import fond2 from '../assets/fond2.jfif'
import fond3 from '../assets/fond3.jpg'
import fond5 from '../assets/fond5.jpg'
import fond4 from '../assets/fond4.jpg'
import { ExternalLink, Navigation } from 'lucide-react'
import Carte from '../components/Carte'
import { FaLocationDot } from 'react-icons/fa6'
import { FaPhoneAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { FaClock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'
import { carteApi } from '../api/carte'
import { galerieApi } from '../api/galerie'
import { mediaUrl } from '../api/client'
import { useEffect, useState } from 'react'

export default function Container () {
  return (
    <>
      <Seo
        title='Les Deux Colombes — Restaurant français gastronomique à Paris 4ème'
        description='Découvrez Les Deux Colombes, restaurant français traditionnel gastronomique à Paris, à deux pas de Notre-Dame. Réservez votre table pour une expérience culinaire authentique.'
        url='/'
        keywords='restaurant français, Paris, Notre-Dame, cuisine gastronomique, restaurant traditionnel, réservation table Paris'
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          name: 'Les Deux Colombes',
          image: ['https://lesdeuxcolombes.fr/og-image.jpg'],
          description:
            'Restaurant français traditionnel gastronomique à Paris, à deux pas de Notre-Dame',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '2, rue de la Colombe',
            postalCode: '75004',
            addressLocality: 'Paris',
            addressCountry: 'FR'
          },
          telephone: '+33146333708',
          email: 'contact@lesdeuxcolombes.fr',
          url: 'https://lesdeuxcolombes.fr',
          servesCuisine: [
            'Cuisine Française',
            'Cuisine Française Traditionnelle'
          ],
          priceRange: '€€€',
          acceptsReservations: true,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127'
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday'
              ],
              opens: '12:00',
              closes: '23:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday', 'Sunday'],
              opens: '11:30',
              closes: '23:30'
            }
          ]
        }}
      />
      <div className='bg-[#f5f1ea]'>
        <Navbarre />
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
    <>
      <main
        id='hero'
        className='min-h-20 bg-cover bg-center text-white'
        style={{
          backgroundImage: `url(${image4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='flex flex-col justify-center items-center h-230'>
            <span
              style={{ color: '#C4A060' }}
              className='md:text-sm text-xs font-light tracking-[0.3em]'
            >
              {t.home.badge}
            </span>
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-8xl w-120 lg:w-220 text-center">
              {t.home.heroTitle1}{' '}
              <span className='italic'>{t.home.heroTitle2}</span>{' '}
              {t.home.heroTitle3}
            </h1>
            <p className='font-[sans-serif] mt-5 max-w-3xl text-center text-sm md:text-lg'>
              {t.home.heroDesc}
            </p>
            <div className='mt-5 flex flex-col sm:flex-row justify-center items-center gap-10'>
              <Link
                to='/Reserver'
                className='p-2 px-8 py-3 rounded-xl duration-300 hover:scale-102 hover:shadow-xl'
                style={{ backgroundColor: '#C4A060' }}
              >
                {t.home.reserverTable}
              </Link>
              <Link
                to='/Carte'
                className='p-2 px-8 py-3 rounded-xl border hover:bg-gray-50/10'
              >
                {t.home.decouvrirCarte}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}

function Body () {
  const adresse = '2, rue de la Colombe, 75004 Paris'
  const { t } = useLanguage()
  return (
    <>
      {/* ================= ABOUT ================= */}

      <section className='flex flex-col xl:flex-row gap-10 px-5 md:px-10 xl:px-20 mt-16 justify-center items-center'>
        {/* IMAGE */}
        <div className='relative p-4 md:p-8 w-full max-w-xl'>
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <div className='relative overflow-hidden rounded-3xl shadow-lg w-full'>
              <img
                src={card1}
                alt='Salle du restaurant'
                className='w-full h-[280px] sm:h-[350px] md:h-[400px] object-cover'
              />
            </div>

            {/* BADGE */}
            <div className='absolute bottom-4 right-4 md:right-0 translate-x-5 translate-y-5 md:translate-x-10 md:translate-y-10 bg-[#c9a55c] rounded-2xl shadow-xl h-32 w-32 md:h-40 md:w-40 flex flex-col justify-center items-center text-center'>
              <div className="font-['Playfair_Display'] text-3xl md:text-4xl text-gray-900">
                65
              </div>
              <div className='text-xs uppercase tracking-widest text-gray-800'>
                {t.home.ans}
                <br />
                {t.home.dHistoire}
              </div>
            </div>
          </motion.div>
        </div>

        {/* TEXTE */}
        <div className='w-full max-w-xl mb-16'>
          <span style={{ color: '#C4A060' }} className='text-sm'>
            {t.home.notreHistoire}
          </span>

          <h1 className="font-['Playfair_Display'] text-gray-900 text-3xl md:text-4xl xl:text-5xl leading-tight">
            {t.home.histoireTitle}
          </h1>

          <p className='text-gray-400 mt-5'>{t.home.histoireP1}</p>

          <p className='text-gray-400 mt-5'>{t.home.histoireP2}</p>

          <Link
            to='/About'
            className='inline-block mt-5 text-black font-semibold border-b-2 px-4 p-1 border-[#C4A060]'
          >
            {t.home.decouvrirHistoire}
          </Link>
        </div>
      </section>

      {/* ================= CARTE ================= */}

      <section className='mt-20 bg-[#EDE8DC] px-5 py-12 md:px-10 md:py-16 flex flex-col items-center text-center'>
        <span style={{ color: '#C4A060' }} className='text-lg'>
          {t.home.nosSpecialites}
        </span>

        <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium mb-10">
          {t.home.nosSpecialites}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10'>
            <PlatsRecents />
          </div>

          <div className='flex justify-center mt-10'>
            <Link
              to='/Carte'
              className='border-2 px-10 py-3 rounded-xl font-medium duration-300 hover:scale-105 hover:shadow-xl'
            >
              {t.home.decouvrirTouteCarte}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================= EXPERIENCE ================= */}

      <section className='flex flex-col xl:flex-row gap-12 px-5 md:px-10 xl:px-20 mt-20 justify-center items-center'>
        <div className='w-full max-w-xl'>
          <span style={{ color: '#C4A060' }} className='text-sm'>
            {t.home.experience}
          </span>

          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium leading-tight">
            {t.home.experienceTitle}
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10 mb-10'>
            <div>
              <div className='text-3xl'>🏛️</div>
              <h2 className='font-bold text-gray-800'>{t.home.exp1Title}</h2>
              <p className='text-gray-500'>{t.home.exp1Desc}</p>
            </div>

            <div>
              <div className='text-3xl'>🍷</div>
              <h2 className='font-bold text-gray-800'>{t.home.exp2Title}</h2>
              <p className='text-gray-500'>{t.home.exp2Desc}</p>
            </div>

            <div>
              <div className='text-3xl'>👨‍🍳</div>
              <h2 className='font-bold text-gray-800'>{t.home.exp3Title}</h2>
              <p className='text-gray-500'>{t.home.exp3Desc}</p>
            </div>

            <div>
              <div className='text-3xl'>🕯️</div>
              <h2 className='font-bold text-gray-800'>{t.home.exp4Title}</h2>
              <p className='text-gray-500'>{t.home.exp4Desc}</p>
            </div>
          </div>

          <Link
            to='/Reserver'
            className='inline-block bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold duration-300 hover:scale-105 hover:shadow-xl'
          >
            {t.home.reserverTable}
          </Link>
        </div>

        {/* GALERIE EXPERIENCE */}
        <div className='bg-[#f5f1ea] p-5 md:p-10 w-full max-w-xl'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='sm:col-span-2 overflow-hidden rounded-2xl'>
              <img
                src={fond4}
                alt='Salle restaurant'
                className='w-full h-[280px] md:h-[350px] object-cover'
              />
            </div>

            <div className='overflow-hidden rounded-2xl'>
              <img src={fond3} alt='' className='w-full h-52 object-cover' />
            </div>

            <div className='overflow-hidden rounded-2xl'>
              <img src={fond2} alt='' className='w-full h-52 object-cover' />
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALERIE ================= */}

      <section className='mt-20 bg-gray-900 px-5 py-12 md:px-10 flex flex-col items-center'>
        <div className='text-center'>
          <span style={{ color: '#C4A060' }} className='text-lg'>
            {t.home.galerie}
          </span>

          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium text-white">
            {t.home.galerieTitle}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 max-w-7xl w-full'
        >
          <GalerieRecente />
        </motion.div>

        <Link
          to='/Galerie'
          style={{ color: '#C4A060' }}
          className='border-2 px-10 py-3 rounded-xl mt-10 hover:bg-white/10'
        >
          {t.home.voirGalerie}
        </Link>
      </section>

      {/* ================= TEMOIGNAGES ================= */}

      <section className='mt-20 px-5'>
        <div className='flex flex-col items-center text-center'>
          <span style={{ color: '#C4A060' }} className='text-lg'>
            {t.home.temoignages}
          </span>

          <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl font-medium">
            {t.home.temoignagesTitle}
          </h1>

          <div className='flex flex-wrap justify-center gap-2 mt-3 text-gray-500'>
            <Stars />
            {t.home.temoignagesSub}
          </div>
        </div>

        <Commentaire />
      </section>

      {/* ================= RESERVATION ================= */}

      <section className='mt-20'>
        <motion.main
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='relative min-h-[400px] md:min-h-[500px] bg-cover bg-center overflow-hidden flex items-center justify-center'
          style={{ backgroundImage: `url(${fond5})` }}
        >
          <div className='absolute inset-0 bg-black/60' />

          <div className='relative z-10 text-center px-5'>
            <span style={{ color: '#C4A060' }} className='text-lg'>
              {t.home.reservation}
            </span>

            <h1 className="font-['Playfair_Display'] text-3xl md:text-5xl text-white font-medium">
              {t.home.reservationTitle}
            </h1>

            <p className='text-gray-200 max-w-xl mt-2 mb-5 mx-auto'>
              {t.home.reservationDesc}
            </p>

            <Link
              to='/Reserver'
              className='mt-10 bg-[#C4A060] px-8 py-4 rounded-xl font-semibold hover:scale-105 duration-300'
            >
              {t.home.reserverMaintenant}
            </Link>
          </div>
        </motion.main>
      </section>

      {/* ================= MAP / CONTACT ================= */}

      <section className='mt-20 px-5 md:px-10 xl:px-20'>
        <div className='flex flex-col xl:flex-row gap-12 justify-center items-center'>
          <div className='w-full max-w-xl'>
            <span style={{ color: '#C4A060' }} className='text-lg'>
              {t.home.nousTrouver}
            </span>

            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-medium leading-tight mb-10">
              {t.home.nousTrouverTitle}
            </h1>

            <div className='space-y-7'>
              <div className='flex items-start gap-4'>
                <FaLocationDot size={22} style={{ color: '#C4A060' }} />
                <div className='flex flex-col'>
                  <span style={{ color: '#C4A060' }}>{t.home.adresse}</span>
                  <span>2, rue de la Colombe, 75004 Paris</span>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <FaPhoneAlt size={22} style={{ color: '#C4A060' }} />
                <div className='flex flex-col'>
                  <span style={{ color: '#C4A060' }}>{t.home.telephone}</span>
                  <span>+33 (0)1 46 33 37 08</span>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <MdEmail size={22} style={{ color: '#C4A060' }} />
                <div className='flex flex-col'>
                  <span style={{ color: '#C4A060' }}>{t.home.email}</span>
                  <span>contact@lesdeuxcolombes.fr</span>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <FaClock size={22} style={{ color: '#C4A060' }} />
                <div className='flex flex-col'>
                  <span style={{ color: '#C4A060' }}>{t.home.horaires}</span>
                  <span className='whitespace-pre-line'>
                    {t.home.horairesDetail}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/*Maps*/}
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
      </section>
    </>
  )
}

function PlatsRecents () {
  const [plats, setPlats] = useState([])

  useEffect(() => {
    carteApi
      .getCarte('fr')
      .then(categories => {
        const platsRecents = categories
          .flatMap(categorie => categorie.plats || [])
          .filter(plat => plat.disponible)
          .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
          .slice(0, 3)

        setPlats(platsRecents)
      })
      .catch(error => {
        console.error('Erreur lors du chargement des plats récents', error)
      })
  }, [])

  return plats.map(plat => (
    <Carte
      key={plat.id}
      image={mediaUrl(plat.imageUrl)}
      price={plat.prix}
      name={plat.nom}
      description={plat.description}
    />
  ))
}

function GalerieRecente () {
  const { lang } = useLanguage()
  const [images, setImages] = useState([])

  useEffect(() => {
    let active = true

    galerieApi
      .getAll(lang)
      .then(data => {
        if (active) {
          setImages(data.filter(image => image.imageUrl).slice(0, 8))
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement de la galerie', error)
      })

    return () => {
      active = false
    }
  }, [lang])

  return images.map(image => (
    <div key={image.id} className='overflow-hidden rounded-2xl'>
      <img
        src={mediaUrl(image.imageUrl)}
        alt={image.titre || image.categorie || 'Galerie'}
        loading='lazy'
        decoding='async'
        className='w-full h-72 object-cover rounded-2xl duration-700 hover:scale-105'
      />
    </div>
  ))
}

function Stars () {
  return (
    <div className='flex gap-0.5 text-amber-400 text-sm mb-4'>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  )
}
