import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/useLanguage'
import Navbarre2 from '../components/Navbarre2'
import Footer from '../components/Footer'
import { reservationsApi } from '../api/reservation'
import { utilisateursApi } from '../api/utilisateurs'
import { avisApi } from '../api/avis'

export default function CompteClient () {
  const { utilisateur, estConnecte, deconnecter, chargement: authChargement } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [onglet, setOnglet] = useState('reservations')
  const [reservations, setReservations] = useState([])
  const [donneesChargement, setDonneesChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [profil, setProfil] = useState(null)
  const [editionMode, setEditionMode] = useState(false)
  const [formProfil, setFormProfil] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  })
  const [avisForm, setAvisForm] = useState({
    note: 5,
    commentaire: ''
  })

  useEffect(() => {
    if (authChargement) return

    if (!estConnecte) {
      navigate('/Connexion')
      return
    }

    chargerDonnees()
  }, [estConnecte, authChargement, navigate])

  const chargerDonnees = async () => {
    try {
      setDonneesChargement(true)
      setErreur(null)

      // Charger les réservations
      const resReservations = await reservationsApi.mesReservations()
      setReservations(resReservations)

      // Charger le profil
      const resProfil = await utilisateursApi.monProfil()
      setProfil(resProfil)
      setFormProfil({
        prenom: resProfil.prenom,
        nom: resProfil.nom,
        email: resProfil.email,
        telephone: resProfil.telephone || ''
      })
    } catch (err) {
      setErreur(err.message || 'Erreur lors du chargement des données')
    } finally {
      setDonneesChargement(false)
    }
  }

  const handleSauvegarderProfil = async () => {
    try {
      await utilisateursApi.modifierMonProfil(formProfil)
      setProfil({ ...profil, ...formProfil })
      setEditionMode(false)
      setErreur(null)
    } catch (err) {
      setErreur('Erreur lors de la sauvegarde du profil')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormProfil(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDeconnexion = () => {
    deconnecter()
    navigate('/')
  }

  const handleAvisSubmit = async (e) => {
    e.preventDefault()
    try {
      await avisApi.creer({
        nomAffiche: `${utilisateur.prenom} ${utilisateur.nom}`,
        note: avisForm.note,
        commentaire: avisForm.commentaire
      })
      setAvisForm({ note: 5, commentaire: '' })
      setErreur(null)
      alert('Avis envoyé avec succès !')
    } catch (err) {
      setErreur('Erreur lors de l\'envoi de l\'avis')
    }
  }

  const handleAvisChange = (e) => {
    const { name, value } = e.target
    setAvisForm(prev => ({ ...prev, [name]: value }))
  }

  if (donneesChargement) {
    return (
      <div className='bg-[#f5f1ea] min-h-screen'>
        <Navbarre2 />
        <div className='mt-20 flex justify-center items-center min-h-[60vh]'>
          <p className='text-gray-600'>
            {t.validation?.messageChargement || 'Chargement...'}
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className='bg-[#f5f1ea]'>
      <Navbarre2 />

      {/* En-tête */}
      <main className='min-h-20 bg-gray-800 overflow-hidden object-cover text-white'>
        <div className='flex flex-col justify-center items-center mt-10 h-70'>
          <span
            style={{ color: '#C4A060' }}
            className='text-sm font-light tracking-[0.3em]'
          >
            {t.compte?.titre || t.deconnexion?.titre || 'MON COMPTE'}
          </span>
          <h1 className="font-['Playfair_Display'] text-3xl md:text-6xl font-medium">
            {utilisateur?.prenom} {utilisateur?.nom}
          </h1>
          <p className='w-70 md:w-150 md:text-xl text-sm text-center text-gray-400'>
            {utilisateur?.email}
          </p>
        </div>
      </main>

      {/* Contenu principal */}
      <div className='max-w-7xl mx-auto px-4 py-20'>
        {erreur && (
          <div className='bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6'>
            {erreur}
          </div>
        )}

        {/* Onglets */}
        <div className='flex gap-4 mb-8 border-b border-gray-300'>
          <button
            onClick={() => setOnglet('reservations')}
            className={`pb-4 font-semibold transition ${
              onglet === 'reservations'
                ? 'text-[#C4A060] border-b-2 border-[#C4A060]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mes réservations ({reservations.length})
          </button>
          <button
            onClick={() => setOnglet('profil')}
            className={`pb-4 font-semibold transition ${
              onglet === 'profil'
                ? 'text-[#C4A060] border-b-2 border-[#C4A060]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mon profil
          </button>
          <button
            onClick={() => setOnglet('avis')}
            className={`pb-4 font-semibold transition ${
              onglet === 'avis'
                ? 'text-[#C4A060] border-b-2 border-[#C4A060]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Donner un avis
          </button>
        </div>

        {/* Contenu des onglets */}
        {onglet === 'reservations' && (
          <OngletReservations reservations={reservations} />
        )}

        {onglet === 'profil' && (
          <OngletProfil
            profil={profil}
            formProfil={formProfil}
            editionMode={editionMode}
            onInputChange={handleInputChange}
            onSauvegarder={handleSauvegarderProfil}
            onEditer={() => setEditionMode(true)}
            onAnnuler={() => {
              setEditionMode(false)
              setFormProfil({
                prenom: profil.prenom,
                nom: profil.nom,
                email: profil.email,
                telephone: profil.telephone || ''
              })
            }}
            onDeconnexion={handleDeconnexion}
          />
        )}

        {onglet === 'avis' && (
          <OngletAvis
            avisForm={avisForm}
            onChange={handleAvisChange}
            onSubmit={handleAvisSubmit}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}

function OngletReservations ({ reservations }) {
  const { t } = useLanguage()

  if (reservations.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-12 text-center'>
        <p className='text-gray-600 mb-4'>
          {t.compte?.aucuneReservation ||
            "Vous n'avez aucune réservation pour le moment."}
        </p>
        <a
          href='/Reserver'
          className='inline-block bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition'
        >
          {t.compte?.reserverTable || 'Réserver une table'}
        </a>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {reservations.map(reservation => (
        <div
          key={reservation.id}
          className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition'
        >
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.date}
              </p>
              <p className='text-lg font-medium'>
                {(() => {
                  const dateStr = reservation.dateReservation
                  const [year, month, day] = dateStr.split('-').map(Number)
                  const date = new Date(year, month - 1, day)
                  return date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                })()}
              </p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.heure}
              </p>
              <p className='text-lg font-medium'>
                {reservation.heureReservation}
              </p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.personnes}
              </p>
              <p className='text-lg font-medium'>
                {reservation.nombrePersonnes}
              </p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.statut}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  reservation.statut === 'confirmée'
                    ? 'bg-green-100 text-green-700'
                    : reservation.statut === 'annulée'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {reservation.statut === 'confirmée'
                  ? t.compte?.confirmee
                  : reservation.statut === 'annulée'
                  ? t.compte?.annulee
                  : t.compte?.enAttente}
              </span>
            </div>
          </div>

          {reservation.demande && (
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.note}
              </p>
              <p className='text-gray-700'>{reservation.message}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OngletProfil ({
  profil,
  formProfil,
  editionMode,
  onInputChange,
  onSauvegarder,
  onEditer,
  onAnnuler,
  onDeconnexion
}) {
  const { t } = useLanguage()

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
      {/* Informations du profil */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold mb-6' style={{ color: '#C4A060' }}>
          {t.compte?.informationsPersonnelles}
        </h2>

        {editionMode ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                {t.compte?.prenom}
              </label>
              <input
                type='text'
                name='prenom'
                value={formProfil.prenom}
                onChange={onInputChange}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#C4A060]'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                {t.compte?.nom}
              </label>
              <input
                type='text'
                name='nom'
                value={formProfil.nom}
                onChange={onInputChange}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#C4A060]'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                {t.compte?.email}
              </label>
              <input
                type='email'
                name='email'
                value={formProfil.email}
                onChange={onInputChange}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#C4A060]'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                {t.compte?.telephone}
              </label>
              <input
                type='tel'
                name='telephone'
                value={formProfil.telephone}
                onChange={onInputChange}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#C4A060]'
              />
            </div>

            <div className='flex gap-3 pt-4'>
              <button
                onClick={onSauvegarder}
                className='flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold'
              >
                {t.compte?.sauvegarder}
              </button>
              <button
                onClick={onAnnuler}
                className='flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-semibold'
              >
                {t.compte?.annuler}
              </button>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.prenom}
              </p>
              <p className='text-lg'>{profil?.prenom}</p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.nom}
              </p>
              <p className='text-lg'>{profil?.nom}</p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.email}
              </p>
              <p className='text-lg'>{profil?.email}</p>
            </div>

            <div>
              <p className='text-gray-600 text-sm font-semibold'>
                {t.compte?.telephone}
              </p>
              <p className='text-lg'>
                {profil?.telephone || t.compte?.nonRenseigne}
              </p>
            </div>

            <button
              onClick={onEditer}
              className='w-full mt-6 bg-[#C4A060] text-white py-2 rounded-lg hover:opacity-90 transition font-semibold'
            >
              {t.compte?.modifierInformations}
            </button>
          </div>
        )}
      </div>

      {/* Actions et déconnexion */}
      <div className='space-y-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2
            className='text-xl font-semibold mb-6'
            style={{ color: '#C4A060' }}
          >
            {t.compte?.actions}
          </h2>

          <div className='space-y-3'>
            <a
              href='/Reserver'
              className='block w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold text-center'
            >
              {t.compte?.nouvelleReservation}
            </a>

            <button
              onClick={onDeconnexion}
              className='w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold'
            >
              {t.compte?.deconnexion}
            </button>
          </div>
        </div>

        {/* Informations utiles */}
        <div className='bg-[#f5f1ea] rounded-lg p-6 border border-gray-300'>
          <h3 className='font-semibold mb-3'>{t.compte?.besoindAide}</h3>
          <p className='text-sm text-gray-700 mb-4'>
            {t.compte?.equipeDisponible}
          </p>
          <a
            href='/Contact'
            className='text-[#C4A060] font-semibold hover:underline'
          >
            {t.compte?.nousContacter}
          </a>
        </div>
      </div>
    </div>
  )
}

function OngletAvis ({ avisForm, onChange, onSubmit }) {
  const { t } = useLanguage()

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-semibold mb-6' style={{ color: '#C4A060' }}>
        Partagez votre expérience
      </h2>

      <form onSubmit={onSubmit} className='space-y-6'>
        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Note
          </label>
          <div className='flex gap-2'>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type='button'
                onClick={() => onChange({ target: { name: 'note', value: star } })}
                className={`text-3xl transition ${
                  star <= avisForm.note ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>
            Votre commentaire
          </label>
          <textarea
            name='commentaire'
            value={avisForm.commentaire}
            onChange={onChange}
            rows={5}
            required
            placeholder='Partagez votre avis sur votre expérience au restaurant...'
            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C4A060] resize-y'
          />
        </div>

        <button
          type='submit'
          className='w-full bg-[#C4A060] text-white py-3 rounded-lg hover:opacity-90 transition font-semibold'
        >
          Envoyer mon avis
        </button>
      </form>
    </div>
  )
}
