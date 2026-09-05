import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthAdminProvider } from './context/AuthAdminContext'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthAdminProvider>
        <App />
      </AuthAdminProvider>
    </ErrorBoundary>
  </StrictMode>
)
