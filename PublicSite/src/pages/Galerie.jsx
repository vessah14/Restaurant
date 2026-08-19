import Navbarre2 from '../components/Navbarre2'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'
import { galerieApi } from '../api/galerie'
import { mediaUrl } from '../api/client'

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
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()
  const { lang } = useLanguage()

  const categoryLabels = {
    tous: t.galeriePage.tous,
    cuisine: t.galeriePage.cuisine,
    salle: t.galeriePage.salle,
    cave: t.galeriePage.cave,
    paris: t.galeriePage.paris
  }

  useEffect(() => {
    let active = true
    setLoading(true)
    galerieApi
      .getAll(lang)
      .then(data => {
        if (active) setProducts(data)
      })
      .catch(() => {
        if (active) setProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [lang])

  const categories = [
    'tous',
    ...new Set(products.map(product => product.categorie))
  ]

  const filteredProducts =
    category === 'tous'
      ? products
      : products.filter(product => product.categorie === category)

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
        {loading && (
          <p className='col-span-full text-center text-gray-500'>
            Chargement de la galerie...
          </p>
        )}
        {!loading &&
          filteredProducts.map(product => (
            <div
              key={product.id}
              className='relative group overflow-hidden rounded-2xl'
            >
              <img
                src={mediaUrl(product.imageUrl)}
                alt={product.titre || product.categorie}
                loading='lazy'
                decoding='async'
                className='w-full h-32 sm:h-44 md:h-55 rounded-2xl duration-700 ease-in-out hover:scale-105 object-cover object-center'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 duration-700' />
              <div className='absolute bottom-2 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 duration-700'>
                <h1 className='text-white text-xs sm:text-sm font-bold'>
                  {product.titre || product.categorie}
                </h1>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
