import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { statistiquesApi } from '../../api'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const seriesMap = {
  Visiteurs: [],
  Réservations: [],
  Inscrits: []
}

const pages = [
  { label: 'Accueil', value: 5600, pct: 45 },
  { label: 'La Carte', value: 3480, pct: 28 },
  { label: 'Réservation', value: 2240, pct: 18 },
  { label: 'Notre histoire', value: 1120, pct: 9 }
]

const funnel = [
  { label: 'Visite', value: 12458, pct: 100, shade: 'bg-[#B9B3A2]' },
  { label: 'Carte', value: 7400, pct: 59, shade: 'bg-[#8D8672]' },
  { label: 'Réservation', value: 3100, pct: 25, shade: 'bg-[#5A5548]' },
  { label: 'Confirmée', value: 1840, pct: 15, shade: 'bg-[#1B2333]' }
]

const periods = [
  "Aujourd'hui",
  '7 derniers jours',
  '30 derniers jours',
  '3 mois',
  '12 mois'
]

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function formatNumber (n) {
  return n.toLocaleString('fr-FR')
}

function CustomTooltip ({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className='rounded-lg border border-[#E7E1D2] bg-white px-3 py-2 shadow-md'>
      <div className='text-xs text-[#9C9686]'>{label}</div>
      <div className='text-sm font-semibold text-[#1B2333]'>
        {formatNumber(payload[0].value)}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StatistiquesDashboard () {
  const [period, setPeriod] = useState('30 derniers jours')
  const [metric, setMetric] = useState('Visiteurs')
  const [series, setSeries] = useState(seriesMap)

  useEffect(() => {
    statistiquesApi
      .getDashboard()
      .then(data => {
        const trafic = data.traficJournalier || []

        setSeries({
          Visiteurs: trafic.map(item => ({
            mois: item.jour,
            valeur: item.visiteurs
          })),
          Réservations: trafic.map(item => ({
            mois: item.jour,
            valeur: item.reservations
          })),
          Inscrits: [
            { mois: 'Total', valeur: data.nombreUtilisateursInscrits || 0 }
          ]
        })
      })
      .catch(error => {
        console.error('Erreur chargement statistiques détaillées', error)
      })
  }, [])

  const chartData = series[metric]

  return (
    <div className='min-h-screen w-full bg-[#EFEBE1] p-6 font-sans text-[#1B2333]'>
      <div className='mx-auto max-w-[1600px]'>
        {/* Header */}
        <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
          <div>
            <h1 className='font-serif text-3xl tracking-tight text-[#1B2333]'>
              Statistiques
            </h1>
            <p className='mt-1 text-sm text-[#9C9686]'>
              Analyse de l'activité du site
            </p>
          </div>

          <div className='flex items-center gap-1 rounded-full bg-white/60 p-1'>
            {periods.map(p => {
              const active = p === period
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={[
                    'rounded-full px-4 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-[#C99A3B] font-medium text-white shadow-sm'
                      : 'text-[#6B6459] hover:text-[#1B2333]'
                  ].join(' ')}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        {/* Évolution mensuelle */}
        <div className='mb-6 rounded-2xl border border-[#E7E1D2] bg-white p-6 shadow-sm'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
            <h2 className='text-base font-semibold text-[#1B2333]'>
              Évolution mensuelle
            </h2>
            <div className='flex items-center gap-1 rounded-full bg-[#F4F1EA] p-1'>
              {Object.keys(series).map(m => {
                const active = m === metric
                return (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={[
                      'rounded-full px-4 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-[#1B2333] font-medium text-white shadow-sm'
                        : 'text-[#6B6459] hover:text-[#1B2333]'
                    ].join(' ')}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='fillArea' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#1B2333' stopOpacity={0.18} />
                    <stop offset='100%' stopColor='#1B2333' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke='#E7E1D2'
                  strokeDasharray='4 4'
                />
                <XAxis
                  dataKey='mois'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9C9686', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  domain={[0, 16000]}
                  ticks={[0, 4000, 8000, 12000, 16000]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9C9686', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type='monotone'
                  dataKey='valeur'
                  stroke='#1B2333'
                  strokeWidth={2}
                  fill='url(#fillArea)'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two column: Pages + Tunnel */}
        <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Pages les plus consultées */}
          <div className='rounded-2xl border border-[#E7E1D2] bg-white p-6 shadow-sm'>
            <h2 className='mb-5 text-base font-semibold text-[#1B2333]'>
              Pages les plus consultées
            </h2>
            <div className='space-y-4'>
              {pages.map((p, i) => (
                <div key={p.label} className='flex items-center gap-3'>
                  <span className='w-4 shrink-0 text-sm text-[#9C9686]'>
                    {i + 1}
                  </span>
                  <div className='flex-1'>
                    <div className='mb-1.5 flex items-baseline justify-between'>
                      <span className='text-sm text-[#1B2333]'>{p.label}</span>
                      <span className='text-sm font-semibold text-[#1B2333]'>
                        {formatNumber(p.value)}
                      </span>
                    </div>
                    <div className='h-1.5 w-full overflow-hidden rounded-full bg-[#F4EFDF]'>
                      <div
                        className='h-full rounded-full bg-[#C99A3B]'
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className='w-9 shrink-0 text-right text-sm text-[#9C9686]'>
                    {p.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tunnel de conversion */}
          <div className='rounded-2xl border border-[#E7E1D2] bg-white p-6 shadow-sm'>
            <h2 className='mb-5 text-base font-semibold text-[#1B2333]'>
              Tunnel de conversion
            </h2>
            <div className='space-y-4'>
              {funnel.map(f => (
                <div key={f.label}>
                  <div className='mb-1.5 flex items-baseline justify-between'>
                    <span className='text-sm text-[#1B2333]'>{f.label}</span>
                    <span className='text-sm text-[#9C9686]'>
                      {formatNumber(f.value)} &middot; {f.pct}%
                    </span>
                  </div>
                  <div className='h-8 w-full overflow-hidden rounded-md bg-[#F4F1EA]'>
                    <div
                      className={`h-full rounded-md ${f.shade}`}
                      style={{ width: `${f.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-5 text-sm text-[#6B6459]'>
              Taux de conversion :{' '}
              <span className='font-semibold text-[#C99A3B]'>14.8%</span>
            </div>
          </div>
        </div>

        {/* Réservations & Avis */}
        <div className='rounded-2xl border border-[#E7E1D2] bg-white p-6 shadow-sm'>
          <h2 className='mb-2 text-base font-semibold text-[#1B2333]'>
            Réservations &amp; Avis — évolution sur 12 mois
          </h2>
          <p className='text-sm text-[#9C9686]'>
            (Section à compléter — même structure de graphique que ci-dessus)
          </p>
        </div>
      </div>
    </div>
  )
}
