import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { faqApi } from '../../api'

function Faq1 () {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    questionFr: '',
    reponseFr: '',
    questionEn: '',
    reponseEn: ''
  })

  useEffect(() => {
    chargerFaqs()
  }, [])

  const chargerFaqs = async () => {
    try {
      const data = await faqApi.getAll()
      setFaqs(data)
    } catch (error) {
      console.error('Erreur lors du chargement des FAQs', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await faqApi.creer({
        ordreAffichage: faqs.length + 1,
        questionFr: formData.questionFr,
        reponseFr: formData.reponseFr,
        questionEn: formData.questionEn || formData.questionFr,
        reponseEn: formData.reponseEn || formData.reponseFr
      })
      await chargerFaqs()
      setShowModal(false)
      setFormData({
        questionFr: '',
        reponseFr: '',
        questionEn: '',
        reponseEn: ''
      })
    } catch (error) {
      console.error('Erreur lors de la création de la FAQ', error)
    }
  }

  const handleSupprimer = async (id) => {
    try {
      await faqApi.supprimer(id)
      await chargerFaqs()
    } catch (error) {
      console.error('Erreur lors de la suppression de la FAQ', error)
    }
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData({
      questionFr: '',
      reponseFr: '',
      questionEn: '',
      reponseEn: ''
    })
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F2EFE7] px-4 sm:px-6 lg:px-8 py-5 sm:py-7 font-sans'>
      {/* Header */}
      <div className='mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div>
          <h1 className='font-serif text-xl sm:text-2xl text-[#1A1D24]'>FAQ</h1>
          <p className='mt-1 text-[13px] text-[#8A8471]'>
            {faqs.length} questions
          </p>
        </div>
        <button 
          onClick={openModal}
          className='w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-[10px] bg-[#D9A15C] px-[18px] py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors'
        >
          <Plus size={16} /> Ajouter une question
        </button>
      </div>

      {/* List */}
      <div className='flex flex-col gap-4'>
        {faqs.map((f, i) => (
          <div
            key={f.id}
            className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-[14px] border border-[#EAE4D6] bg-white px-4 sm:px-5.5 py-4 sm:py-4.5'
          >
            <div className='flex gap-3.5'>
              <span className='mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D9A15C] text-xs font-bold text-[#1A1D24]'>
                {i + 1}
              </span>
              <div className='min-w-0'>
                <div className='text-[15px] font-bold text-[#1A1D24]'>
                  {f.question}
                </div>
                <div className='mt-1.5 text-[13px] text-[#8A8471]'>{f.reponse}</div>
              </div>
            </div>

            <div className='flex items-center gap-2.5 shrink-0 pl-9 sm:pl-0'>
              <button className='flex-1 sm:flex-none rounded-lg border border-[#E2DCCB] bg-white px-4 py-2 text-[13px] font-semibold text-[#1A1D24] hover:bg-[#F7F4EC] transition-colors'>
                Modifier
              </button>
              <button
                onClick={() => handleSupprimer(f.id)}
                aria-label='Supprimer la question'
                className='p-1 text-[#C0554A] hover:text-[#a8483f] transition-colors'
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl w-full max-w-md p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-[#1A1D24]'>Ajouter une FAQ</h2>
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
                  QUESTION (FRANÇAIS)
                </label>
                <input
                  type='text'
                  name='questionFr'
                  value={formData.questionFr}
                  onChange={handleInputChange}
                  required
                  className='w-full rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  RÉPONSE (FRANÇAIS)
                </label>
                <textarea
                  name='reponseFr'
                  value={formData.reponseFr}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className='w-full resize-y rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  QUESTION (ANGLAIS - optionnel)
                </label>
                <input
                  type='text'
                  name='questionEn'
                  value={formData.questionEn}
                  onChange={handleInputChange}
                  className='w-full rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
              </div>

              <div>
                <label className='block text-xs font-bold tracking-[0.03em] text-[#C17A3E] mb-2'>
                  RÉPONSE (ANGLAIS - optionnel)
                </label>
                <textarea
                  name='reponseEn'
                  value={formData.reponseEn}
                  onChange={handleInputChange}
                  rows={3}
                  className='w-full resize-y rounded-lg border border-[#E2DCCB] px-4 py-3 text-sm text-[#1A1D24] focus:outline-none focus:ring-2 focus:ring-[#D9A15C]'
                />
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
                  className='flex-1 rounded-lg bg-[#D9A15C] py-2.5 text-sm font-bold text-[#1A1D24] hover:bg-[#cd934f] transition-colors'
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

export default function FAQ () {
  return <Faq1 />
}
