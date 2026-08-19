import { useState } from 'react'
import Navbarre2 from '../components/Navbarre2'
import Carte from '../components/Carte'
import Footer from '../components/Footer'
import Entrees from '../assets/Entrees.jpg'
import Entrees2 from '../assets/Entrees2.jpg'
import Entrees4 from '../assets/Entrees4.jpg'
import plat1 from '../assets/Entrees3.jpg'
import plat2 from '../assets/plat2.jpg'
import plat3 from '../assets/plat3.jpg'
import Dessert1 from '../assets/Dessert1.jpg'
import Dessert2 from '../assets/Dessert2.jpg'
import Dessert3 from '../assets/Dessert3.jpg'
import Boisson1 from '../assets/boisson1.jpg'
import Boisson2 from '../assets/boisson2.jpg'
import Boisson3 from '../assets/boisson3.jpg'
import { useLanguage } from '../i18n/useLanguage'
import Seo from '../components/Seo'

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
  // Catégorie sélectionnée
  const [category, setCategory] = useState('tous')
  const { t } = useLanguage()

  // Produits
  const products = [
    {
      id: 1,
      image: Entrees,
      name: 'Foie Gras de Canard Mi-Cuit',
      description:
        'Chutney de figues, brioche toastée maison, fleur de sel de Guérande.',
      category: 'entrees',
      price: '15'
    },
    {
      id: 7,
      image: Entrees4,
      name: 'Salade de Homard Breton',
      description:
        "Vinaigrette à l'estragon, roquette fraîche, tomates confites",
      category: 'entrees',
      price: '15'
    },

    {
      id: 2,
      image: Entrees2,
      name: 'Velouté de Châtaignes',
      description:
        'Crème fraîche légère, lardons dorés, huile de truffe noire du Périgord.',
      category: 'entrees',
      price: '12'
    },

    {
      id: 3,
      image: plat1,
      name: 'Filet de Bœuf Rossini',
      description: 'Pommes grenailles fondantes et sauce au foie gras maison.',
      category: 'plats',
      price: '28'
    },

    {
      id: 4,
      image: plat2,
      name: 'Saumon Grillé aux Herbes',
      description: 'Légumes croquants et sauce citronnée au beurre blanc.',
      category: 'plats',
      price: '24'
    },

    {
      id: 5,
      image: Dessert1,
      name: 'Tarte Tatin',
      description: 'Pommes caramélisées servies avec une glace à la vanille.',
      category: 'desserts',
      price: '10'
    },

    {
      id: 6,
      image: Dessert2,
      name: 'Fondant au Chocolat',
      description:
        "Cœur coulant au chocolat noir accompagné d'une boule de glace.",
      category: 'desserts',
      price: '12'
    },
    {
      id: 8,
      image: Boisson1,
      name: 'Bordeaux Rouge Grand Cru',
      description:
        'Château Pichon Baron, Pauillac 2019 · Verre 12cl · Tanins soyeux',
      category: 'boissons',
      price: '12'
    },

    {
      id: 9,
      image: Boisson2,
      name: 'Café & Mignardises',
      description:
        'Espresso, noisette ou allongé, accompagné de petits fours maison',
      category: 'boissons',
      price: '12'
    },

    {
      id: 10,
      image: Boisson3,
      name: 'Champagne Blanc de Blancs',
      description:
        'Maison Ruinart, Reims · Verre 12cl · Bulles fines et élégantes',
      category: 'boissons',
      price: '12'
    },

    {
      id: 11,
      image: Dessert3,
      name: 'Paris-Brest Maison',
      description:
        'Choux croustillants, praliné noisette du Piémont, pralines roses de Lyon',
      category: 'desserts',
      price: '12'
    },
    {
      id: 12,
      image: plat3,
      name: 'Côte de Veau de Lait Rôtie',
      description:
        'Morilles à la crème fraîche, asperges vertes, jus de veau réduit',
      category: 'plats',
      price: '12'
    }
  ]

  // Création automatique des catégories
  const categories = [
    'tous',
    ...new Set(products.map(product => product.category))
  ]

  // Filtrage des produits
  const filteredProducts =
    category === 'tous'
      ? products
      : products.filter(product => product.category === category)

  return (
    <section className='flex flex-col justify-center items-center mx-auto px-6 py-10'>
      {/* Boutons des catégories */}
      <div className='flex justify-center w-full gap-5 border-b border-gray-400'>
        {categories.map(item => (
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
            {t.carte[item.toLowerCase()] || item}
          </button>
        ))}
      </div>

      {/* Affichage des produits */}
      <div className='grid md:grid-cols-3 gap-10 mt-16'>
        {filteredProducts.map(product => (
          <Carte
            key={product.id}
            image={product.image}
            name={product.name}
            description={product.description}
            price={product.price}
            loading='lazy'
          />
        ))}
      </div>
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
