import axios from "axios";

const API_URL = "http://localhost:5000"; 

export const saveEnvConfig = async (config) => {
    return axios.post(`${API_URL}/save-env`, config);
};

export const startMigration = async () => {
    return axios.post(`${API_URL}/migrate`);
};

export const getLogs = async (callback) => {
    const eventSource = new EventSource(`${API_URL}/logs`);
    eventSource.onmessage = (event) => callback(event.data);
    return eventSource;
};
