import { useState, useRef, useEffect } from "react";
import "./jira-section.css";
import "../styles/global.css";
import { postJiraTokens } from "../../utils/api.js";

function JiraSection() {
  const [hasData, setHasData] = useState(false);
  const apiTokenRef = useRef(null);
  const emailRef = useRef(null);
  const urlRef = useRef(null);

  useEffect(() => {
    async function saveTokens() {
      if (!hasData) {
        return;
      }

      const api_token = apiTokenRef.current.value;

      if (api_token === "") {
        alert("API Token is required");
        setHasData(false);
        return;
      }

      const email = emailRef.current.value;

      if (email === "") {
        alert("Email is required");
        setHasData(false);
        return;
      }

      const url = urlRef.current.value;

      if (url === "") {
        alert("URL is required");
        setHasData(false);
        return;
      }

      const response = await postJiraTokens(api_token, email, url);
      if (response === true) {
        alert("Your Jira information has been saved successfully!");
        return;
      } else if (response === false) {
        alert("Your API TOKEN seems to be invalid or have expired...");
        setHasData(false);
        return;
      } else {
        alert(response);
        setHasData(false);
        return;
      }
    }

    saveTokens();
  }, [hasData]);

  return (
    <div className="jira-section">
      <h2>Jira</h2>
      <div className="input-group">
        <label htmlFor="api-token">API Token:</label>
        <input
          id="api-token"
          placeholder="Enter your Jira API token"
          ref={apiTokenRef}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Enter the email you use in Jira"
          ref={emailRef}
        />

        <label htmlFor="url">URL:</label>
        <input
          type="url"
          id="url"
          placeholder="Enter the url of your Jira instance"
          ref={urlRef}
        />
      </div>
      <button className="save-button" onClick={() => setHasData(true)}>
        Save Jira Token
      </button>
    </div>
  );
}

export default JiraSection;
