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
        

        {/* Pestaña "API Token Management" con subsecciones */}
        <div className="tab">
          <span>API Token Management</span>
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