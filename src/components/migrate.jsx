import React, { useState } from 'react';
import './migrate.css';
import '../styles/global.css';
import imageMigrate from "../assets/migrate-image.png";
import { startMigration } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Migrate = () => {

    const [jiraProject, setJiraProject] = useState("option1");
    const [azureProject, setAzureProject] = useState("option1");
    const [advancedOptions, setAdvancedOptions] = useState({
        customFields: false,
        issues: false,
        screens: false
    });

    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState(null);
    const navigate = useNavigate();

    const toggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    };

    const handleJiraProjectChange = (e) => {
        setJiraProject(e.target.value);
    };

    const handleAzureProjectChange = (e) => {
        setAzureProject(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setAdvancedOptions((prevOptions) => ({
            ...prevOptions,
            [name]: checked,
        }));
    };

    const handleMigrateClick = async () => {

        setMigrationStatus('Migrating...');
        try {
            
            const success = await startMigration({
                jiraProject,
                azureProject,
                advancedOptions,
            });
            if (success) {
                setMigrationStatus('Successful');
                
                navigate('/progress');
            } else {
                setMigrationStatus('Failed');
            }
        } catch (error) {
            console.error("Error during migration:", error);
            setMigrationStatus('Failed');
        }
    }

    return (
        <div className="layout">
            <div className='left-container'>
                <img src={imageMigrate}/>
            </div>

            <div className="right-container">
                <label class="migrate-text">Jira Project:</label>
                <select className="combo-box">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
                <label class="migrate-text">Azure Project:</label>
                <select className="combo-box">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
                <div className="button-container">
                    <button onClick={toggleAdvancedOptions} className='button-blue'>
                        {showAdvancedOptions ? 'Hide' : 'Advanced'}
                    </button>
                    <button onClick={handleMigrateClick} className="button-blue">Migrate</button>
                </div>
                <div className={`advanced-options ${showAdvancedOptions ? 'show' : ''}`}>
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
                {migrationStatus && <p className="migration-status">{migrationStatus}</p>}
            </div>
        </div>
    );
};

export default Migrate;
