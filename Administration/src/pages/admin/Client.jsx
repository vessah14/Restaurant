import { useEffect, useMemo, useState } from 'react'
import { Search, UserCheck, UserX } from 'lucide-react'
import { utilisateursApi } from '../../api'

export default function Client () {
  const [clients, setClients] = useState([])
  const [recherche, setRecherche] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const chargerClients = async () => {
    try {
      setLoading(true)
      setError('')
      setClients(await utilisateursApi.getAll(true))
    } catch (err) {
      console.error('Erreur lors du chargement des clients', err)
      setError('Impossible de charger les clients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerClients()
  }, [])

  const clientsFiltres = useMemo(() => {
    const terme = recherche.trim().toLowerCase()
    if (!terme) return clients
    return clients.filter(client =>
      `${client.prenom} ${client.nom} ${client.email}`
        .toLowerCase()
        .includes(terme)
    )
  }, [clients, recherche])

  const changerStatut = async client => {
    try {
      if (client.actif) {
        await utilisateursApi.desactiver(client.id)
      } else {
        await utilisateursApi.reactiver(client.id)
      }
      await chargerClients()
    } catch (err) {
      console.error('Erreur lors de la modification du statut', err)
      setError('Impossible de modifier le statut du client.')
    }
  }

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 py-5 font-sans sm:px-6 sm:py-7 lg:px-8'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='font-serif text-xl text-[#1A1D24] sm:text-2xl'>
            Clients
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {clients.length} client{clients.length > 1 ? 's' : ''} enregistré
            {clients.length > 1 ? 's' : ''}
          </p>
        </div>
        <label className='flex items-center gap-2 rounded-lg border border-[#E2DCCB] bg-white px-3 py-2 text-sm text-[#8A8471]'>
          <Search size={16} />
          <span className='sr-only'>Rechercher un client</span>
          <input
            value={recherche}
            onChange={event => setRecherche(event.target.value)}
            placeholder='Rechercher...'
            className='w-full bg-transparent text-[#1A1D24] outline-none sm:w-56'
          />
        </label>
      </div>

      {error && (
        <p className='mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </p>
      )}

      <div className='overflow-x-auto rounded-lg border border-[#EAE4D6] bg-white'>
        {loading ? (
          <p className='p-8 text-center text-sm text-[#8A8471]'>
            Chargement...
          </p>
        ) : clientsFiltres.length === 0 ? (
          <p className='p-8 text-center text-sm text-[#8A8471]'>
            Aucun client trouvé.
          </p>
        ) : (
          <table className='w-full min-w-[680px] text-left text-sm'>
            <thead className='border-b border-[#EAE4D6] bg-[#F7F4EC] text-xs uppercase tracking-wide text-[#8A8471]'>
              <tr>
                <th className='px-5 py-3 font-semibold'>Client</th>
                <th className='px-5 py-3 font-semibold'>Contact</th>
                <th className='px-5 py-3 font-semibold'>Réservations</th>
                <th className='px-5 py-3 font-semibold'>Statut</th>
                <th className='px-5 py-3 text-right font-semibold'>Action</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#EAE4D6]'>
              {clientsFiltres.map(client => (
                <tr key={client.id} className='text-[#1A1D24]'>
                  <td className='px-5 py-4 font-semibold'>
                    {client.prenom} {client.nom}
                  </td>
                  <td className='px-5 py-4 text-[#5C5847]'>
                    {client.email}
                    <br />
                    {client.telephone || 'Téléphone non renseigné'}
                  </td>
                  <td className='px-5 py-4'>{client.nombreReservations}</td>
                  <td className='px-5 py-4'>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        client.actif
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {client.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className='px-5 py-4 text-right'>
                    <button
                      onClick={() => changerStatut(client)}
                      title={
                        client.actif
                          ? 'Désactiver le client'
                          : 'Réactiver le client'
                      }
                      className='rounded-lg p-2 text-[#C17A3E] transition hover:bg-[#F7F4EC]'
                    >
                      {client.actif ? (
                        <UserX size={17} />
                      ) : (
                        <UserCheck size={17} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
