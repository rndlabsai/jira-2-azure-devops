import React, { useEffect } from "react";
import "./token-manager.css";
import "../styles/global.css";
import JiraSection from "./jira-section";
import ZephyrSection from "./zephyr-section";
import AzureSection from "./azure-section";

function TokenManager() {
  useEffect(() => {
    document.body.classList.add("token-manager-page");

    return () => {
      document.body.classList.remove("token-manager-page");
    };
  }, []);

  return (
    <div className="SectionContainer">
      <JiraSection />
      <ZephyrSection />
      <AzureSection />
    </div>
  );
}

export default TokenManager;
