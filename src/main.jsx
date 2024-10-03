import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppMain from './AppMain.jsx'
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')).render(

  <AuthProvider>
    <AppMain/>
  </AuthProvider>
)
