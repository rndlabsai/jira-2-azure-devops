import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./progress.css";
import { getMigrationStatus } from "../../utils/api";

export default function MigrationProgress() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(["Iniciando migración..."]);

  useEffect(() => {
    const fetchMigrationStatus = async () => {
      try {
        const response = await getMigrationStatus();

        // console.dir(response, { depth: null });
        setProgress(response.progress.toFixed(2));
        setLogs(response.logs);
      } catch (error) {
        console.error("Error fetching migration status:", error);
      }
    };

    // Polling interval every 5 seconds
    const interval = setInterval(() => {
      fetchMigrationStatus();
    }, 5000);

    // Initial fetch
    fetchMigrationStatus();

    // Cleanup function to stop polling when unmounting
    return () => clearInterval(interval);
  }, []);

  const isCompleted = progress === 100;

  return (
    <div className="layout">
      <div className="migration-container">
        <div className="log-box">
          {logs.map((log, index) => (
            <div key={index} className="log-message">
              {log}
            </div>
          ))}
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="button-container">
          {isCompleted ? (
            <button className="finish-button">Finalizar Migración</button>
          ) : (
            <p className="progress-text">Progress: {progress}%</p>
          )}
        </div>
      </div>
    </div>
  );
}

MigrationProgress.propTypes = {
  apiUrl: PropTypes.string.isRequired,
};
