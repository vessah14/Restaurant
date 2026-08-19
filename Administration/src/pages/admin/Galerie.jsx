import { useState, useEffect } from 'react'
import { Plus, Star, Trash2, X, Upload, ImagePlus } from 'lucide-react'
import { galerieApi, uploadsApi } from '../../api'
import { resolveMediaUrl } from '../../api/client'

const filters = ['Toutes', 'Restaurant', 'Plats', 'Ambiance', 'Événements']

const categoriesGalerie = [
  { code: 'interieur', label: 'Restaurant' },
  { code: 'plats', label: 'Plats' },
  { code: 'ambiance', label: 'Ambiance' },
  { code: 'details', label: 'Détails' },
  { code: 'evenements', label: 'Événements' }
]

export default function Galerie () {
  const [active, setActive] = useState('Toutes')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'interieur',
    imageUrl: ''
  })

  useEffect(() => {
    chargerImages()
  }, [])

  const chargerImages = async () => {
    try {
      const data = await galerieApi.getAll()
      const formattedImages = data.map(img => ({
        id: img.id,
        src: resolveMediaUrl(img.imageUrl),
        title: img.titre || 'Sans titre',
        cat: img.categorie || 'Restaurant',
        principale: img.ordreAffichage === 0
      }))
      setImages(formattedImages)
    } catch (error) {
      console.error('Erreur lors du chargement des images', error)
    } finally {
      setLoading(false)
    }
  }

  const supprimerImage = async id => {
    try {
      await galerieApi.supprimer(id)
      await chargerImages()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image", error)
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

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setUploadError(null)
    setFormData({
      titre: '',
      categorie: 'interieur',
      imageUrl: ''
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.imageUrl) {
      setUploadError('Veuillez uploader une image.')
      return
    }

    try {
      await galerieApi.creer({
        imageUrl: formData.imageUrl,
        categorie: formData.categorie,
        ordreAffichage: images.length,
        titreFr: formData.titre,
        titreEn: formData.titre
      })
      await chargerImages()
      closeModal()
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'image", error)
    }
  }

  // Mapping pour que les codes backend correspondent aux filtres d'affichage
  const mapCodeToFilter = code => {
    const map = {
      interieur: 'Restaurant',
      plats: 'Plats',
      ambiance: 'Ambiance',
      details: 'Restaurant',
      evenements: 'Événements'
    }
    return map[code] || 'Restaurant'
  }

  const filtered =
    active === 'Toutes'
      ? images
      : images.filter(
          i => mapCodeToFilter(String(i.cat).toLowerCase()) === active
        )

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>
            Galerie
          </h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {images.length} images
          </p>
        </div>
        <button
          onClick={openModal}
          className='w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-[#D9A15C] px-4 py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors'
        >
          <Plus size={16} /> Ajouter une image
        </button>
      </div>

      {/* Filters */}
      <div className='mb-6 flex flex-wrap gap-2 sm:gap-2.5'>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full px-3.5 sm:px-4 py-2 text-[13px] font-semibold transition-colors ${
              active === f
                ? 'bg-[#D9A15C] text-[#1A1D24]'
                : 'border border-[#E2DCCB] text-[#5C5847] hover:bg-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 sm:gap-4'>
        {filtered.map(img => (
          <div
            key={img.id}
            className='group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl'
          >
            <img
              src={img.src}
              alt={img.title}
              className='h-full w-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 via-45% to-transparent to-65%' />

            {img.principale && (
              <span className='absolute left-2 sm:left-2.5 top-2 sm:top-2.5 flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/55 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-sm'>
                <Star
                  size={11}
                  fill='#D9A15C'
                  className='text-[#D9A15C] shrink-0'
                />
                <span className='hidden xs:inline'>Principale</span>
              </span>
            )}

            <div className='absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3.5 right-2.5'>
              <div className='text-xs sm:text-sm font-semibold text-white truncate'>
                {img.title}
              </div>
              <div className='text-[11px] sm:text-xs text-white/75 truncate'>
                {mapCodeToFilter(String(img.cat).toLowerCase())}
              </div>
            </div>

            <button
              onClick={() => supprimerImage(img.id)}
              className='absolute top-2 right-2 p-1.5 rounded-full bg-black/55 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100'
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className='col-span-full py-14 text-center text-sm text-[#8A8471]'>
            Aucune image dans cette catégorie pour l'instant.
          </div>
        )}
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-md p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-[#1A1D24]'>
                Ajouter une image
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
                  TITRE (optionnel)
                </label>
                <input
                  type='text'
                  name='titre'
                  value={formData.titre}
                  onChange={handleInputChange}
                  placeholder='Ex : Salle principale'
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
                  {categoriesGalerie.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload d'image */}
              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  IMAGE
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
