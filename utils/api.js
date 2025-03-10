import axios from 'axios';

const API_URL = "http://localhost:4000/api";

// Create an axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Helper function for POST requests
const postRequest = async (path, body) => {
    try {
        const response = await api.post(path, body);
        return response;
    } catch (e) {
        return e.response;
    }
};

// Export other functions
export const postJiraTokens = async (api_token, email, url) => {
    const response = await postRequest("/jira/tokens", {
        api_token,
        email,
        url
    });

    if (response.status === 401 && response.data.message === "AUTHENTICATED_FAILED") {
        return false;
    }

    if (response.status === 200) {
        return true;
    }
    else {
        return response.data.message;
    }
};

export const getJiraProjects = async () => {
    const response = await api.get("/jira/projects");

    if (response.status === 200) {
        return response.data;
    } else {
        return response.data;
    }
};

export const startMigration = async (origin, destination, options) => {
    
    try {
        const response = await postRequest("/migration", {
            start: true,
            origin,
            destination,
            options
        });

        if (response && response.status === 200) {
            console.log("Success:", response.data);
            return true;
        } else {
            console.error("Migration failed:", response);
            return false;
        }
    } catch (error) {
        console.error("Error in startMigration:", error);
        return false;
    }
};