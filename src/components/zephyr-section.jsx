import React from 'react';
import './zephyr-section.css';
import '../styles/global.css';

function ZephyrSection() {
  return (
    <div className="zephyr-section">
      <h2>Zephyr</h2>
      <div className="input-group">
        <label htmlFor="api-token">Zephyr API Token:</label>
        <input
          type="text"
          id="api-token"
          placeholder="Enter your Zephyr API token"
        />

      </div>
      <button className="save-button">Save Zephyr Token</button>
    </div>
  );
}

export default ZephyrSection;