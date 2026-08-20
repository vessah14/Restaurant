import { useState, useEffect } from 'react'
import { Circle, Bell, X, CheckCheck, Trash2, Clock } from 'lucide-react'
import { notificationsApi } from '../api'

function formatDateFr (date) {
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

function formatNotificationDate (dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours} h`
  if (diffDays < 7) return `Il y a ${diffDays} j`
  return date.toLocaleDateString('fr-FR')
}

export default function HideBar ({
  title = 'Tableau de bord',
  brandName = 'Les Deux Colombes',
  section = 'Administration',
  notificationCount = 0,
  userInitials = 'AD',
  date = new Date(),
  onVoirToutes = null,
  onNotificationCountChange = null
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(notificationCount)

  useEffect(() => {
    setCount(notificationCount)
  }, [notificationCount])

  const chargerNotifications = async () => {
    setLoading(true)
    try {
      const data = await notificationsApi.getAll(false)
      setNotifications(data.slice(0, 5))
    } catch (error) {
      console.error('Erreur chargement notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = () => {
    if (!isOpen) {
      chargerNotifications()
    }
    setIsOpen(!isOpen)
  }

  const handleMarquerLu = async id => {
    try {
      await notificationsApi.marquerLu(id)
      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, estLu: true, dateLecture: new Date().toISOString() }
            : n
        )
      )
      setCount(prev => Math.max(0, prev - 1))
      onNotificationCountChange?.(-1)
    } catch (error) {
      console.error('Erreur marquage lu:', error)
    }
  }

  const handleMarquerTousLus = async () => {
    try {
      await notificationsApi.marquerTousLus()
      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          estLu: true,
          dateLecture: new Date().toISOString()
        }))
      )
      setCount(0)
      onNotificationCountChange?.('reset')
    } catch (error) {
      console.error('Erreur marquage tous lus:', error)
    }
  }

  return (
    <header className='flex items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 py-4 pl-16 lg:pl-6'>
      {/* Left: title + breadcrumb */}
      <div className='min-w-0'>
        <div className='flex items-center gap-2'>
          <Circle size={9} className='fill-slate-900 text-slate-900 shrink-0' />
          <h1 className='text-[15px] font-semibold text-slate-900 truncate'>
            {title}
          </h1>
        </div>
        <p className='mt-0.5 pl-[17px] text-[13px] text-slate-500 truncate hidden sm:block'>
          {brandName} · {section}
        </p>
      </div>

      {/* Right: date, notifications, avatar */}
      <div className='flex items-center gap-3 sm:gap-5 shrink-0'>
        <span className='hidden md:inline text-[13px] text-slate-500 whitespace-nowrap'>
          {formatDateFr(date)}
        </span>

        <div className='relative'>
          <button
            onClick={handleToggle}
            className='relative text-[#C4A060] hover:text-[#C4A060] transition-colors'
          >
            <Bell size={20} strokeWidth={2} />
            {count > 0 && (
              <span className='absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white'>
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          {/* Dropdown des notifications */}
          {isOpen && (
            <>
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsOpen(false)}
              />
              <div className='absolute right-0 top-full mt-2 z-20 w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden'>
                {/* Header du dropdown */}
                <div className='flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50'>
                  <h3 className='font-semibold text-slate-900'>
                    Notifications
                  </h3>
                  {count > 0 && (
                    <button
                      onClick={handleMarquerTousLus}
                      className='text-xs text-[#C4A060] hover:text-[#C4A060] font-medium'
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                {/* Liste des notifications */}
                <div className='max-h-96 overflow-y-auto'>
                  {loading ? (
                    <div className='flex items-center justify-center py-8'>
                      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#C4A060]' />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className='py-8 text-center text-slate-500 text-sm'>
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors ${
                          !notification.estLu ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          <div className={`flex-1 min-w-0`}>
                            <div className='flex items-center gap-2'>
                              <p className='text-sm font-medium text-slate-900 truncate'>
                                {notification.titre}
                              </p>
                              {!notification.estLu && (
                                <span className='flex h-2 w-2 rounded-full bg-blue-500 shrink-0' />
                              )}
                            </div>
                            <p className='text-xs text-slate-600 mt-0.5 line-clamp-2'>
                              {notification.message}
                            </p>
                            <div className='flex items-center gap-1 mt-1 text-xs text-slate-400'>
                              <Clock size={10} />
                              {formatNotificationDate(
                                notification.dateCreation
                              )}
                            </div>
                          </div>
                          {!notification.estLu && (
                            <button
                              onClick={() => handleMarquerLu(notification.id)}
                              className='p-1 text-slate-400 hover:text-[#C4A060] transition-colors'
                              title='Marquer comme lu'
                            >
                              <CheckCheck size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className='px-4 py-2 border-t border-slate-100 bg-slate-50'>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      if (onVoirToutes) {
                        onVoirToutes()
                      }
                    }}
                    className='w-full text-center text-xs text-[#C4A060] hover:text-[#C4A060] font-medium'
                  >
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C4A060] text-xs font-semibold text-white'>
          {userInitials}
        </div>
      </div>
    </header>
  )
}
