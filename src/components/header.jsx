import React from 'react';
import './header.css';
import '../styles/global.css';
import { Link } from 'react-router-dom'; //Esto igual muy importante


function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        
        {/* Pestaña "Migrate" */}
        <Link to="/migrate">
          <div className="tab">
            <span>Migrate</span>
          </div>
        </Link>
        

        {/* Pestaña "API Token Management" con subsecciones (el style es para que no se desconfigure el color al añadir Link)*/}
        <div className="tab">
        <Link to="/token-manager" style={{ color: "inherit", textDecoration: "none" }}>
          <span>API Token Management</span>
        </Link>
          <div className="dropdown">
            <div className="dropdown-item">Jira</div>
            <div className="dropdown-item">Zephyr</div>
            <div className="dropdown-item">Azure Devops</div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;