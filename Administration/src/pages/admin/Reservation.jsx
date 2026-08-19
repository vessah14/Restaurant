import { useState, useMemo, useEffect } from 'react'
import { Check, X, Search, Calendar } from 'lucide-react'
import { reservationsApi } from '../../api'
import { useAuthAdmin } from '../../context/AuthAdminContext'

const STATUS_OPTIONS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' }
]

function refFromId (id) {
  return `LDC-${String(id).padStart(4, '0')}`
}

function ReservationModal ({ reservation, onClose, onStatusChange, onDelete }) {
  if (!reservation) return null

  const handleDelete = () => {
    if (
      window.confirm(
        `Supprimer définitivement la réservation de ${reservation.client} ?`
      )
    ) {
      onDelete?.(reservation.id)
      onClose?.()
    }
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[1px] p-4'
      onClick={onClose}
    >
      <div
        className='w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-start justify-between bg-[#0d1826] px-5 sm:px-6 py-5'>
          <div className='min-w-0'>
            <h2 className='font-serif text-lg font-semibold text-white truncate'>
              {reservation.client}
            </h2>
            <p className='mt-0.5 text-xs font-medium text-[#C4A060]'>
              Réf. {refFromId(reservation.id)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label='Fermer'
            className='shrink-0 text-slate-400 hover:text-white transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='px-5 sm:px-6 py-5 space-y-4'>
          <Row label='Date' value={reservation.date} />
          <Row label='Heure' value={reservation.heure} />
          <Row label='Personnes' value={reservation.pers} />
          <Row label='Téléphone' value={reservation.tel} />
          <Row label='Email' value={reservation.email} />

          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1'>
            <span className='text-xs font-semibold tracking-wide text-slate-500 uppercase'>
              Statut
            </span>
            <select
              value={reservation.statut}
              onChange={e => onStatusChange?.(reservation.id, e.target.value)}
              className='w-full sm:w-auto rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C4A060]'
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex items-center gap-3 px-5 sm:px-6 pb-6 pt-1'>
          <button
            onClick={handleDelete}
            className='flex-1 rounded-full border border-red-300 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors'
          >
            Supprimer
          </button>
          <button
            onClick={onClose}
            className='flex-[2] rounded-full bg-[#C4A060] py-2.5 text-sm font-semibold text-[#0d1826] hover:bg-[#C4A060]/90 transition-colors'
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

function Row ({ label, value }) {
  return (
    <div className='flex items-center justify-between gap-3'>
      <span className='text-xs font-semibold tracking-wide text-slate-500 uppercase shrink-0'>
        {label}
      </span>
      <span className='text-sm text-slate-800 text-right truncate'>
        {value}
      </span>
    </div>
  )
}

function CalendarView ({ reservations, onSelect }) {
  const groups = useMemo(() => {
    const map = new Map()
    const sorted = [...reservations].sort((a, b) =>
      `${a.date}${a.heure}`.localeCompare(`${b.date}${b.heure}`)
    )
    for (const r of sorted) {
      if (!map.has(r.date)) map.set(r.date, [])
      map.get(r.date).push(r)
    }
    return Array.from(map.entries())
  }, [reservations])

  if (groups.length === 0) {
    return (
      <div className='rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-400'>
        Aucune réservation ne correspond à ta recherche.
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {groups.map(([date, items]) => (
        <div
          key={date}
          className='rounded-xl border border-slate-200 bg-white overflow-hidden'
        >
          <div className='flex items-center gap-2 bg-[#faf7ee] px-4 sm:px-5 py-3'>
            <Calendar size={15} className='text-[#C4A060] shrink-0' />
            <span className='text-sm font-semibold text-slate-800'>{date}</span>
            <span className='text-xs text-slate-400'>
              {items.length} réservation(s)
            </span>
          </div>
          <div className='divide-y divide-slate-100'>
            {items.map(r => {
              const status = STATUS_STYLES[r.statut]
              return (
                <button
                  key={r.id}
                  onClick={() => onSelect(r)}
                  className='flex w-full items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 text-left hover:bg-slate-50/60 transition-colors'
                >
                  <span className='w-12 sm:w-14 shrink-0 text-sm font-semibold text-[#C4A060]'>
                    {r.heure}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-slate-800 truncate'>
                      {r.client}
                    </p>
                    <p className='text-xs text-slate-500'>{r.pers} personnes</p>
                  </div>
                  <span
                    className={`shrink-0 inline-block rounded-md px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium ${status.className}`}
                  >
                    {status.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}


const STATUS_STYLES = {
  en_attente: { label: 'En attente', className: 'bg-amber-50 text-amber-700' },
  confirmee: {
    label: 'Confirmée',
    className: 'bg-emerald-50 text-emerald-700'
  },
  terminee: { label: 'Terminée', className: 'bg-slate-100 text-slate-500' },
  annulee: { label: 'Annulée', className: 'bg-red-50 text-red-600' }
}

const COLUMNS = [
  'Client',
  'Date',
  'Heure',
  'Pers.',
  'Téléphone',
  'Email',
  'Statut',
  'Actions'
]

const FILTER_TABS = [
  { value: 'tous', label: 'Tous' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' }
]

// Carte utilisée sur mobile à la place d'une ligne de tableau
function ReservationCard ({ r, onSelect, onConfirm, onCancel }) {
  const status = STATUS_STYLES[r.statut]
  const isFinal = r.statut === 'annulee' || r.statut === 'terminee'
  return (
    <div className='rounded-xl border border-slate-200 bg-white p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='font-medium text-slate-800 truncate'>{r.client}</p>
          <p className='text-xs text-slate-500 mt-0.5'>
            {r.date} · {r.heure} · {r.pers} pers.
          </p>
        </div>
        <span
          className={`shrink-0 inline-block rounded-md px-2.5 py-1 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>
      <div className='mt-2 text-xs text-slate-500 space-y-0.5'>
        <p className='truncate'>{r.tel}</p>
        <p className='truncate'>{r.email}</p>
      </div>
      <div className='mt-3 flex items-center gap-2'>
        <button
          onClick={() => onSelect(r)}
          className='flex-1 rounded-full border border-slate-200 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50'
        >
          Voir
        </button>
        {r.statut === 'en_attente' && (
          <button
            onClick={() => onConfirm(r)}
            aria-label='Confirmer la réservation'
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
          >
            <Check size={14} strokeWidth={2.5} />
          </button>
        )}
        {!isFinal && (
          <button
            onClick={() => onCancel(r)}
            aria-label='Annuler la réservation'
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-red-500 hover:bg-red-50'
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}

function ReservationsPage ({
  onStatusChange,
  onDelete
}) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('tous')
  const [view, setView] = useState('tableau')

  useEffect(() => {
    chargerReservations()
  }, [])

  const chargerReservations = async () => {
    try {
      const data = await reservationsApi.getAll()
      const formattedReservations = data.map(resa => ({
        id: resa.id,
        client: `${resa.nom} ${resa.prenom}`,
        date: new Date(resa.dateReservation).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        heure: resa.heureReservation,
        pers: resa.nombrePersonnes,
        tel: resa.telephone,
        email: resa.email,
        statut: resa.statut
      }))
      setReservations(formattedReservations)
    } catch (error) {
      console.error('Erreur lors du chargement des réservations', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, statut) => {
    try {
      await reservationsApi.modifierStatut(id, statut)
      await chargerReservations()
      onStatusChange?.(id, statut)
      setSelected(prev => (prev && prev.id === id ? { ...prev, statut } : prev))
    } catch (error) {
      console.error('Erreur lors de la modification du statut', error)
    }
  }

  const handleConfirm = r => updateStatus(r.id, 'confirmee')
  const handleCancel = r => updateStatus(r.id, 'annulee')
  const handleDelete = async (id) => {
    try {
      await reservationsApi.modifierStatut(id, 'annulee')
      await chargerReservations()
      onDelete?.(id)
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation', error)
    }
  }

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      const matchesFilter = filter === 'tous' || r.statut === filter
      const matchesQuery = r.client.toLowerCase().includes(query.toLowerCase())
      return matchesFilter && matchesQuery
    })
  }, [reservations, filter, query])

  return (
    <div>
      <div className='mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl font-semibold text-slate-900'>
            Réservations
          </h1>
          <p className='mt-0.5 text-sm text-slate-500'>
            {reservations.length} réservations au total
          </p>
        </div>
        <div className='flex items-center gap-1 rounded-full border border-slate-200 p-1 self-start sm:self-auto'>
          <button
            onClick={() => setView('tableau')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'tableau'
                ? 'bg-[#C4A060] text-[#0d1826]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Tableau
          </button>
          <button
            onClick={() => setView('calendrier')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === 'calendrier'
                ? 'bg-[#C4A060] text-[#0d1826]'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Calendrier
          </button>
        </div>
      </div>

      <div className='mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4'>
        <div className='relative flex-1'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Rechercher un client...'
            className='w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400'
          />
        </div>
        <div className='flex items-center gap-1 rounded-full border border-slate-200 p-1 overflow-x-auto no-scrollbar'>
          {FILTER_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-[#0d1826] text-white'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'tableau' ? (
        <>
          {/* Vue cartes - mobile / tablette */}
          <div className='lg:hidden space-y-3'>
            {filtered.map(r => (
              <ReservationCard
                key={r.id}
                r={r}
                onSelect={setSelected}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            ))}
            {filtered.length === 0 && (
              <div className='rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-400'>
                Aucune réservation ne correspond à ta recherche.
              </div>
            )}
          </div>

          {/* Vue tableau - desktop uniquement */}
          <div className='hidden lg:block rounded-xl border border-slate-200 bg-white overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-[#faf7ee] text-left'>
                  {COLUMNS.map(col => (
                    <th
                      key={col}
                      className='px-5 py-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase whitespace-nowrap'
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {filtered.map(r => {
                  const status = STATUS_STYLES[r.statut]
                  const isFinal =
                    r.statut === 'annulee' || r.statut === 'terminee'
                  return (
                    <tr
                      key={r.id}
                      className='hover:bg-slate-50/60 transition-colors'
                    >
                      <td className='px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap'>
                        {r.client}
                      </td>
                      <td className='px-5 py-3.5 text-slate-500 whitespace-nowrap'>
                        {r.date}
                      </td>
                      <td className='px-5 py-3.5 text-slate-500 whitespace-nowrap'>
                        {r.heure}
                      </td>
                      <td className='px-5 py-3.5 text-slate-500'>{r.pers}</td>
                      <td className='px-5 py-3.5 text-slate-500 whitespace-nowrap'>
                        {r.tel}
                      </td>
                      <td className='px-5 py-3.5 text-slate-500 whitespace-nowrap'>
                        {r.email}
                      </td>
                      <td className='px-5 py-3.5'>
                        <span
                          className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className='px-5 py-3.5'>
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={() => setSelected(r)}
                            className='text-slate-600 hover:text-slate-900 font-medium'
                          >
                            Voir
                          </button>
                          {r.statut === 'en_attente' && (
                            <button
                              onClick={() => handleConfirm(r)}
                              aria-label='Confirmer la réservation'
                              className='flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors'
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                          )}
                          {!isFinal && (
                            <button
                              onClick={() => handleCancel(r)}
                              aria-label='Annuler la réservation'
                              className='flex h-6 w-6 items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors'
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className='px-5 py-8 text-center text-sm text-slate-400'
                    >
                      Aucune réservation ne correspond à ta recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <CalendarView reservations={filtered} onSelect={setSelected} />
      )}

      <ReservationModal
        reservation={selected}
        onClose={() => setSelected(null)}
        onStatusChange={updateStatus}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default function Reservation () {
  return (
    <section>
      <ReservationsPage />
    </section>
  )
}
