import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react'

import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../context/AuthContext'

function AvatarUtilisateur ({ texteBlanc = false, compact = false }) {
  const { utilisateur, deconnecter } = useAuth()
  const { t } = useLanguage()

  if (!utilisateur) return null

  const initiales = `${utilisateur.prenom.charAt(0)}${utilisateur.nom.charAt(
    0
  )}`.toUpperCase()

  if (compact) {
    return (
      <Link to='/Compte' className='block'>
        <div className='w-9 h-9 rounded-full bg-[#C4A060] text-white font-extrabold flex items-center justify-center text-sm cursor-pointer'>
          {initiales}
        </div>
      </Link>
    )
  }

  return (
    <div className='flex items-center gap-3'>
      <Link to='/Compte' className='block'>
        <div className='w-13 h-13 rounded-full bg-[#C4A060] text-white font-extrabold flex items-center justify-center text-2xl cursor-pointer'>
          {initiales}
        </div>
      </Link>
      <button
        onClick={deconnecter}
        className={`text-sm font-medium hover:text-[#C4A060] transition ${
          texteBlanc ? 'text-white' : 'text-black'
        }`}
      >
        {t.deconnexion.bouton}
      </button>
    </div>
  )
}

export default function Navbarre2 () {
  const location = useLocation()
  const { t } = useLanguage()
  const { utilisateur, estConnecte } = useAuth()

  const navigation = [
    { name: t.nav.histoire, route: '/About' },
    { name: t.nav.carte, route: '/Carte' },
    { name: t.nav.galerie, route: '/Galerie' },
    { name: t.nav.faq, route: '/FAQ' },
    { name: t.nav.contact, route: '/Contact' }
  ]

  // Position de la barre
  const [position, setPosition] = useState({
    left: 0,
    width: 0
  })

  // référence des liens
  const linksRef = useRef([])

  // déplacer la barre
  const moveBar = index => {
    const element = linksRef.current[index]

    if (!element) return

    setPosition({
      left: element.offsetLeft,
      width: element.offsetWidth
    })
  }

  // lien actif
  const activeIndex = navigation.findIndex(
    item => item.route === location.pathname
  )

  // lorsque la page change
  useEffect(() => {
    if (activeIndex !== -1) {
      moveBar(activeIndex)
    }
  }, [location.pathname])

  // lorsque la souris quitte le menu
  const handleLeave = () => {
    if (activeIndex !== -1) {
      moveBar(activeIndex)
    }
  }

  return (
    <Disclosure
      as='nav'
      className='
      fixed
      top-0
      left-0
      w-full
      z-50
      bg-[#f5f1ea]
      shadow-xl
      '
    >
      <div className='mx-auto max-w-7xl px-6'>
        <div className='relative flex h-20 items-center justify-between'>
          {/* LOGO */}

          <div className='flex flex-col justify-center shrink-0'>
            <Link
              to='/'
              className="
              text-2xl
              tracking-[0.2em]
              font-bold
              font-['Playfair_Display']
              text-black
              "
            >
              Les Deux Colombes
            </Link>

            <span
              className='
              text-xs
              font-semibold
              tracking-[4px]
              uppercase
              '
              style={{
                color: '#C4A060'
              }}
            >
              {t.nav.restaurant}
            </span>
          </div>

          {/* MENU DESKTOP */}

          <div
            className='
            hidden
            sm:flex
            items-center
            gap-14
            '
            onMouseLeave={handleLeave}
          >
            {/* liens */}

            <div
              className='
              relative
              flex
              gap-8
              '
            >
              {/* BARRE ANIMEE */}

              <span
                className='
                absolute
                -bottom-1
                h-[3px]
                rounded-full
                shadow-sm
                duration-500
                ease-out
                '
                style={{
                  left: position.left,
                  width: position.width,
                  backgroundColor: '#C4A060',
                  transition:
                    'left .45s cubic-bezier(.22,1,.36,1), width .45s cubic-bezier(.22,1,.36,1)'
                }}
              />
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.route}
                  ref={element => (linksRef.current[index] = element)}
                  onMouseEnter={() => moveBar(index)}
                  className={`
                  relative
                  py-2
                  text-[15px]
                  font-medium
                  transition-all
                  duration-300

                  ${
                    location.pathname === item.route
                      ? 'text-[#C4A060]'
                      : 'text-black/80 hover:text-black'
                  }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* BOUTON LANGUE */}

            <LanguageSwitcher />

            {/* BOUTONS */}

            <div className='flex items-center gap-6'>
              {estConnecte ? (
                <AvatarUtilisateur />
              ) : (
                <Link
                  to='/Connexion'
                  className='
                  font-medium
                  text-black
                  duration-300
                  hover:text-[#C4A060]
                  '
                >
                  {t.nav.connexion}
                </Link>
              )}

              <Link
                to='/Reserver'
                className='
                px-8
                py-3
                rounded-2xl
                font-semibold
                shadow-lg
                duration-300
                hover:scale-105
                '
                style={{
                  backgroundColor: '#C4A060'
                }}
              >
                {t.nav.reserver}
              </Link>
            </div>
          </div>

          {/* MENU MOBILE */}

          <div className='flex items-center sm:hidden'>
            <DisclosureButton
              className='
              group
              inline-flex
              items-center
              justify-center
              rounded-md
              p-2
              text-gray-900
              '
            >
              <Bars3Icon
                className='
                block
                size-6
                group-data-open:hidden
                '
              />

              <XMarkIcon
                className='
                hidden
                size-6
                group-data-open:block
                '
              />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}

      <DisclosurePanel
        className='
        sm:hidden
        bg-white
        '
      >
        <div className='space-y-3 px-6 py-5'>
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.route}
              className={`
              block
              py-2
              font-medium
              duration-300

              ${
                location.pathname === item.route
                  ? 'text-[#C4A060]'
                  : 'text-black'
              }
              `}
            >
              {item.name}
            </Link>
          ))}

          <LanguageSwitcher />

          {estConnecte ? (
            <AvatarUtilisateur compact={false} />
          ) : (
            <Link
              to='/Connexion'
              className='
              block
              font-medium
              text-black
              hover:text-[#C4A060]
              '
            >
              {t.nav.connexion}
            </Link>
          )}

          <Link
            to='/Reserver'
            className='
            block
            w-full
            rounded-full
            py-3
            text-center
            font-semibold
            text-black
            '
            style={{
              backgroundColor: '#C4A060'
            }}
          >
            {t.nav.reserver}
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
