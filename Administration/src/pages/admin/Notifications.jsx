import { useState, useEffect } from 'react'
import {
  Bell,
  UserPlus,
  MessageSquare,
  CalendarDays,
  UserCog,
  Trash2,
  CheckCheck,
  Mail,
  Clock
} from 'lucide-react'
import { notificationsApi } from '../../api'
import AppModal from '../../components/AppModal'

const TYPE_CONFIG = {
  inscription: {
    icon: UserPlus,
    label: 'Inscription',
    color: 'bg-green-100 text-green-700',
    iconColor: 'text-green-600'
  },
  message: {
    icon: MessageSquare,
    label: 'Message',
    color: 'bg-blue-100 text-blue-700',
    iconColor: 'text-blue-600'
  },
  reservation: {
    icon: CalendarDays,
    label: 'Réservation',
    color: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-600'
  },
  modification_profil: {
    icon: UserCog,
    label: 'Profil modifié',
    color: 'bg-purple-100 text-purple-700',
    iconColor: 'text-purple-600'
  }
}

function formatDate (dateStr) {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export default function Notifications ({ onNotificationCountChange }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('toutes')
  const [error, setError] = useState(null)
  const [notificationToDelete, setNotificationToDelete] = useState(null)
  const [modalMessage, setModalMessage] = useState(null)

  useEffect(() => {
    chargerNotifications()
  }, [])

  const chargerNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await notificationsApi.getAll()
      setNotifications(data)
    } catch (err) {
      console.error('Erreur chargement notifications:', err)
      setError('Impossible de charger les notifications.')
    } finally {
      setLoading(false)
    }
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
      onNotificationCountChange?.(-1)
    } catch (err) {
      console.error('Erreur marquage lu:', err)
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
      onNotificationCountChange?.('reset')
    } catch (err) {
      console.error('Erreur marquage tous lus:', err)
    }
  }

  const handleSupprimer = async id => {
    try {
      await notificationsApi.supprimer(id)
      setNotifications(prev => {
        const notification = prev.find(n => n.id === id)
        if (notification && !notification.estLu) {
          onNotificationCountChange?.(-1)
        }
        return prev.filter(n => n.id !== id)
      })
    } catch (err) {
      console.error('Erreur suppression notification:', err)
      setModalMessage('Impossible de supprimer cette notification.')
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'toutes') return true
    if (filter === 'non-lues') return !n.estLu
    return n.type === filter
  })

  const nonLues = notifications.filter(n => !n.estLu).length

  const FILTERS = [
    { key: 'toutes', label: 'Toutes' },
    { key: 'non-lues', label: `Non lues (${nonLues})` },
    { key: 'inscription', label: 'Inscriptions' },
    { key: 'message', label: 'Messages' },
    { key: 'reservation', label: 'Réservations' },
    { key: 'modification_profil', label: 'Profils modifiés' }
  ]

  return (
    <div className='min-h-screen bg-[#f5f1ea] p-8'>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Notifications
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            Gestion des notifications du restaurant
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={handleMarquerTousLus}
            disabled={nonLues === 0}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white text-[#5C5847] hover:bg-[#F7F4EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <CheckCheck size={16} />
            Tout marquer comme lu
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className='mb-6 flex flex-wrap gap-2'>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filter === f.key
                ? 'bg-[#D9A15C] text-[#1A1D24]'
                : 'bg-white text-[#5C5847] hover:bg-[#F7F4EC]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste des notifications */}
      {loading ? (
        <div className='flex items-center justify-center py-20'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#C4A060]' />
        </div>
      ) : error ? (
        <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center'>
          {error}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className='bg-white rounded-2xl shadow-sm p-12 text-center'>
          <Bell size={48} className='mx-auto text-gray-300 mb-4' />
          <p className='text-gray-500 font-medium'>Aucune notification</p>
          <p className='text-sm text-gray-400 mt-1'>
            Les nouvelles notifications apparaîtront ici
          </p>
        </div>
      ) : (
        <div className='space-y-3'>
          {filteredNotifications.map(notification => {
            const config = TYPE_CONFIG[notification.type] || {
              icon: Bell,
              label: notification.type,
              color: 'bg-gray-100 text-gray-700',
              iconColor: 'text-gray-600'
            }
            const Icon = config.icon

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4 transition-all ${
                  !notification.estLu
                    ? 'border-l-4 border-[#C4A060]'
                    : 'opacity-75'
                }`}
              >
                {/* Icône du type */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${config.color}`}
                >
                  <Icon size={20} className={config.iconColor} />
                </div>

                {/* Contenu */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <h3 className='font-semibold text-gray-800'>
                          {notification.titre}
                        </h3>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.color}`}
                        >
                          {config.label}
                        </span>
                        {!notification.estLu && (
                          <span className='text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700'>
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 mt-1'>
                        {notification.message}
                      </p>
                      <div className='flex items-center gap-4 mt-2 text-xs text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <Clock size={12} />
                          {formatDate(notification.dateCreation)}
                        </span>
                        {notification.typeEntite && (
                          <span className='flex items-center gap-1'>
                            <Mail size={12} />
                            {notification.typeEntite}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1 shrink-0'>
                      {!notification.estLu && (
                        <button
                          onClick={() => handleMarquerLu(notification.id)}
                          className='p-2 rounded-lg text-gray-400 hover:text-[#C4A060] hover:bg-[#F7F4EC] transition-colors'
                          title='Marquer comme lu'
                        >
                          <CheckCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => setNotificationToDelete(notification.id)}
                        className='p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors'
                        title='Supprimer la notification'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {notificationToDelete && (
        <AppModal
          title='Supprimer la notification ?'
          message='Voulez-vous vraiment supprimer cette notification ?'
          cancelLabel='Annuler'
          confirmLabel='Supprimer'
          danger
          onClose={() => setNotificationToDelete(null)}
          onConfirm={async () => {
            await handleSupprimer(notificationToDelete)
            setNotificationToDelete(null)
          }}
        />
      )}
      {modalMessage && (
        <AppModal
          title='Une erreur est survenue'
          message={modalMessage}
          onClose={() => setModalMessage(null)}
        />
      )}
    </div>
  )
}
