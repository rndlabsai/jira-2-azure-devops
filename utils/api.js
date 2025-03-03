import axios from 'axios';

const API_URL = "http://localhost:4000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});

const postRequest = async (path, body) => {
    try {
        const response = await api.post(path, body);
        return response;
    }
    catch (e) {
        return e.response;
    }
}

export const postJiraTokens = async (api_token, email, url) => {
    const response = await postRequest("/jira/tokens", {
        api_token,
        email,
        url
    });

    if (response.status === 401 && response.data.body.cause === "AUTHENTICATED_FAILED") {
        return false;
    }

    if (response.status === 200) {
        return true;
    }
    else {
        return response.data;
    }
}

export const getJiraProjects = async () => {
    const response = await api.get("/jira/projects");

    if (response.status === 200) {
        return response.data;
    }
    else {
        return response.data;
    }
}

export const startMigration = async () => {
    const response = await postRequest("/migration", {
        start: true
    });

    if (response.status === 200) {
        return true;
    }
    return false;
}