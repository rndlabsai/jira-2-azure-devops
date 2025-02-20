import React, { useState } from 'react';
import './migrate.css';
import './main.css'

const Migrate = () => {
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    const toggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    };

    return (
        <div className="layout">
            <div className='left-container'>

            </div>

            <div className="right-container">
                <h2>Jira Project:</h2>
                <select className="combo-box">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
                <h2>Azure Project:</h2>
                <select className="combo-box">
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
                <button onClick={toggleAdvancedOptions} className='advanced-button'>
                    {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </button>
                <div className={`advanced-options ${showAdvancedOptions ? 'show' : ''}`}>
                    <label>
                        <input type="checkbox" />
                        Advanced Option 1
                    </label>
                    <label>
                        <input type="checkbox" />
                        Advanced Option 2
                    </label>
            </div>
            <button className="button">Migrate</button>
            </div>
        </div>
    );
};

export default Migrate;
