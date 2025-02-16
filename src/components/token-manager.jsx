import React from 'react';
import './token-manager.css';
import '../styles/global.css';
import JiraSection from './jira-section';
import ZephyrSection from './zephyr-section';
import AzureSection from './azure-section';

function TokenManager() {
  return (
    <div>
      <JiraSection/>

      <ZephyrSection/>

      <AzureSection/>
    </div>
    
    
  );
}

export default TokenManager;