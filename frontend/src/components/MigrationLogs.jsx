import { useState } from "react";
import { startMigration, getLogs } from "../api";
import { toast } from "react-toastify";

const MigrationLogs = () => {
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(false);

    const startProcess = async () => {
        try {
            setLogs([]);
            setProgress(0);
            setRunning(true);

            const eventSource = getLogs((log) => {
                setLogs((prevLogs) => [...prevLogs, log]);

                if (log.includes("Migración completada exitosamente")) {
                    setProgress(100);
                    setRunning(false);
                    eventSource.close();
                    toast.success("Migración completada con éxito");
                } else {
                    setProgress((prev) => Math.min(prev + 10, 90));
                }
            });

            await startMigration();
        } catch (error) {
            toast.error("Error al iniciar la migración");
            setRunning(false);
        }
    };

    return (
        <div className="migration-container">
            <button onClick={startProcess} disabled={running}>
                {running ? "Migrando..." : "Iniciar Migración"}
            </button>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <pre className="logs">{logs.join("\n")}</pre>
        </div>
    );
};

export default MigrationLogs;
