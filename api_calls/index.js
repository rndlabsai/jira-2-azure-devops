import { getProjects } from './get_projects.js';
import { getFields } from './get_fields.js';
import { getIssues } from './get_issues.js';
import { getScreens } from './get_screens.js';

import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv({ path: "../.env" });

const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_TOKEN;

const [p_name, p_id, p_key] = await getProjects(URL, EMAIL, API_TOKEN);

console.log(`p_name is ${p_name}, p_id is ${p_id}, p_key is ${p_key}`);

await getFields(URL, EMAIL, API_TOKEN);
await getIssues(URL, EMAIL, API_TOKEN, p_key);
await getScreens(URL, EMAIL, API_TOKEN);

const filepath = './data.json';
let data = {};

if (fs.existsSync(filepath)) {
    data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

if (!data.projects) {
    data.projects = [];
}

data.projects.push({ id: p_id, name: p_name, key: p_key, extra_data: { issues: [], fields: [], screens: [] } });

fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');