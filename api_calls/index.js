import { configDotenv } from 'dotenv';

configDotenv({ path: "../.env" });

const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_KEY;

getProjects(URL, EMAIL, API_TOKEN);