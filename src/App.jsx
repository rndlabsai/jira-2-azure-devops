import './App.css'
import Login from './components/login.jsx'
import Migrate from './components/migrate.jsx'
import Header from './components/header.jsx'
import TokenManager from './components/token-manager.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; //Importante esto


function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/migrate" element={<Migrate />} />
        <Route path="/token-manager" element={<TokenManager />} />
      </Routes>
    </Router>
  )
}

export default App
