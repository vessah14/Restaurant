import { CheckCircle, X } from 'lucide-react'

export default function ToastNotification ({ message, onClose }) {
  return (
    <div
      className='fixed inset-x-4 top-4 z-[70] mx-auto flex max-w-md items-start gap-3 rounded-xl border border-[#d8c18d] bg-white px-4 py-3 text-gray-800 shadow-xl sm:inset-x-auto sm:right-6 sm:left-auto'
      role='alert'
    >
      <CheckCircle className='mt-0.5 shrink-0 text-[#4C8B5F]' size={19} />
      <p className='flex-1 text-sm leading-5'>{message}</p>
      <button
        onClick={onClose}
        aria-label='Fermer'
        className='shrink-0 text-gray-400 hover:text-gray-700'
      >
        <X size={18} />
      </button>
    </div>
  )
}
