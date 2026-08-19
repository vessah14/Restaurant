import { useState, useEffect } from 'react'
import { X, Plus, Upload, ImagePlus } from 'lucide-react'
import { platsApi, uploadsApi } from '../../api'
import { resolveMediaUrl } from '../../api/client'

const categories = [
  { key: 'entrees', label: 'Entrées', code: 'entrees' },
  { key: 'plats', label: 'Plats', code: 'plats' },
  { key: 'desserts', label: 'Desserts', code: 'desserts' },
  { key: 'boissons', label: 'Boissons', code: 'boissons' }
]

const getCategoryCount = (items, code) => {
  return items.filter(i => String(i.categorieCode).toLowerCase() === code)
    .length
}

export default function Menu () {
  const [active, setActive] = useState('plats')
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: '',
    imageUrl: '',
    categorie: 'plats'
  })

  useEffect(() => {
    chargerPlats()
  }, [])

  const chargerPlats = async () => {
    try {
      const data = await platsApi.getAll()
      setAllItems(data)
    } catch (error) {
      console.error('Erreur lors du chargement des plats', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDisponible = async (id, currentStatus) => {
    try {
      const plat = allItems.find(p => p.id === id)
      if (!plat) return

      await platsApi.modifier(id, {
        prix: plat.prix,
        imageUrl: plat.imageUrl,
        disponible: !currentStatus,
        ordreAffichage: plat.ordreAffichage,
        nomFr: plat.nom,
        descriptionFr: plat.description || '',
        nomEn: plat.nom,
        descriptionEn: plat.description || ''
      })
      await chargerPlats()
    } catch (error) {
      console.error('Erreur lors de la modification du plat', error)
    }
  }

  const handleFileUpload = async e => {
    const fichier = e.target.files?.[0]
    if (!fichier) return

    setUploading(true)
    setUploadError(null)

    try {
      const resultat = await uploadsApi.uploaderImage(fichier)
      setFormData(prev => ({ ...prev, imageUrl: resultat.imageUrl }))
    } catch (error) {
      setUploadError(error.message || "Erreur lors de l'upload de l'image")
      console.error("Erreur lors de l'upload de l'image", error)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setUploadError(null)

    try {
      const categorieId =
        formData.categorie === 'entrees'
          ? 1
          : formData.categorie === 'plats'
          ? 2
          : formData.categorie === 'desserts'
          ? 3
          : 4

      await platsApi.creer({
        categorieId: categorieId,
        prix: parseFloat(formData.prix) || 0,
        imageUrl: formData.imageUrl || null,
        ordreAffichage: allItems.length + 1,
        nomFr: formData.nom,
        descriptionFr: formData.description,
        nomEn: formData.nom,
        descriptionEn: formData.description
      })
      await chargerPlats()
      setShowModal(false)
      setFormData({
        nom: '',
        description: '',
        prix: '',
        imageUrl: '',
        categorie: 'plats'
      })
    } catch (error) {
      console.error('Erreur lors de la création du plat', error)
      setUploadError(error?.message || "Impossible d'ajouter le plat.")
    }
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setUploadError(null)
    setFormData({
      nom: '',
      description: '',
      prix: '',
      imageUrl: '',
      categorie: 'plats'
    })
  }

  const activeCategory = categories.find(c => c.key === active)
  const filteredItems = activeCategory
    ? allItems.filter(
        p => String(p.categorieCode).toLowerCase() === activeCategory.code
      )
    : allItems

  const formattedItems = filteredItems.map(plat => ({
    id: plat.id,
    name: plat.nom,
    desc: plat.description || '',
    price: plat.prix ? `${plat.prix}€` : '',
    badge: null,
    img:
      resolveMediaUrl(plat.imageUrl) ||
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    active: plat.disponible
  }))

  const totalItems = allItems.length
  const totalActifs = allItems.filter(i => i.disponible).length

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Menu / Carte
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {totalItems} éléments · {totalActifs} actifs
          </p>
        </div>
        <button
          onClick={openModal}
          className='w-full sm:w-auto rounded-lg bg-[#D9A15C] px-4 py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors'
        >
          + Ajouter un élément
        </button>
      </div>

      {/* Tabs */}
      <div className='mb-6 flex gap-5 sm:gap-7 overflow-x-auto border-b border-[#E2DCCB]'>
        {categories.map(c => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`shrink-0 -mb-px border-b-2 pb-3 text-sm font-semibold whitespace-nowrap transition-colors ${
              active === c.key
                ? 'border-[#D9A15C] text-[#C17A3E]'
                : 'border-transparent text-[#5C5847] hover:text-[#1A1D24]'
            }`}
          >
            {c.label} ({getCategoryCount(allItems, c.code)})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 xs:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 sm:gap-5'>
        {formattedItems.map(item => (
          <div
            key={item.id}
            className={`overflow-hidden rounded-2xl border border-[#EAE4D6] bg-white ${
              item.active ? '' : 'opacity-75'
            }`}
          >
            <div className='relative h-40'>
              <img
                src={item.img}
                alt={item.name}
                className={`h-full w-full object-cover ${
                  item.active ? '' : 'opacity-55 grayscale-[20%] brightness-105'
                }`}
              />
              {item.badge && (
                <span className='absolute left-2.5 top-2.5 rounded-md bg-[#D9A15C] px-2.5 py-0.5 text-xs font-bold text-[#1A1D24]'>
                  {item.badge}
                </span>
              )}
              {!item.active && (
                <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/85 px-3.5 py-1.5 text-[13px] font-semibold text-[#C0554A]'>
                  Désactivé
                </span>
              )}
            </div>

            <div className='px-4 pb-4 pt-3.5'>
              <div className='flex items-center justify-between gap-2'>
                <span
                  className={`text-base font-bold truncate ${
                    item.active ? 'text-[#1A1D24]' : 'text-[#B3AC98]'
                  }`}
                >
                  {item.name}
                </span>
                <span className='shrink-0 text-[15px] font-bold text-[#C17A3E]'>
                  {item.price}
                </span>
              </div>
              <div
                className={`mb-3.5 mt-1 text-[13px] ${
                  item.active ? 'text-[#5C5847]' : 'text-[#B3AC98]'
                }`}
              >
                {item.desc}
              </div>

              <div className='flex gap-2'>
                <button className='flex-1 rounded-lg border border-[#E2DCCB] bg-white py-2.5 text-[13px] font-semibold text-[#1A1D24] hover:bg-[#F7F4EC] transition-colors'>
                  Modifier
                </button>
                <button
                  onClick={() => toggleDisponible(item.id, item.active)}
                  className={`whitespace-nowrap rounded-lg border bg-white px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                    item.active
                      ? 'border-[#C0554A] text-[#C0554A] hover:bg-[#FCEDEB]'
                      : 'border-[#4C8B5F] text-[#4C8B5F] hover:bg-[#EAF5EC]'
                  }`}
                >
                  {item.active ? 'Désact.' : 'Activer'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {formattedItems.length === 0 && (
          <div className='col-span-full py-14 text-center text-sm text-[#8A8471]'>
            Aucun élément dans cette catégorie pour l'instant.
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-md p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-[#1A1D24]'>
                Ajouter un élément
              </h2>
              <button
                onClick={closeModal}
                className='p-1 hover:bg-gray-100 rounded-full'
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  NOM
                </label>
                <input
                  type='text'
                  name='nom'
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  DESCRIPTION
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className='w-full resize-y rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  PRIX (€)
                </label>
                <input
                  type='number'
                  name='prix'
                  value={formData.prix}
                  onChange={handleInputChange}
                  step='0.01'
                  min='0'
                  required
                  className='w-full rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  CATÉGORIE
                </label>
                <select
                  name='categorie'
                  value={formData.categorie}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                >
                  {categories.map(c => (
                    <option key={c.key} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload d'image */}
              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  IMAGE DU PLAT
                </label>
                <label className='flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-[#E2DCCB] bg-[#F7F4EC] px-4 py-6 text-center hover:border-[#D9A15C] hover:bg-[#FDFAF3] transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleFileUpload}
                    className='hidden'
                  />
                  {uploading ? (
                    <>
                      <span className='h-6 w-6 animate-spin rounded-full border-2 border-[#D9A15C] border-t-transparent' />
                      <span className='text-[13px] font-medium text-[#8A8471]'>
                        Upload en cours...
                      </span>
                    </>
                  ) : formData.imageUrl ? (
                    <>
                      <img
                        src={resolveMediaUrl(formData.imageUrl)}
                        alt='Aperçu'
                        className='max-h-28 rounded-lg object-cover'
                      />
                      <span className='text-[13px] font-medium text-[#4C8B5F] flex items-center gap-1'>
                        <ImagePlus size={14} /> Cliquer pour changer
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={22} className='text-[#C17A3E]' />
                      <span className='text-[13px] font-medium text-[#8A8471]'>
                        Cliquez pour uploader une image
                      </span>
                      <span className='text-[11px] text-[#B3AC98]'>
                        JPG, PNG, WEBP · max 10 Mo
                      </span>
                    </>
                  )}
                </label>
                {uploadError && (
                  <p className='mt-2 text-xs font-medium text-[#C0554A]'>
                    {uploadError}
                  </p>
                )}
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={closeModal}
                  className='flex-1 rounded-lg border border-[#E2DCCB] py-2.5 text-sm font-semibold text-[#1A1D24] hover:bg-[#F7F4EC] transition-colors'
                >
                  Annuler
                </button>
                <button
                  type='submit'
                  disabled={uploading}
                  className='flex-1 rounded-lg bg-[#D9A15C] py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
