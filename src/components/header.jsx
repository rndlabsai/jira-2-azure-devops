import React from 'react';
import './header.css';
import '../styles/global.css';

function Header() {
  return (
    <header className="header">
      <nav className="navbar">
        
        {/* Pestaña "Migrate" */}
        <div className="tab">
          <span>Migrate</span>
        </div>

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