import { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { pagesApi } from '../../api'
import AppModal from '../../components/AppModal'

const pageLabels = {
  accueil: { label: 'Accueil', path: '/' },
  carte: { label: 'La Carte', path: '/Carte' },
  reservation: { label: 'Réservation', path: '/Reserver' },
  'notre-histoire': { label: 'Notre histoire', path: '/About' },
  contact: { label: 'Contact', path: '/Contact' },
  faq: { label: 'FAQ', path: '/FAQ' }
}

function getPageScore (page) {
  const fields = [page.metaTitre, page.metaDescription, page.contenu]
  return Math.round(
    (fields.filter(value => value?.trim()).length * 100) / fields.length
  )
}

function decoratePage (page) {
  const details = pageLabels[page.slug] || {
    label: page.slug,
    path: `/${page.slug}`
  }
  return { ...page, ...details, key: page.slug, score: getPageScore(page) }
}

function scoreColor (score) {
  if (score >= 85) return '#4C8B5F'
  if (score >= 70) return '#D9A15C'
  return '#C0554A'
}

function scoreLabel (score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Bon'
  return 'À améliorer'
}

export default function SEO () {
  const [pages, setPages] = useState([])
  const [active, setActive] = useState(null)
  const [pageData, setPageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalMessage, setModalMessage] = useState(null)
  const page = pages.find(p => p.key === active)

  useEffect(() => {
    pagesApi
      .getAll()
      .then(data => {
        const loadedPages = data.map(decoratePage)
        setPages(loadedPages)
        setActive(current =>
          current && loadedPages.some(item => item.key === current)
            ? current
            : loadedPages[0]?.key || null
        )
      })
      .catch(() => {
        setError('Impossible de charger les pages depuis le backend.')
      })
  }, [])

  useEffect(() => {
    if (!active) return
    setLoading(true)
    setPageData(null)
    chargerPageData()
  }, [active])

  const chargerPageData = async () => {
    try {
      const data = await pagesApi.getBySlug(active, 'fr')
      setPageData(data)
      setPages(current =>
        current.map(item => (item.key === active ? decoratePage(data) : item))
      )
    } catch (error) {
      console.error('Erreur lors du chargement des données de la page', error)
    } finally {
      setLoading(false)
    }
  }

  const sauvegarderPage = async () => {
    try {
      await pagesApi.modifier(active, {
        titreFr: pageData?.titre || '',
        contenuFr: pageData?.contenu || '',
        metaTitreFr: pageData?.metaTitre || '',
        metaDescriptionFr: pageData?.metaDescription || ''
      })
      await chargerPageData()
      setModalMessage({
        title: 'Modifications enregistrées',
        message: 'Les modifications ont bien été enregistrées.'
      })
    } catch (error) {
      console.error('Erreur lors de la sauvegarde', error)
      setModalMessage({
        title: 'Erreur',
        message: 'Erreur lors de la sauvegarde.'
      })
    }
  }

  const handleChange = (field, value) => {
    setPageData(prev => ({ ...prev, [field]: value }))
  }

  const d = pageData || {
    metaTitre: '',
    metaDescription: '',
    contenu: ''
  }

  if (error) {
    return <div className='p-8 text-sm text-[#C0554A]'>{error}</div>
  }

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
          SEO &amp; Visibilité
        </h1>
        <p className='mt-1 text-[13px] text-[#8A8471]'>
          Optimisation pour les recherches locales — restaurant près de
          Notre-Dame de Paris
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[320px_1fr] items-start gap-5'>
        {/* Left: pages list */}
        <div>
          <div className='mb-2.5 text-[11px] font-bold tracking-[0.05em] text-[#8A8471]'>
            PAGES DU SITE
          </div>
          <div className='flex gap-2.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0'>
            {pages.map(p => (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className={`shrink-0 w-56 lg:w-auto rounded-xl border px-4 py-3 text-left ${
                  active === p.key
                    ? 'border-[#EAE4D6] bg-white'
                    : 'border-transparent bg-transparent'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <div className='text-sm font-semibold text-[#1A1D24]'>
                      {p.label}
                    </div>
                    <div className='text-xs text-[#8A8471]'>{p.path}</div>
                  </div>
                  <div
                    className='text-base font-bold'
                    style={{ color: scoreColor(p.score) }}
                  >
                    {p.score}
                  </div>
                </div>
                <div className='mt-2 h-1 overflow-hidden rounded-full bg-[#EAE4D6]'>
                  <div
                    className='h-full'
                    style={{
                      width: `${p.score}%`,
                      background: scoreColor(p.score)
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: detail panel */}
        <div className='rounded-2xl border border-[#EAE4D6] bg-white p-5 sm:p-6'>
          {!page && (
            <p className='text-sm text-[#8A8471]'>
              Aucune page disponible dans le backend.
            </p>
          )}
          {page && (
            <>
              <div className='mb-1.5 text-base font-bold text-[#1A1D24]'>
                SEO — {page.label}
              </div>
              <div className='mb-5 flex flex-wrap items-center gap-2.5'>
                <div className='h-1.5 max-w-40 flex-1 overflow-hidden rounded-full bg-[#EAE4D6]'>
                  <div
                    className='h-full'
                    style={{
                      width: `${page.score}%`,
                      background: scoreColor(page.score)
                    }}
                  />
                </div>
                <span
                  className='text-[13px] font-semibold'
                  style={{ color: scoreColor(page.score) }}
                >
                  {page.score}/100 · {scoreLabel(page.score)}
                </span>
              </div>

              <Field
                label='TITRE SEO'
                count={`(${d.metaTitre?.length || 0}/65)`}
                error={(d.metaTitre?.length || 0) > 65}
                value={d.metaTitre || ''}
                onChange={e => handleChange('metaTitre', e.target.value)}
              />

              <Field
                label='MÉTA-DESCRIPTION'
                count={`(${d.metaDescription?.length || 0}/160)`}
                value={d.metaDescription || ''}
                textarea
                onChange={e => handleChange('metaDescription', e.target.value)}
              />

              <Field
                label='CONTENU'
                value={d.contenu || ''}
                textarea
                onChange={e => handleChange('contenu', e.target.value)}
              />

              <div className='mb-5 rounded-lg border border-[#EAE4D6] bg-[#F7F4EC] px-4 py-3.5 overflow-hidden'>
                <div className='mb-1.5 text-xs text-[#8A8471]'>
                  Aperçu Google
                </div>
                <div className='text-[15px] font-medium text-[#1A0DAB] truncate'>
                  {d.metaTitre || 'Titre de la page'}
                </div>
                <div className='my-0.5 text-xs text-[#4C8B5F] truncate'>
                  lesdeuxcolombes.fr/{active}
                </div>
                <div className='text-[13px] text-[#5C5847] line-clamp-2 sm:line-clamp-none'>
                  {d.metaDescription || 'Description de la page'}
                </div>
              </div>

              <button
                onClick={sauvegarderPage}
                className='w-full rounded-lg bg-[#0B1F3A] py-3.5 text-sm font-bold text-white hover:bg-[#132a4d] transition-colors'
              >
                Enregistrer les modifications
              </button>
            </>
          )}
        </div>
      </div>
      {modalMessage && (
        <AppModal
          title={modalMessage.title}
          message={modalMessage.message}
          onClose={() => setModalMessage(null)}
        />
      )}
    </div>
  )
}

function Field ({ label, count, value, textarea, error, onChange }) {
  return (
    <div className='mb-5'>
      <div className='mb-2 text-xs font-bold tracking-[0.03em] text-[#C17A3E]'>
        {label}{' '}
        {count && (
          <span
            className={`font-semibold ${
              error ? 'text-[#C0554A]' : 'text-[#8A8471]'
            }`}
          >
            {count}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={3}
          className='w-full resize-y rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24]'
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border px-4 py-3 text-sm text-[#1A1D24] ${
            error ? 'border-[1.5px] border-[#C0554A]' : 'border-[#E2DCCB]'
          }`}
        />
      )}
    </div>
  )
}
