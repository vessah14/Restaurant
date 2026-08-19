import Navbarre2 from '../components/Navbarre2'
import Entrees2 from '../assets/Entrees2.jpg'
import Frommage1 from '../assets/frommage1.jpg'
import Dessert3 from '../assets/Dessert3.jpg'
import plat1 from '../assets/Entrees3.jpg'
import Entrees4 from '../assets/Entrees4.jpg'
import fond3 from '../assets/fond3.jfif'
import fond5 from '../assets/fond5.jpg'
import fond7 from '../assets/fond7.jpg'
import Boisson1 from '../assets/boisson1.jpg'
import paris1 from '../assets/paris1.jpg'
import paris2 from '../assets/paris2.jpg'
import paris3 from '../assets/paris3.jpg'
import { useState } from 'react'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'

export default function Galerie () {
  return (
    <>
      <Seo
        title='Galerie Photos — Les Deux Colombes | Découvrez notre Restaurant'
        description="Parcourez notre galerie de photos du restaurant, de nos plats savoureux et de l'ambiance chaleureuse. Bienvenue à Paris."
        url='/Galerie'
        keywords='galerie restaurant, photos intérieur, plats, ambiance, Paris, décor'
      />
      <div className='bg-[#f5f1ea]'>
        <Navbarre2 />
        <HeaderTitle />
        <Filter />
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
          {t.galeriePage.titre}
        </span>
        <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium mb-5">
          {t.galeriePage.titrePage}
        </h1>
        <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
          {t.galeriePage.desc}
        </p>
      </div>
    </main>
  )
}

function Filter () {
  const [category, setCategory] = useState('tous')
  const { t } = useLanguage()

  const categoryLabels = {
    tous: t.galeriePage.tous,
    cuisine: t.galeriePage.cuisine,
    salle: t.galeriePage.salle,
    cave: t.galeriePage.cave,
    paris: t.galeriePage.paris
  }

  const products = [
    {
      id: 1,
      image: Entrees2,
      text: 'Velouté de Châtaignes',
      category: 'cuisine'
    },
    { id: 7, image: Frommage1, text: 'Frommages', category: 'cuisine' },
    { id: 2, image: plat1, text: 'Filet de Bœuf Rossini', category: 'cuisine' },
    {
      id: 3,
      image: Entrees4,
      text: 'Salade de Homard Breton',
      category: 'cuisine'
    },
    { id: 4, image: Dessert3, text: 'Paris-Brest Maison', category: 'cuisine' },
    { id: 5, image: fond3, text: 'Salle1', category: 'salle' },
    { id: 6, image: fond7, text: 'salle2', category: 'salle' },
    { id: 8, image: fond5, text: 'salle3', category: 'salle' },
    {
      id: 9,
      image: Boisson1,
      text: 'Bordeaux Rouge Grand Cru',
      category: 'cave'
    },
    { id: 10, image: paris1, text: 'paris1', category: 'paris' },
    { id: 11, image: paris2, text: 'Paris2', category: 'paris' },
    { id: 12, image: paris3, text: 'Paris3', category: 'paris' }
  ]

  const categories = [
    'tous',
    ...new Set(products.map(product => product.category))
  ]

  const filteredProducts =
    category === 'tous'
      ? products
      : products.filter(product => product.category === category)

  return (
    <section className='flex flex-col justify-center items-center mx-auto px-4 sm:px-6 py-10'>
      <div className='flex w-full border-b border-gray-400 justify-center'>
        <div className='mb-3 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5'>
          {categories.map(item => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`
                px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold duration-300 text-xs sm:text-sm whitespace-nowrap
                ${
                  category === item
                    ? 'bg-[#C4A060] text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }
              `}
            >
              {categoryLabels[item] || item}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-10 mt-10 sm:mt-16 w-full'>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className='relative group overflow-hidden rounded-2xl'
          >
            <img
              src={product.image}
              alt={product.text}
              loading='lazy'
              decoding='async'
              className='w-full h-32 sm:h-44 md:h-55 rounded-2xl duration-700 ease-in-out hover:scale-105 object-cover object-center'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 duration-700' />
            <div className='absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 duration-700'>
              <h1 className='text-white text-xs sm:text-sm font-bold'>
                {product.text}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
