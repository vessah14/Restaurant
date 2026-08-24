import { useEffect, useState } from 'react'
import Navbarre2 from '../components/Navbarre2'
import Carte from '../components/Carte'
import Footer from '../components/Footer'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'
import { carteApi } from '../api/carte'
import { mediaUrl } from '../api/client'

const categoryIcons = {
  tous: '🍽️',
  entrees: '🥗',
  plats: '🍲',
  desserts: '🍰',
  boissons: '🍹'
}

export default function CartePricipal () {
  return (
    <>
      <Seo
        title='Notre Carte — Cuisine Française Traditionnelle | Les Deux Colombes'
        description='Découvrez notre carte de cuisine française traditionnelle avec des plats authentiques, viandes, poissons et vins sélectionnés. À deux pas de Notre-Dame de Paris.'
        url='/Carte'
        keywords='carte restaurant, cuisine française, plats français, vins, Paris, Notre-Dame, restaurant gastronomique'
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
    <>
      <main
        id='hero'
        className='min-h-20 bg-gray-800 overflow-hidden object-cover text-white'
      >
        <div className='flex flex-col justify-center items-center mt-10 h-75'>
          <span
            style={{ color: '#C4A060' }}
            className='text-sm font-light tracking-[0.3em]'
          >
            {t.carte.titre}
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium mb-5">
            {t.carte.titrePage}
          </h1>
          <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
            {t.carte.desc}
          </p>
        </div>
      </main>
    </>
  )
}

function Filter () {
  const [category, setCategory] = useState('tous')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { t } = useLanguage()
  const { lang } = useLanguage()

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    carteApi
      .getCarte(lang)
      .then(data => {
        if (active) setCategories(data)
      })
      .catch(() => {
        if (active) setError(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [lang])

  const filteredCategories =
    category === 'tous'
      ? categories
      : categories.filter(item => item.code === category)
  const products = filteredCategories.flatMap(item => item.plats || [])
  const categoryItems = ['tous', ...categories.map(item => item.code)]

  return (
    <section className='flex flex-col justify-center items-center mx-auto px-6 py-10'>
      {/* Boutons des catégories */}
      <div className='flex justify-center w-full gap-5 border-b border-gray-400'>
        {categoryItems.map(item => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`
            py-3
            px-6
            font-semibold
            duration-300

            ${
              category === item
                ? 'border-[#C4A060] text-gray-500 border-b-2'
                : ' hover:boder-[#C4A060] text-gray-500'
            }
            `}
          >
            <span aria-hidden='true' className='mr-2 text-base'>
              {categoryIcons[item.toLowerCase()] || '🍽️'}
            </span>
            <span>
              {categories.find(categoryItem => categoryItem.code === item)
                ?.nom ||
                t.carte[item.toLowerCase()] ||
                item}
            </span>
          </button>
        ))}
      </div>

      {/* Affichage des produits */}
      {loading && (
        <p className='mt-16 text-gray-500'>Chargement de la carte...</p>
      )}
      {error && (
        <p className='mt-16 text-red-600'>
          La carte est momentanément indisponible.
        </p>
      )}
      {!loading && !error && (
        <div className='grid md:grid-cols-3 gap-10 mt-16'>
          {products.map(product => (
            <Carte
              key={product.id}
              image={mediaUrl(product.imageUrl)}
              name={product.nom}
              description={product.description}
              price={product.prix}
              loading='lazy'
            />
          ))}
        </div>
      )}
      <div className='flex justify-center items-center w-300 mt-10 mb-7'>
        <span className='bg-[#e9e4da] p-5 px-10 rounded-2xl text-gray-500'>
          {t.carte.allergenes}
        </span>
      </div>
      <a
        href=''
        className='p-2 px-8 py-3 rounded-xl duration-300
                    hover:scale-102
                    hover:shadow-xl font-semibold'
        style={{ backgroundColor: '#C4A060' }}
      >
        {t.carte.reserverTable}
      </a>
    </section>
  )
}
