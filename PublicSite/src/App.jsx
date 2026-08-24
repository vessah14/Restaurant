import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import Container from './pages/Container'
import Histoire from './pages/Histoire'
import CartePrincipal from './pages/Carte'
import Galerie from './pages/Galerie'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import './App.css'
import './index.css'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Reserver from './pages/Reserver'
import CompteClient from './pages/CompteClient'
import ReinitialiserMotDePasse from './pages/ReinitialiserMotDePasse'
import ScrollToTop from './pages/ScrollToTop'
import { visitesApi } from './api/visites'
function App () {
  useEffect(() => {
    visitesApi.enregistrer().catch(error => {
      console.warn('Impossible d enregistrer la visite', error)
    })
  }, [])

  return (
    <>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Container />} />
            <Route path='/About' element={<Histoire />} />
            <Route path='/Carte' element={<CartePrincipal />} />
            <Route path='/Galerie' element={<Galerie />} />
            <Route path='/FAQ' element={<FAQ />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/Connexion' element={<Connexion />} />
            <Route path='/Inscription' element={<Inscription />} />
            <Route path='/Reserver' element={<Reserver />} />
            <Route path='/Compte' element={<CompteClient />} />
            <Route
              path='/reinitialiser-mot-de-passe'
              element={<ReinitialiserMotDePasse />}
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </>
  )
}

export default App
