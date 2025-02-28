import './App.css';
import Login from './components/login.jsx';
import Migrate from './components/migrate.jsx';
import Header from './components/header.jsx';
import TokenManager from './components/token-manager.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={
          <>
            <Header />
            <Outlet />
          </>
        }>
          <Route path="/migrate" element={<Migrate />} />
          <Route path="/token-manager" element={<TokenManager />} />
        </Route>
        {/*Lo que no esta definido va a login*/}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
