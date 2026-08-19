import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthAdminProvider } from './context/AuthAdminContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthAdminProvider>
      <App />
    </AuthAdminProvider>
  </StrictMode>
)
