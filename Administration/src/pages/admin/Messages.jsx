import { useState, useEffect } from 'react'
import {
  FaRegEnvelope,
  FaCheck,
  FaReply,
  FaTrash,
  FaEye
} from 'react-icons/fa6'
import { contactMessagesApi } from '../../api'
import AppModal from '../../components/AppModal'

export default function Messages () {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [messageToDelete, setMessageToDelete] = useState(null)

  useEffect(() => {
    chargerMessages()
  }, [filter])

  const chargerMessages = async () => {
    try {
      setLoading(true)
      const data = await contactMessagesApi.getAll(
        filter === 'all' ? null : filter
      )
      setMessages(data)
    } catch (error) {
      console.error('Erreur lors du chargement des messages', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarquerLu = async id => {
    try {
      await contactMessagesApi.marquerLu(id)
      chargerMessages()
    } catch (error) {
      console.error('Erreur lors du marquage comme lu', error)
    }
  }

  const handleRepondre = async () => {
    if (!selectedMessage || !replyText.trim()) return

    try {
      await contactMessagesApi.repondre(selectedMessage.id, replyText)
      setShowReplyModal(false)
      setReplyText('')
      setSelectedMessage(null)
      chargerMessages()
    } catch (error) {
      console.error('Erreur lors de la réponse', error)
    }
  }

  const handleSupprimer = async id => {
    try {
      await contactMessagesApi.supprimer(id)
      chargerMessages()
    } catch (error) {
      console.error('Erreur lors de la suppression', error)
    }
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatutBadge = statut => {
    const badges = {
      nouveau: 'bg-blue-100 text-blue-700',
      lu: 'bg-yellow-100 text-yellow-700',
      repondu: 'bg-green-100 text-green-700'
    }
    return badges[statut] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Messages
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {messages.length} message{messages.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className='flex gap-2'>
          {['all', 'nouveau', 'lu', 'repondu'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f
                  ? 'bg-[#D9A15C] text-[#1A1D24]'
                  : 'bg-white text-[#5C5847] hover:bg-[#F7F4EC]'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className='space-y-4'>
        {messages.length === 0 ? (
          <div className='bg-white rounded-lg p-12 text-center'>
            <p className='text-gray-600'>Aucun message pour le moment.</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition'
            >
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutBadge(
                        message.statut
                      )}`}
                    >
                      {message.statut.charAt(0).toUpperCase() +
                        message.statut.slice(1)}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {formatDate(message.dateCreation)}
                    </span>
                  </div>

                  <div className='flex items-center gap-2 mb-2'>
                    <h3 className='font-semibold text-[#1A1D24]'>
                      {message.nom}
                    </h3>
                    <span className='text-gray-400'>•</span>
                    <span className='text-sm text-gray-600'>
                      {message.email}
                    </span>
                    {message.telephone && (
                      <>
                        <span className='text-gray-400'>•</span>
                        <span className='text-sm text-gray-600'>
                          {message.telephone}
                        </span>
                      </>
                    )}
                  </div>

                  <p className='text-sm font-medium text-[#D9A15C] mb-2'>
                    {message.sujet}
                  </p>
                  <p className='text-sm text-gray-700 line-clamp-2'>
                    {message.message}
                  </p>

                  {message.reponse && (
                    <div className='mt-3 p-3 bg-green-50 rounded-lg'>
                      <p className='text-xs font-semibold text-green-700 mb-1'>
                        Réponse envoyée :
                      </p>
                      <p className='text-sm text-green-800'>
                        {message.reponse}
                      </p>
                      {message.dateReponse && (
                        <p className='text-xs text-green-600 mt-1'>
                          {formatDate(message.dateReponse)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className='flex items-center gap-2'>
                  {message.statut === 'nouveau' && (
                    <button
                      onClick={() => handleMarquerLu(message.id)}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition'
                      title='Marquer comme lu'
                    >
                      <FaEye size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedMessage(message)
                      setShowReplyModal(true)
                      setReplyText('')
                    }}
                    className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition'
                    title='Répondre'
                  >
                    <FaReply size={16} />
                  </button>
                  <button
                    onClick={() => setMessageToDelete(message.id)}
                    className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                    title='Supprimer'
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-lg p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-bold text-[#1A1D24]'>
                Répondre au message
              </h2>
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setSelectedMessage(null)
                  setReplyText('')
                }}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                <span className='text-gray-400 text-xl'>×</span>
              </button>
            </div>

            <div className='mb-4 p-4 bg-gray-50 rounded-lg'>
              <p className='text-sm font-semibold text-gray-700'>
                {selectedMessage.nom}
              </p>
              <p className='text-sm text-gray-600'>{selectedMessage.email}</p>
              <p className='text-sm font-medium text-[#D9A15C] mt-2'>
                {selectedMessage.sujet}
              </p>
              <p className='text-sm text-gray-700 mt-2'>
                {selectedMessage.message}
              </p>
            </div>

            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder='Votre réponse...'
              rows={6}
              className='w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D9A15C] mb-4'
            />

            <div className='flex gap-3'>
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setSelectedMessage(null)
                  setReplyText('')
                }}
                className='flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-[#1A1D24] hover:bg-gray-50 transition-colors'
              >
                Annuler
              </button>
              <button
                onClick={handleRepondre}
                className='flex-1 rounded-lg bg-[#D9A15C] py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors'
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
      {messageToDelete && (
        <AppModal
          title='Supprimer le message ?'
          message='Êtes-vous sûr de vouloir supprimer ce message ?'
          cancelLabel='Annuler'
          confirmLabel='Supprimer'
          danger
          onClose={() => setMessageToDelete(null)}
          onConfirm={async () => {
            await handleSupprimer(messageToDelete)
            setMessageToDelete(null)
          }}
        />
      )}
    </div>
  )
}
