import { useState } from "react";
import { saveEnvConfig } from "../api";
import { toast } from "react-toastify";

const EnvForm = ({ onConfigSaved }) => {
    const [config, setConfig] = useState({
        AZURE_ORG: "",
        AZURE_PROJECT: "",
        AZURE_TOKEN: "",
        JIRA_EMAIL: "",
        JIRA_TOKEN: "",
    });

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveEnvConfig(config);
            toast.success("Configuración guardada correctamente");
            onConfigSaved(); // Notifica al componente padre
        } catch (error) {
            toast.error("Error guardando la configuración");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="env-form">
            {Object.keys(config).map((key) => (
                <div key={key}>
                    <label>{key}:</label>
                    <input
                        type="text"
                        name={key}
                        value={config[key]}
                        onChange={handleChange}
                        required
                    />
                </div>
            ))}
            
        </form>
    );
};

export default EnvForm;
