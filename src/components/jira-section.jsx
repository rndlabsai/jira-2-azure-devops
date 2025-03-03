import React, { useEffect } from "react";
import "./jira-section.css";
import "../styles/global.css";
import { postJiraTokens } from "../../utils/api.js";

function JiraSection() {
  const [hasData, setHasData] = useState(false);

  useEffect(async () => {
    if (!hasData) {
      return;
    }

    const api_token = Document.getElementById("api-token").value;

    if (api_token === "") {
      alert("API Token is required");
      setHasData(false);
      return;
    }

    const email = Document.getElementById("email").value;

    if (email === "") {
      alert("Email is required");
      setHasData(false);
      return;
    }

    const url = Document.getElementById("url").value;

    if (url === "") {
      alert("URL is required");
      setHasData(false);
      return;
    }

    const response = await postJiraTokens(api_token, email, url);
    if (response === false) {
      alert("Your API TOKEN seems to be invalid or have expired...");
      setHasData(false);
      return;
    }

    if (response === true) {
      alert("Your Jira information has been saved successfully!");
      return;
    }
  }, [hasData]);

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
      <button className="save-button" onClick={setHasData(true)}>
        Save Jira Token
      </button>
    </div>
  );
}

export default JiraSection;
