import React, { useState } from 'react';
import './migrate.css';
import '../styles/global.css';
import imageMigrate from "../assets/migrate-image.png";
import { startMigration } from '../../utils/api';

const Migrate = () => {
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState(null);

    const toggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    };

    const handleMigrateClick = async () => {
        console.log('Llamada a la funcion startMigration');
        setMigrationStatus('Migrating...');
        try {
            const sucess = await startMigration();
            if (sucess) {
                setMigrationStatus('Successful');
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
