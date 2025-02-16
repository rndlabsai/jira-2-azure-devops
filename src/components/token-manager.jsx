import React from 'react';
import './token-manager.css';
import '../styles/global.css';
import JiraSection from './jira-section';
import ZephyrSection from './zephyr-section';

function TokenManager() {
  return (
    <div>
      <JiraSection/>

      <ZephyrSection/>
    </div>
    
    
  );
}

export default TokenManager;