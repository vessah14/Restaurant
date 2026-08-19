import AdminSidebar from '../components/AdminSidebar'
import HideBar from '../components/HideBar'
import Dashboard from './admin/Dashboard'
import Galerie from './admin/Galerie'
import { useState, useEffect } from 'react'
import Menu from './admin/Menu'
import Client from './admin/Client'
import Reservation from './admin/Reservation'
import Avis from './admin/Avis'
import FAQ from './admin/Faq'
import SEO from './admin/SEO'
import Statistique from './admin/Statistique'
import Parametres from './admin/Setting'
import Messages from './admin/Messages'
import Notifications from './admin/Notifications'
import {
  notificationsApi,
  reservationsApi,
  avisApi,
  utilisateursApi
} from '../api'
import { useAuthAdmin } from '../context/AuthAdminContext'

export default function Container ({
  brandName = 'Les Deux Colombes',
  notificationCount = 0,
  userName = 'Administrateur',
  userEmail = 'admin@lesdeuxcolombes.fr',
  userInitials = 'AD'
}) {
  const { utilisateur } = useAuthAdmin()
  const [activePage, setActivePage] = useState('dashboard')
  const [notifCount, setNotifCount] = useState(notificationCount)
  const [reservationCount, setReservationCount] = useState(0)
  const [avisCount, setAvisCount] = useState(0)

  useEffect(() => {
    const chargerCompteurs = async () => {
      try {
        const [notifRes, reservationsRes, avisRes] = await Promise.all([
          notificationsApi.getNombreNonLus(),
          reservationsApi.getAll(),
          avisApi.getAll('en_attente')
        ])
        setNotifCount(notifRes)
        setReservationCount(reservationsRes.length)
        setAvisCount(avisRes.length)
      } catch (error) {
        console.error('Erreur chargement compteurs:', error)
      }
    }

    chargerCompteurs()
    const interval = setInterval(chargerCompteurs, 60000)

    return () => clearInterval(interval)
  }, [])

  const pageMeta = {
    dashboard: { title: 'Tableau de bord', section: "Vue d'ensemble" },
    reservations: {
      title: 'Réservations',
      section: 'Gestion des réservations'
    },
    clients: { title: 'Clients', section: 'Gestion des clients' },
    menu: { title: 'Menu / Carte', section: 'Gestion du menu' },
    galerie: { title: 'Galerie', section: 'Photos du restaurant' },
    avis: { title: 'Avis clients', section: 'Modération des avis' },
    faq: { title: 'FAQ', section: 'Questions fréquentes' },
    seo: { title: 'SEO & Visibilité', section: 'Optimisation' },
    stats: { title: 'Statistiques', section: 'Analyse de performance' },
    parametres: { title: 'Paramètres', section: 'Réglages du site' },
    messages: { title: 'Messages', section: 'Contact' },
    notifications: { title: 'Notifications', section: 'Alertes' }
  }
  const { title, section } = pageMeta[activePage] || pageMeta.dashboard
  const nomUtilisateur = utilisateur
    ? `${utilisateur.prenom || ''} ${utilisateur.nom || ''}`.trim()
    : userName
  const initialesUtilisateur = utilisateur
    ? `${utilisateur.prenom?.[0] || ''}${
        utilisateur.nom?.[0] || ''
      }`.toUpperCase()
    : userInitials
  const emailUtilisateur = utilisateur?.email || userEmail
  // Gestion des pages

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />

      case 'reservations':
        return <Reservation />

      case 'clients':
        return <Client />

      case 'menu':
        return <Menu />

      case 'galerie':
        return <Galerie />

      case 'avis':
        return <Avis />

      case 'faq':
        return <FAQ />

      case 'seo':
        return <SEO />

      case 'stats':
        return <Statistique />
      case 'parametres':
        return <Parametres />
      case 'messages':
        return <Messages />
      case 'notifications':
        return <Notifications />

      default:
        return <Dashboard />
    }
  }
  return (
    <div className='flex h-screen bg-slate-50'>
      {/* Sidebar fixe à gauche */}
      <AdminSidebar
        brandName={brandName}
        brandTag={section.toUpperCase()}
        userName={nomUtilisateur || userName}
        userEmail={emailUtilisateur}
        userInitials={initialesUtilisateur || userInitials}
        activePage={activePage}
        setActivePage={setActivePage}
        notificationCount={notifCount}
        reservationCount={reservationCount}
        avisCount={avisCount}
      />

      {/* Colonne de droite : header + contenu scrollable */}
      <div className='flex flex-1 flex-col min-w-0'>
        <HideBar
          title={title}
          brandName={brandName}
          section={section}
          notificationCount={notifCount}
          userInitials={initialesUtilisateur || userInitials}
          onVoirToutes={() => setActivePage('notifications')}
        />

        <main className='flex-1 overflow-y-auto p-3 bg-[#f5f1ea]'>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
