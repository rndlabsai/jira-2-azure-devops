import axios from 'axios';

const API_URL = "http://localhost:4000/api";

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" }
});
