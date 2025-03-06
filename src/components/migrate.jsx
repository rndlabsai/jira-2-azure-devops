import { useEffect, useState } from "react";
import "./migrate.css";
import "../styles/global.css";
import imageMigrate from "../assets/migrate-image.png";
import { getJiraProjects } from "../../utils/api";

const Migrate = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    async function retrieveProjects() {
      const data = await getJiraProjects();
      setProjects(data.projects);
    }

    retrieveProjects();
  }, []);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  return (
    <div className="layout">
      <div className="left-container">
        <img src={imageMigrate} />
      </div>

      <div className="right-container">
        <label className="migrate-text">Jira Project:</label>
        <select className="combo-box">
          {projects.map((project) => {
            <option value={project.key}>{project.name}</option>;
          })}
        </select>
        <label className="migrate-text">Azure Project:</label>
        <select className="combo-box">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </select>
        <div className="button-container">
          <button onClick={toggleAdvancedOptions} className="button-blue">
            {showAdvancedOptions ? "Hide" : "Advanced"}
          </button>
          <button className="button-blue">Migrate</button>
        </div>
        <div
          className={`advanced-options ${showAdvancedOptions ? "show" : ""}`}
        >
          <label>
            <input type="checkbox" />
            Custom Fields
          </label>
          <label>
            <input type="checkbox" />
            Issues
          </label>
          <label>
            <input type="checkbox" />
            Screens
          </label>
        </div>
      </div>
    </div>
  );
};

export default Migrate;
