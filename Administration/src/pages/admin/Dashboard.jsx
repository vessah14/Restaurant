import { useState, useEffect, useRef } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  FaBinoculars,
  FaRegCalendarCheck,
  FaUsers,
  FaStar,
  FaRegEnvelope,
  FaRegHourglass
} from 'react-icons/fa6'
import { statistiquesApi, reservationsApi } from '../../api'
import StatistiquesDashboard from './StatistiquesDashboard'

const GOLD = '#C4A060'

export default function Dashboard () {
  const [periode, setPeriode] = useState('7j')
  const [activeView, setActiveView] = useState('overview')

  const [stats, setStats] = useState({
    visiteursMois: 0,
    visiteursEvolution: 0,
    reservations: 0,
    reservationsEvolution: 0,
    clientsInscrits: 0,
    clientsEvolution: 0,
    noteMoyenne: 0,
    noteEvolution: 0,
    repartitionNotes: [],
    avisAValider: 0,
    resaEnAttente: 0
  })

  const [trafic, setTrafic] = useState([
    { day: 'Lun', visiteurs: 0, reservations: 0 },
    { day: 'Mar', visiteurs: 0, reservations: 0 },
    { day: 'Mer', visiteurs: 0, reservations: 0 },
    { day: 'Jeu', visiteurs: 0, reservations: 0 },
    { day: 'Ven', visiteurs: 0, reservations: 0 },
    { day: 'Sam', visiteurs: 0, reservations: 0 },
    { day: 'Dim', visiteurs: 0, reservations: 0 }
  ])

  const [sourcesTrafic, setSourcesTrafic] = useState([])

  const [horaires, setHoraires] = useState([])

  const [reservationsRecentes, setReservationsRecentes] = useState([])
  const [chargement, setChargement] = useState(true)
  const chargementLance = useRef(false)

  useEffect(() => {
    if (chargementLance.current) return

    chargementLance.current = true
    chargerDonnees()
  }, [])

  const chargerDonnees = async () => {
    setChargement(true)
    const resultats = await Promise.allSettled([
      statistiquesApi.getDashboard(),
      reservationsApi.getAll()
    ])

    const [statsResult, reservationsResult] = resultats
    const statsData =
      statsResult.status === 'fulfilled' ? statsResult.value : null
    const reservations =
      reservationsResult.status === 'fulfilled' ? reservationsResult.value : []

    if (statsData) {
      setStats(prev => ({
        ...prev,
        visiteursMois: statsData.visiteursMois ?? prev.visiteursMois,
        visiteursEvolution:
          statsData.visiteursEvolution ?? prev.visiteursEvolution,
        reservations: statsData.nombreReservations ?? prev.reservations,
        reservationsEvolution:
          statsData.reservationsEvolution ?? prev.reservationsEvolution,
        clientsInscrits:
          statsData.nombreUtilisateursInscrits ?? prev.clientsInscrits,
        clientsEvolution: statsData.clientsEvolution ?? prev.clientsEvolution,
        noteMoyenne: statsData.noteMoyenne ?? prev.noteMoyenne,
        noteEvolution: statsData.noteEvolution ?? prev.noteEvolution,
        repartitionNotes: statsData.repartitionNotes ?? prev.repartitionNotes,
        avisAValider: statsData.nombreAvisEnAttente ?? prev.avisAValider,
        resaEnAttente:
          statsData.nombreReservationsEnAttente ?? prev.resaEnAttente
      }))
    }

    if (statsData) {
      if (statsData?.traficJournalier) {
        setTrafic(
          statsData.traficJournalier.map(t => ({
            day: t.jour,
            visiteurs: t.visiteurs,
            reservations: t.reservations
          }))
        )
      }

      if (statsData?.sourcesTrafic) {
        setSourcesTrafic(
          statsData.sourcesTrafic.map(s => ({
            name: s.nom,
            value: s.valeur,
            color: s.couleur
          }))
        )
      }

      if (statsData.horairesPopulaires) {
        setHoraires(
          statsData.horairesPopulaires.map(h => ({
            heure: h.heure,
            reservations: h.reservations
          }))
        )
      }
    }

    if (reservationsResult.status === 'fulfilled') {
      setReservationsRecentes(reservations.slice(0, 4))
    }

    resultats
      .filter(resultat => resultat.status === 'rejected')
      .forEach(resultat => {
        console.error('Erreur lors du chargement du dashboard', resultat.reason)
      })

    setChargement(false)
  }

  return (
    <div className='min-h-screen bg-[#f5f1ea] p-8'>
      {/* Header with view toggle */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Tableau de bord
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            Vue d'ensemble de l'activité
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeView === 'overview'
                ? 'bg-[#D9A15C] text-[#1A1D24]'
                : 'bg-white text-[#5C5847] hover:bg-[#F7F4EC]'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveView('statistics')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeView === 'statistics'
                ? 'bg-[#D9A15C] text-[#1A1D24]'
                : 'bg-white text-[#5C5847] hover:bg-[#F7F4EC]'
            }`}
          >
            Statistiques détaillées
          </button>
        </div>
      </div>

      {activeView === 'statistics' ? (
        <StatistiquesDashboard />
      ) : (
        <>
          {/*===================================
                STATISTIQUES
      ===================================*/}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
            <StatCard
              icon={<FaBinoculars />}
              value={
                chargement ? '...' : stats.visiteursMois.toLocaleString('fr-FR')
              }
              label='Visiteurs ce mois'
              evolution={stats.visiteursEvolution}
            />
            <StatCard
              icon={<FaRegCalendarCheck />}
              value={chargement ? '...' : stats.reservations}
              label='Réservations'
              evolution={stats.reservationsEvolution}
            />
            <StatCard
              icon={<FaUsers />}
              value={
                chargement
                  ? '...'
                  : stats.clientsInscrits.toLocaleString('fr-FR')
              }
              label='Clients inscrits'
              evolution={stats.clientsEvolution}
            />
            <StatCard
              icon={<FaStar />}
              value={chargement ? '...' : `${stats.noteMoyenne} / 5`}
              label='Note moyenne'
              evolution={stats.noteEvolution}
            />
            <StatCard
              icon={<FaRegEnvelope />}
              value={chargement ? '...' : stats.avisAValider}
              label='Avis à valider'
              tag='En attente'
            />
            <StatCard
              icon={<FaRegHourglass />}
              value={chargement ? '...' : stats.resaEnAttente}
              label='Rés. en attente'
              tag='Ce soir'
            />
          </div>

          <div className='bg-white rounded-2xl shadow-sm p-6 mb-6'>
            <div className='flex flex-wrap items-center justify-between gap-2 mb-5'>
              <div>
                <h2 className="font-['Playfair_Display'] text-lg font-semibold text-gray-800">
                  Répartition des notes
                </h2>
                <p className='text-sm text-gray-500'>Avis publiés</p>
              </div>
              <span className='text-sm font-semibold text-gray-700'>
                {stats.noteMoyenne} / 5 en moyenne
              </span>
            </div>
            <div className='space-y-3'>
              {[...(stats.repartitionNotes || [])].reverse().map(item => {
                const totalAvis = (stats.repartitionNotes || []).reduce(
                  (total, note) => total + note.nombre,
                  0
                )
                const pourcentage =
                  totalAvis > 0
                    ? Math.round((item.nombre * 100) / totalAvis)
                    : 0

                return (
                  <div
                    key={item.note}
                    className='flex items-center gap-3 text-sm'
                  >
                    <span className='w-12 shrink-0 text-gray-600'>
                      {item.note} ★
                    </span>
                    <div className='h-2 flex-1 overflow-hidden rounded-full bg-gray-100'>
                      <div
                        className='h-full rounded-full bg-[#D9A15C]'
                        style={{ width: `${pourcentage}%` }}
                      />
                    </div>
                    <span className='w-16 shrink-0 text-right font-semibold text-gray-700'>
                      {item.nombre} ({pourcentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/*===================================
        VISITEURS & RESERVATIONS + TRAFIC
      ===================================*/}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
            {/* Graphique visiteurs / réservations */}
            <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className="font-['Playfair_Display'] text-lg font-semibold text-gray-800">
                  Visiteurs & Réservations
                </h2>
                <div className='flex gap-1'>
                  {['7j', '30j', '3m', '12m'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriode(p)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                        periode === p
                          ? 'text-white'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                      style={periode === p ? { backgroundColor: GOLD } : {}}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width='100%' height={280}>
                <AreaChart data={trafic}>
                  <defs>
                    <linearGradient
                      id='visiteursGradient'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#222' stopOpacity={0.15} />
                      <stop offset='95%' stopColor='#222' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='#eee'
                  />
                  <XAxis
                    dataKey='day'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#999' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#999' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #eee'
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='visiteurs'
                    stroke='#222'
                    strokeWidth={2}
                    fill='url(#visiteursGradient)'
                    name='Visiteurs'
                  />
                  <Area
                    type='monotone'
                    dataKey='reservations'
                    stroke={GOLD}
                    strokeWidth={2}
                    fill='transparent'
                    name='Réservations'
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className='flex gap-6 mt-2 justify-center text-sm text-gray-600'>
                <span className='flex items-center gap-2'>
                  <span
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: GOLD }}
                  />
                  Réservations
                </span>
                <span className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-gray-800' />
                  Visiteurs
                </span>
              </div>
            </div>

            {/* Sources de trafic */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <h2 className="font-['Playfair_Display'] text-lg font-semibold text-gray-800 mb-4">
                Sources de trafic
              </h2>

              <ResponsiveContainer width='100%' height={220}>
                <PieChart>
                  <Pie
                    data={sourcesTrafic}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {sourcesTrafic.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke='none'
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className='space-y-2 mt-2'>
                {sourcesTrafic.map(source => (
                  <div
                    key={source.name}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='flex items-center gap-2 text-gray-600'>
                      <span
                        className='w-2.5 h-2.5 rounded-full'
                        style={{ backgroundColor: source.color }}
                      />
                      {source.name}
                    </span>
                    <span className='font-semibold text-gray-800'>
                      {source.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*===================================
        HORAIRES + RESERVATIONS RECENTES
      ===================================*/}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Horaires les plus demandés */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <h2 className="font-['Playfair_Display'] text-lg font-semibold text-gray-800 mb-6">
                Horaires les plus demandés
              </h2>
              {horaires.length === 0 ? (
                <div className='flex h-[260px] items-center justify-center text-sm text-gray-500'>
                  Aucune réservation enregistrée.
                </div>
              ) : (
                <ResponsiveContainer width='100%' height={260}>
                  <BarChart data={horaires}>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#eee'
                    />
                    <XAxis
                      dataKey='heure'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#999' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#999' }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #eee'
                      }}
                    />
                    <Bar
                      dataKey='reservations'
                      fill={GOLD}
                      radius={[6, 6, 0, 0]}
                      name='Réservations'
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Réservations récentes */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className="font-['Playfair_Display'] text-lg font-semibold text-gray-800">
                  Réservations récentes
                </h2>
                <a
                  href='/admin/reservation'
                  className='text-sm font-semibold hover:underline'
                  style={{ color: GOLD }}
                >
                  Voir tout →
                </a>
              </div>

              {reservationsRecentes.length === 0 ? (
                <div className='py-10 text-center text-sm text-gray-500'>
                  Aucune réservation enregistrée.
                </div>
              ) : (
                <div className='divide-y divide-gray-100'>
                  {reservationsRecentes.map(resa => (
                    <div
                      key={resa.id}
                      className='flex items-center justify-between py-3'
                    >
                      <div>
                        <p className='font-semibold text-gray-800'>
                          {[resa.prenom, resa.nom].filter(Boolean).join(' ') ||
                            'Client sans nom'}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {formatDateReservation(resa.dateReservation)} ·{' '}
                          {formatHeureReservation(resa.heureReservation)} ·{' '}
                          {resa.nombrePersonnes || 0}p
                        </p>
                      </div>
                      <StatutBadge statut={resa.statut} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatDateReservation (date) {
  if (!date) return '--'

  const [annee, mois, jour] = String(date).split('-')
  return annee && mois && jour ? `${jour}/${mois}` : String(date)
}

function formatHeureReservation (heure) {
  if (!heure) return '--:--'

  return String(heure).slice(0, 5)
}

function StatCard ({ icon, value, label, evolution, tag }) {
  return (
    <div className='bg-white rounded-2xl shadow-sm p-5'>
      <div className='flex justify-between items-start mb-4'>
        <span className='text-xl text-gray-400'>{icon}</span>
        {evolution !== undefined && (
          <span className='text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
            +{evolution}%
          </span>
        )}
      </div>
      <p className="font-['Playfair_Display'] text-3xl font-semibold text-gray-800">
        {value}
      </p>
      <p className='text-sm text-gray-500 mt-1'>{label}</p>
      {tag && (
        <span
          className='inline-block mt-1 text-xs font-semibold'
          style={{ color: GOLD }}
        >
          {tag}
        </span>
      )}
    </div>
  )
}

function StatutBadge ({ statut }) {
  const styles = {
    confirmée: 'bg-green-100 text-green-700',
    en_attente: 'bg-yellow-100 text-yellow-700',
    annulée: 'bg-red-100 text-red-700'
  }

  const labels = {
    confirmée: 'Confirmé',
    en_attente: 'En Attente',
    annulée: 'Annulé'
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[statut] || styles.en_attente
      }`}
    >
      {labels[statut] || labels.en_attente}
    </span>
  )
}
