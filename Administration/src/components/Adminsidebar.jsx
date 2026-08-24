import { useState } from 'react'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UtensilsCrossed,
  Image as ImageIcon,
  Star,
  HelpCircle,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Bell
} from 'lucide-react'
import { useAuthAdmin } from '../context/AuthAdminContext'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'reservations', label: 'Réservations', icon: CalendarDays },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'menu', label: 'Menu / Carte', icon: UtensilsCrossed },
  { key: 'galerie', label: 'Galerie', icon: ImageIcon },
  { key: 'avis', label: 'Clients Avis ', icon: Star },
  { key: 'faq', label: 'FAQ', icon: HelpCircle },
  { key: 'seo', label: 'SEO & Visibilité', icon: Search },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'parametres', label: 'Paramètres', icon: Settings }
]

export default function AdminSidebar ({
  brandName = 'Les Deux Colombes',
  brandTag = 'ADMINISTRATION',
  userName = 'Administrateur',
  userEmail = 'admin@lesdeuxcolombes.fr',
  userInitials = 'AD',
  activePage,
  setActivePage,
  notificationCount = 0,
  reservationCount = 0,
  avisCount = 0
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { deconnecter } = useAuthAdmin()

  const navItemsWithBadge = NAV_ITEMS.map(item => {
    if (item.key === 'notifications') {
      return {
        ...item,
        badge: notificationCount > 0 ? notificationCount : null
      }
    }
    if (item.key === 'reservations') {
      return { ...item, badge: reservationCount > 0 ? reservationCount : null }
    }
    if (item.key === 'avis') {
      return { ...item, badge: avisCount > 0 ? avisCount : null }
    }
    return item
  })

  const handleSelect = key => {
    setActivePage(key)
    setIsOpen(false) // referme le drawer sur mobile après sélection
  }

  return (
    <>
      {/* Bouton hamburger - visible uniquement sur mobile/tablette */}
      <button
        onClick={() => setIsOpen(true)}
        className='lg:hidden fixed top-4 left-4 z-30 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d1826] text-white shadow-lg'
        aria-label='Ouvrir le menu'
      >
        <Menu size={20} />
      </button>

      {/* Overlay sombre derrière le drawer mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className='lg:hidden fixed inset-0 z-40 bg-black/50'
          aria-hidden='true'
        />
      )}

      {/* Sidebar : drawer coulissant sur mobile, fixe sur desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col bg-[#0d1826] text-slate-300 border-r border-white/5 transition-transform duration-300 ease-in-out
        ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        {/* Bouton fermer - mobile uniquement */}
        <button
          onClick={() => setIsOpen(false)}
          className='lg:hidden absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white'
          aria-label='Fermer le menu'
        >
          <X size={18} />
        </button>

        {/* Header / Brand */}
        <div className='px-6 pt-6 pb-5'>
          <h1 className='font-serif text-lg sm:text-xl font-semibold text-white tracking-wide'>
            {brandName}
          </h1>
          <p className='mt-1 text-[11px] font-semibold tracking-[0.18em] text-[#C4A060]'>
            {brandTag}
          </p>
        </div>
        <div className='mx-6 h-px bg-white/10' />

        {/* Nav */}
        <nav className='flex-1 overflow-y-auto px-3 py-4 space-y-1'>
          {navItemsWithBadge.map(({ key, label, icon: Icon, badge }) => {
            const isActive = activePage === key
            return (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`admin-nav-item group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className='absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[#C4A060]' />
                )}
                <Icon
                  size={17}
                  strokeWidth={2}
                  className={
                    isActive
                      ? 'text-[#C4A060]'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }
                />
                <span className='flex-1 text-left font-medium'>{label}</span>
                {typeof badge === 'number' && (
                  <span className='flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4A060] px-1.5 text-[11px] font-semibold text-[#0d1826]'>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer / User */}
        <div className='mt-auto border-t border-white/10 px-4 py-4'>
          <div className='flex items-center gap-3 px-2 pb-3'>
            <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C4A060] text-sm font-semibold text-[#0d1826]'>
              {userInitials}
            </div>
            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-white'>
                {userName}
              </p>
              <p className='truncate text-xs text-slate-500'>{userEmail}</p>
            </div>
          </div>
          <button
            onClick={deconnecter}
            className='flex w-full items-center justify-center gap-2 rounded-full border border-white/15 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 transition-colors'
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  )
}
