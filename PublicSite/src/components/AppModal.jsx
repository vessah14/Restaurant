import { X } from 'lucide-react'

export default function AppModal ({
  title,
  message,
  onClose,
  confirmLabel = 'Fermer'
}) {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='app-modal-title'
      onClick={onClose}
    >
      <div
        className='w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'
        onClick={event => event.stopPropagation()}
      >
        <div className='flex items-start justify-between gap-4'>
          <h2
            id='app-modal-title'
            className='text-lg font-semibold text-gray-900'
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label='Fermer'
            className='text-gray-400 hover:text-gray-700'
          >
            <X size={20} />
          </button>
        </div>
        <p className='mt-3 text-sm leading-6 text-gray-600'>{message}</p>
        <button
          onClick={onClose}
          className='mt-6 w-full rounded-lg bg-[#c9a55c] py-2.5 text-sm font-semibold text-white hover:bg-[#b8944d]'
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
