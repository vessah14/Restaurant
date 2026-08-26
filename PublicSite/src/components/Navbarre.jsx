import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react'

import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '../i18n/useLanguage'
import { useAuth } from '../context/AuthContext'

function AvatarUtilisateur ({ texteBlanc = false, compact = false }) {
  const { utilisateur, deconnecter } = useAuth()

  if (!utilisateur) return null

  const initiales = `${utilisateur.prenom.charAt(0)}${utilisateur.nom.charAt(
    0
  )}`.toUpperCase()

  if (compact) {
    return (
      <Link to='/Compte' className='block'>
        <div className='w-9 h-9 rounded-full bg-[#C4A060] text-white font-extrabold flex items-center justify-center text-sm'>
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
        Déconnexion
      </button>
    </div>
  )
}

export default function Navbarre () {
  const { t } = useLanguage()
  const location = useLocation()
  const { utilisateur, estConnecte, deconnecter } = useAuth()

  const navigation = [
    { name: t.nav.accueil, route: '/' },
    { name: t.nav.histoire, route: '/About' },
    { name: t.nav.carte, route: '/Carte' },
    { name: t.nav.galerie, route: '/Galerie' },
    { name: t.nav.faq, route: '/FAQ' },
    { name: t.nav.contact, route: '/Contact' }
  ]

  const [navbar, setNavbar] = useState(false)

  const [position, setPosition] = useState({
    left: 0,
    width: 0
  })

  const linksRef = useRef([])

  //================ NAVBAR SCROLL =================

  useEffect(() => {
    const handleScroll = () => {
      setNavbar(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  //================ BARRE ACTIVE =================

  const moveBar = index => {
    const element = linksRef.current[index]

    if (!element) return

    setPosition({
      left: element.offsetLeft,
      width: element.offsetWidth
    })
  }

  const hideBar = () => {
    setPosition({
      left: 0,
      width: 0
    })
  }

  return (
    <Disclosure
      as='nav'
      className={`

      fixed
      top-0
      left-0
      w-full
      z-50
      duration-500

      ${navbar ? 'bg-[#f5f1ea] backdrop-blur-lg shadow-xl' : 'bg-transparent'}
      `}
    >
      <div className='mx-auto max-w-7xl px-6 '>
        <div className='relative flex h-20 items-center justify-between'>
          {/* LOGO */}

          <div className='flex flex-col justify-center shrink-0'>
            <Link
              to='/About'
              className={`
              text-2xl
              tracking-[0.2em]
              font-bold
              font-['Playfair_Display']

              ${navbar ? 'text-black' : 'text-white'}
              `}
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

          {/*================ MENU DESKTOP ================*/}

          <div
            className='
            hidden
            sm:flex
            items-center
            gap-14
            '
            onMouseLeave={hideBar}
          >
            {/* Liens */}

            <div
              className={`
              relative
              flex
              items-center
              gap-8

              ${navbar ? 'text-black' : 'text-white'}
              `}
            >
              {/* Barre animée */}

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
                  font-medium
                  duration-300
                  transition-all

                  ${
                    navbar
                      ? 'text-black hover:text-[#C4A060]'
                      : 'text-white hover:text-[#C4A060]'
                  }
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Boutons */}

            <div className='flex items-center gap-6'>
              <LanguageSwitcher dark={!navbar} />
              {estConnecte ? (
                <AvatarUtilisateur />
              ) : (
                <Link
                  to='/Connexion'
                  className={`
                font-medium
                duration-300
                hover:text-[#C4A060]

                ${navbar ? 'text-black' : 'text-white'}
                `}
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
                text-black
                font-semibold
                shadow-lg
                duration-300
                hover:scale-105
                hover:shadow-xl
                '
                style={{
                  backgroundColor: '#C4A060'
                }}
              >
                {t.nav.reserver}
              </Link>
            </div>
          </div>

          {/*================ MENU MOBILE ================*/}

          <div className='flex items-center gap-3 sm:hidden'>
            <DisclosureButton
              className={`
              group
              inline-flex
              items-center
              justify-center
              rounded-md
              p-2
              duration-300

              ${navbar ? 'text-black' : 'text-white'}
              `}
            >
              <span className='sr-only'>{t.nav.openMenu}</span>

              <Bars3Icon
                aria-hidden='true'
                className='
                block
                size-6
                group-data-open:hidden
                '
              />

              <XMarkIcon
                aria-hidden='true'
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

      {/*================ MENU MOBILE ================*/}

      <DisclosurePanel
        className='
        sm:hidden
        bg-white/90
        backdrop-blur-lg
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
            <AvatarUtilisateur />
          ) : (
            <Link
              to='/Connexion'
              className={`
                font-medium
                duration-300
                hover:text-[#C4A060]

                ${navbar ? 'text-black' : 'text-black'}
                `}
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
            duration-300
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

function getInitiales (prenom, nom) {
  const initPrenom = prenom?.charAt(0).toUpperCase() || ''
  const initNom = nom?.charAt(0).toUpperCase() || ''
  return `${initPrenom}${initNom}`
}
