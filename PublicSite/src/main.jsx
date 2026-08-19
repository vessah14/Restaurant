import { HelmetProvider } from 'react-helmet-async'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HelmetProvider>
)
