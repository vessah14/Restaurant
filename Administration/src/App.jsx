import { useEffect } from 'react'
import Container from './pages/Container'
import Connexion from './pages/Connexion'
import { useAuthAdmin } from './context/AuthAdminContext'

function App () {
  const { estConnecte, chargement } = useAuthAdmin()

  console.log('App render - estConnecte:', estConnecte, 'chargement:', chargement)

  if (chargement) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100'>
        <div className='text-center'>
          <h1 className='font-serif text-2xl font-bold text-[#0B1F3A] mb-4'>
            Les Deux Colombes
          </h1>
          <p className='text-[#8A8471]'>Chargement...</p>
        </div>
      </div>
    )
  }

  console.log('App render - Affichage:', estConnecte ? 'Container' : 'Connexion')
  return <>{estConnecte ? <Container /> : <Connexion />}</>
}

export default App
