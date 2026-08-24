import { X } from 'lucide-react'

export default function AppModal ({
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Fermer',
  cancelLabel,
  danger = false
}) {
  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4'
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
            className='text-lg font-semibold text-slate-900'
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label='Fermer'
            className='text-slate-400 hover:text-slate-700'
          >
            <X size={20} />
          </button>
        </div>
        <p className='mt-3 text-sm leading-6 text-slate-600'>{message}</p>
        <div className='mt-6 flex justify-end gap-3'>
          {cancelLabel && (
            <button
              onClick={onClose}
              className='rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50'
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${
              danger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#D9A15C] text-[#1A1D24] hover:bg-[#cd934f]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
