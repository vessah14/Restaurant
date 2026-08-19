import { useEffect, useState } from 'react'
import { contactInfosApi, utilisateursApi } from '../../api'

const joursSemaine = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
]

const defaultHoraires = `Lundi: 12:00–14:30 · 19:00–22:00
Mardi: 12:00–14:30 · 19:00–22:00
Mercredi: 12:00–14:30 · 19:00–22:00
Jeudi: 12:00–14:30 · 19:00–22:00
Vendredi: 12:00–14:30 · 19:00–22:30
Samedi: 12:00–14:30 · 19:00–22:30
Dimanche: Fermé toute la journée`

const creerJourParDefaut = () => ({
  ouvert: true,
  matinDebut: '12:00',
  matinFin: '14:30',
  soirDebut: '19:00',
  soirFin: '22:00'
})

const parseHorairesTexte = texte => {
  const result = Object.fromEntries(
    joursSemaine.map(jour => [jour, creerJourParDefaut()])
  )

  const lignes = (texte || '')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)

  lignes.forEach(ligne => {
    const indexDeuxPoints = ligne.indexOf(':')
    if (indexDeuxPoints === -1) return

    const jour = ligne.slice(0, indexDeuxPoints).trim()
    const valeur = ligne.slice(indexDeuxPoints + 1).trim()

    const jourCourant = joursSemaine.find(
      j => j.toLowerCase() === jour.toLowerCase()
    )
    if (!jourCourant) return

    if (/ferme|fermé|closed/i.test(valeur)) {
      result[jourCourant] = {
        ouvert: false,
        matinDebut: '12:00',
        matinFin: '14:30',
        soirDebut: '19:00',
        soirFin: '22:00'
      }
      return
    }

    const horaires = [
      ...valeur.matchAll(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/g)
    ]
    const donnees = {
      ouvert: true,
      matinDebut: '12:00',
      matinFin: '14:30',
      soirDebut: '19:00',
      soirFin: '22:00'
    }

    if (horaires[0]) {
      donnees.matinDebut = horaires[0][1]
      donnees.matinFin = horaires[0][2]
    }

    if (horaires[1]) {
      donnees.soirDebut = horaires[1][1]
      donnees.soirFin = horaires[1][2]
    }

    result[jourCourant] = donnees
  })

  return result
}

const serialiserHoraires = horairesParJour =>
  joursSemaine
    .map(jour => {
      const horaire = horairesParJour[jour]

      if (!horaire.ouvert) {
        return `${jour}: Fermé toute la journée`
      }

      const segments = []
      if (horaire.matinDebut && horaire.matinFin) {
        segments.push(`Déjeuner: ${horaire.matinDebut}–${horaire.matinFin}`)
      }
      if (horaire.soirDebut && horaire.soirFin) {
        segments.push(`Dîner: ${horaire.soirDebut}–${horaire.soirFin}`)
      }

      return `${jour}: ${segments.join(' · ') || 'Fermé toute la journée'}`
    })
    .join('\n')

export default function Parametres () {
  const [chargement, setChargement] = useState(true)
  const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false)
  const [message, setMessage] = useState('')
  const [erreur, setErreur] = useState('')

  const [adminForm, setAdminForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmationMotDePasse: ''
  })

  const [horairesParJour, setHorairesParJour] = useState(
    parseHorairesTexte(defaultHoraires)
  )

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [profil, contact] = await Promise.all([
          utilisateursApi.getMoi(),
          contactInfosApi.get()
        ])

        setAdminForm({
          prenom: profil?.prenom || '',
          nom: profil?.nom || '',
          email: profil?.email || '',
          telephone: profil?.telephone || '',
          motDePasse: '',
          confirmationMotDePasse: ''
        })

        setHorairesParJour(
          parseHorairesTexte(contact?.horaires || defaultHoraires)
        )
      } catch (err) {
        console.error('Erreur chargement paramètres', err)
        setErreur(
          'Impossible de charger les paramètres. Vérifiez la connexion au backend.'
        )
      } finally {
        setChargement(false)
      }
    }

    chargerDonnees()
  }, [])

  const handleAdminChange = e => {
    const { name, value } = e.target
    setAdminForm(prev => ({ ...prev, [name]: value }))
  }

  const handleHoraireChange = (jour, champ, valeur) => {
    setHorairesParJour(prev => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        [champ]: valeur
      }
    }))
  }

  const handleHoraireToggle = jour => {
    setHorairesParJour(prev => ({
      ...prev,
      [jour]: {
        ...prev[jour],
        ouvert: !prev[jour].ouvert
      }
    }))
  }

  const enregistrer = async () => {
    setErreur('')
    setMessage('')
    setSauvegardeEnCours(true)

    try {
      if (
        adminForm.motDePasse &&
        adminForm.motDePasse !== adminForm.confirmationMotDePasse
      ) {
        throw new Error('Les mots de passe ne correspondent pas.')
      }

      const payload = {
        prenom: adminForm.prenom,
        nom: adminForm.nom,
        email: adminForm.email,
        telephone: adminForm.telephone,
        ...(adminForm.motDePasse ? { motDePasse: adminForm.motDePasse } : {})
      }

      const horairesTexte = serialiserHoraires(horairesParJour)

      await Promise.all([
        utilisateursApi.modifierMoi(payload),
        contactInfosApi.modifier({
          horairesFr: horairesTexte,
          horairesEn: horairesTexte
        })
      ])

      setAdminForm(prev => ({
        ...prev,
        motDePasse: '',
        confirmationMotDePasse: ''
      }))

      setMessage('Informations enregistrées avec succès.')
    } catch (err) {
      setErreur(
        err?.message || 'Une erreur s’est produite pendant l’enregistrement.'
      )
    } finally {
      setSauvegardeEnCours(false)
    }
  }

  if (chargement) {
    return (
      <div className='min-h-screen bg-[#F2EFE7] px-4 py-8 text-sm text-[#5C5847]'>
        Chargement des paramètres...
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      <div className='mb-6'>
        <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
          Paramètres
        </h1>
        <p className='mt-1 text-[13px] text-[#8A8471]'>
          Informations de l’administrateur et horaires d’ouverture
        </p>
      </div>

      <div className='mx-auto max-w-3xl space-y-6'>
        {message && (
          <div className='rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700'>
            {message}
          </div>
        )}

        {erreur && (
          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {erreur}
          </div>
        )}

        <div className='rounded-2xl border border-[#EAE4D6] bg-white p-5 sm:p-7'>
          <h2 className='mb-5 text-base font-bold text-[#1A1D24]'>
            Informations de l’administrateur
          </h2>

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            <div>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                PRÉNOM
              </label>
              <input
                name='prenom'
                value={adminForm.prenom}
                onChange={handleAdminChange}
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                NOM
              </label>
              <input
                name='nom'
                value={adminForm.nom}
                onChange={handleAdminChange}
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                EMAIL
              </label>
              <input
                type='email'
                name='email'
                value={adminForm.email}
                onChange={handleAdminChange}
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div className='sm:col-span-2'>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                TÉLÉPHONE
              </label>
              <input
                type='tel'
                name='telephone'
                value={adminForm.telephone}
                onChange={handleAdminChange}
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                NOUVEAU MOT DE PASSE
              </label>
              <input
                type='password'
                name='motDePasse'
                value={adminForm.motDePasse}
                onChange={handleAdminChange}
                placeholder='Laisser vide pour ne pas modifier'
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>

            <div>
              <label className='mb-2 block text-xs font-bold tracking-[0.05em] text-[#C17A3E]'>
                CONFIRMER LE MOT DE PASSE
              </label>
              <input
                type='password'
                name='confirmationMotDePasse'
                value={adminForm.confirmationMotDePasse}
                onChange={handleAdminChange}
                placeholder='Confirmer le nouveau mot de passe'
                className='w-full rounded-lg border border-[#E2DCCB] bg-white px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
              />
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-[#EAE4D6] bg-white p-5 sm:p-7'>
          <h2 className='mb-5 text-base font-bold text-[#1A1D24]'>
            Horaires d’ouverture
          </h2>

          <div className='space-y-3'>
            {joursSemaine.map(jour => {
              const horaire = horairesParJour[jour]
              return (
                <div
                  key={jour}
                  className='rounded-xl border border-[#F0EBDD] bg-[#FBFAF7] p-3 sm:p-4'
                >
                  <div className='mb-3 flex items-center justify-between gap-3'>
                    <span className='text-sm font-bold text-[#1A1D24]'>
                      {jour}
                    </span>
                    <label className='flex items-center gap-2 text-xs font-semibold text-[#5C5847]'>
                      <input
                        type='checkbox'
                        checked={horaire.ouvert}
                        onChange={() => handleHoraireToggle(jour)}
                        className='h-4 w-4 accent-[#D9A15C]'
                      />
                      Ouvert
                    </label>
                  </div>

                  <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                    <label className='text-xs font-semibold text-[#C17A3E]'>
                      Déjeuner - ouverture
                      <input
                        type='time'
                        value={horaire.matinDebut}
                        disabled={!horaire.ouvert}
                        onChange={e =>
                          handleHoraireChange(
                            jour,
                            'matinDebut',
                            e.target.value
                          )
                        }
                        className='mt-1 w-full rounded-lg border border-[#E2DCCB] bg-white px-3 py-2 text-sm text-[#1A1D24] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                      />
                    </label>

                    <label className='text-xs font-semibold text-[#C17A3E]'>
                      Déjeuner - fermeture
                      <input
                        type='time'
                        value={horaire.matinFin}
                        disabled={!horaire.ouvert}
                        onChange={e =>
                          handleHoraireChange(jour, 'matinFin', e.target.value)
                        }
                        className='mt-1 w-full rounded-lg border border-[#E2DCCB] bg-white px-3 py-2 text-sm text-[#1A1D24] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                      />
                    </label>

                    <label className='text-xs font-semibold text-[#C17A3E]'>
                      Dîner - ouverture
                      <input
                        type='time'
                        value={horaire.soirDebut}
                        disabled={!horaire.ouvert}
                        onChange={e =>
                          handleHoraireChange(jour, 'soirDebut', e.target.value)
                        }
                        className='mt-1 w-full rounded-lg border border-[#E2DCCB] bg-white px-3 py-2 text-sm text-[#1A1D24] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                      />
                    </label>

                    <label className='text-xs font-semibold text-[#C17A3E]'>
                      Dîner - fermeture
                      <input
                        type='time'
                        value={horaire.soirFin}
                        disabled={!horaire.ouvert}
                        onChange={e =>
                          handleHoraireChange(jour, 'soirFin', e.target.value)
                        }
                        className='mt-1 w-full rounded-lg border border-[#E2DCCB] bg-white px-3 py-2 text-sm text-[#1A1D24] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                      />
                    </label>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={enregistrer}
            disabled={sauvegardeEnCours}
            className='mt-6 w-full rounded-lg bg-[#D9A15C] px-6 py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'
          >
            {sauvegardeEnCours
              ? 'Enregistrement...'
              : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  )
}
