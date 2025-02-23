import React from 'react';
import './azure-section.css';
import '../styles/global.css';

function AzureSection() {
  return (
    <div className="azure-section">
      <h2>Azure DevOps</h2>
      <div className="input-group">
        <label htmlFor="api-token">API Token:</label>
        <input
          type="text"
          id="api-token"
          placeholder="Enter your Azure Token"
        />

      </div>
      <button className="save-button">Save Azure Token</button>
    </div>
  );
}

export default AzureSection;