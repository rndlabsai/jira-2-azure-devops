import React, { useState } from 'react';
import './home.css';

const Home = () => {
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    const toggleAdvancedOptions = () => {
        setShowAdvancedOptions(!showAdvancedOptions);
    };

    return (
        <div className="home">
            <h1>UPB Migration Tool</h1>
            <h3>Select a Jira Project:</h3>
            <select className="combo-box">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
            <h3>Select a Azure DevOps Target Project:</h3>
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
            <button className="migrate-button">Migrate</button>
        </div>
    );
};

export default Home;
