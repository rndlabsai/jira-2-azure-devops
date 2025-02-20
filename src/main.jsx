import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './components/login.jsx'
import Migrate from './components/migrate.jsx'
import Header from './components/header.jsx'
import TokenManager from './components/token-manager.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    
    <Login />

  </StrictMode>
)
