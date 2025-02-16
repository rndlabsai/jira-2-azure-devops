import React from 'react';
import './jira-section.css';
import '../styles/global.css';

function JiraSection() {
  return (
    <div className="jira-section">
      <h2>Jira</h2>
      <div className="input-group">
        <label htmlFor="api-token">API Token:</label>
        <input
          type="text"
          id="api-token"
          placeholder="Enter your Jira API token"
        />

        
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter the email you use in Jira"
        />


        <label htmlFor="url">URL:</label>
        <input
          type="url"
          id="url"
          placeholder="Enter the url of your Jira instance"
        />
      </div>
      <button className="save-button">Save</button>
    </div>
  );
}

export default JiraSection;