import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { avisApi } from '../../api'
import AppModal from '../../components/AppModal'

const avatarColors = [
  '#1A1D24',
  '#C17A3E',
  '#D9A15C',
  '#8FA98C',
  '#7FA6C7',
  '#B98A9A'
]
function avatarColor (name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length]
}

const statusMapping = {
  en_attente: 'attente',
  publie: 'publie',
  refuse: 'refuse'
}

const reverseStatusMapping = {
  attente: 'en_attente',
  publie: 'publie',
  refuse: 'refuse'
}

const tabs = [
  { key: 'tous', label: 'Tous' },
  { key: 'attente', label: 'En attente' },
  { key: 'publie', label: 'Publié' },
  { key: 'refuse', label: 'Refusé' }
]

function counts (list) {
  return {
    attente: list.filter(r => r.status === 'attente').length,
    publie: list.filter(r => r.status === 'publie').length,
    refuse: list.filter(r => r.status === 'refuse').length
  }
}

const statusStyle = {
  attente: { bg: '#F6E9CF', color: '#B07A2E', label: 'En attente' },
  publie: { bg: '#E4F1E6', color: '#4C8B5F', label: 'Publié' },
  refuse: { bg: '#F7E1DE', color: '#C0554A', label: 'Refusé' }
}

export default function Avis () {
  const [tab, setTab] = useState('attente')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewToDelete, setReviewToDelete] = useState(null)

  useEffect(() => {
    chargerAvis()
  }, [])

  const chargerAvis = async () => {
    try {
      const data = await avisApi.getAll()
      const formattedReviews = data.map(avis => ({
        id: avis.id,
        name: avis.nomAffiche,
        stars: avis.note,
        date:
          avis.dateAvis ||
          new Date(avis.dateCreation).toISOString().split('T')[0],
        text: avis.commentaire,
        status: statusMapping[avis.statut] || 'attente'
      }))
      setReviews(formattedReviews)
    } catch (error) {
      console.error('Erreur lors du chargement des avis', error)
    } finally {
      setLoading(false)
    }
  }

  const modererAvis = async (id, action) => {
    try {
      if (action === 'approuver') {
        await avisApi.approuver(id)
      } else if (action === 'rejeter') {
        await avisApi.rejeter(id)
      }
      await chargerAvis()
    } catch (error) {
      console.error("Erreur lors de la modération de l'avis", error)
    }
  }

  const supprimerAvis = async id => {
    try {
      await avisApi.supprimer(id)
      await chargerAvis()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'avis", error)
    }
  }

  const c = counts(reviews)
  const noteMoyenne = (
    reviews
      .filter(r => r.status === 'publie')
      .reduce((s, r) => s + r.stars, 0) /
    (reviews.filter(r => r.status === 'publie').length || 1)
  ).toFixed(1)

  const filtered =
    tab === 'tous' ? reviews : reviews.filter(r => r.status === tab)

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Avis clients
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {reviews.length} avis · Note moyenne publiée : {noteMoyenne}/5
          </p>
        </div>
        <div className='flex gap-2 sm:gap-2.5'>
          <StatCard value={c.attente} label='En attente' />
          <StatCard value={c.publie} label='Publié' />
          <StatCard value={c.refuse} label='Refusé' />
        </div>
      </div>

      {/* Tabs */}
      <div className='mb-5 flex gap-5 sm:gap-7 overflow-x-auto border-b border-[#E2DCCB]'>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 -mb-px flex items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'border-[#D9A15C] text-[#C17A3E]'
                : 'border-transparent text-[#5C5847] hover:text-[#1A1D24]'
            }`}
          >
            {t.label}
            {t.key === 'attente' && c.attente > 0 && (
              <span className='flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1D24] text-[11px] font-bold text-white'>
                {c.attente}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='flex flex-col gap-4'>
        {filtered.map(r => (
          <div
            key={r.id}
            className='rounded-2xl border border-[#EAE4D6] bg-white px-4 sm:px-5 py-4'
          >
            <div className='flex flex-wrap items-start justify-between gap-2'>
              <div className='flex items-center gap-2.5'>
                <span
                  className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white'
                  style={{ background: avatarColor(r.name) }}
                >
                  {r.name[0]}
                </span>
                <div>
                  <div className='text-sm font-bold text-[#1A1D24]'>
                    {r.name}
                  </div>
                  <div className='mt-0.5 text-xs text-[#8A8471]'>
                    <span className='text-[#D9A15C]'>
                      {'★'.repeat(r.stars)}
                    </span>
                    <span className='text-[#DCD5C4]'>
                      {'★'.repeat(5 - r.stars)}
                    </span>{' '}
                    {r.date}
                  </div>
                </div>
              </div>
              <span
                className='shrink-0 rounded-full px-3 py-1 text-xs font-bold'
                style={{
                  background: statusStyle[r.status].bg,
                  color: statusStyle[r.status].color
                }}
              >
                {statusStyle[r.status].label}
              </span>
            </div>

            <p className='my-3.5 text-sm italic text-[#5C5847]'>"{r.text}"</p>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='flex gap-2.5'>
                {r.status !== 'publie' && (
                  <button
                    onClick={() => modererAvis(r.id, 'approuver')}
                    className='flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full bg-[#E4F1E6] px-3.5 py-1.5 text-[13px] font-semibold text-[#4C8B5F] hover:bg-[#d8ebdb] transition-colors'
                  >
                    <Check size={13} /> Publier
                  </button>
                )}
                {r.status !== 'refuse' && (
                  <button
                    onClick={() => modererAvis(r.id, 'rejeter')}
                    className='flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full bg-[#F7E1DE] px-3.5 py-1.5 text-[13px] font-semibold text-[#C0554A] hover:bg-[#f2d3cf] transition-colors'
                  >
                    <X size={13} /> Refuser
                  </button>
                )}
              </div>
              <button
                onClick={() => setReviewToDelete(r)}
                className='text-[13px] font-medium text-[#C0554A] hover:underline self-start sm:self-auto'
              >
                {r.status === 'publie' ? 'Retirer' : 'Supprimer'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className='py-14 text-center text-sm text-[#8A8471]'>
            Aucun avis dans cette catégorie.
          </div>
        )}
      </div>
      {reviewToDelete && (
        <AppModal
          title={
            reviewToDelete.status === 'publie'
              ? 'Retirer l’avis publié ?'
              : 'Supprimer l’avis ?'
          }
          message={`L’avis de ${reviewToDelete.name} sera retiré définitivement du site.`}
          cancelLabel='Annuler'
          confirmLabel={
            reviewToDelete.status === 'publie' ? 'Retirer' : 'Supprimer'
          }
          danger
          onClose={() => setReviewToDelete(null)}
          onConfirm={async () => {
            await supprimerAvis(reviewToDelete.id)
            setReviewToDelete(null)
          }}
        />
      )}
    </div>
  )
}

function StatCard ({ value, label }) {
  return (
    <div className='min-w-[74px] flex-1 sm:flex-none rounded-lg border border-[#EAE4D6] bg-white px-3 sm:px-5 py-2.5 text-center'>
      <div className='text-base sm:text-lg font-bold text-[#1A1D24]'>
        {value}
      </div>
      <div className='mt-0.5 text-[11px] text-[#8A8471]'>{label}</div>
    </div>
  )
}
