import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    console.error('Erreur de rendu React:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render () {
    if (this.state.hasError) {
      return (
        <main className='flex min-h-screen items-center justify-center bg-[#F2EFE7] p-6'>
          <section className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm'>
            <h1 className='font-serif text-2xl text-[#1A1D24]'>Une erreur est survenue</h1>
            <p className='mt-3 text-sm text-[#5C5847]'>
              La page est restée disponible. Rechargez-la pour continuer.
            </p>
            <button
              type='button'
              onClick={this.handleReload}
              className='mt-6 rounded-lg bg-[#D9A15C] px-5 py-2.5 text-sm font-bold text-[#1A1D24]'
            >
              Recharger la page
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
