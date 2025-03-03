import { getProjects } from './get_projects.js';
import { getCustomFields } from './get_fields.js';
import { getIssues, getEpics, getStories, getTasks, getBugs, getSubTasks, getMultipleIssues } from './get_issues.js';
import { getScreens } from './get_screens.js';
import { getWorkflows } from './get_workflows.js';

import fs from 'fs';
import { configDotenv } from 'dotenv';

configDotenv({ path: "../.env" });

const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_TOKEN;

const [p_name, p_id, p_key] = await getProjects(URL, EMAIL, API_TOKEN);

// const workflows = await getWorkflows(URL, EMAIL, API_TOKEN);

//console.log(`p_name is ${p_name}, p_id is ${p_id}, p_key is ${p_key}`);

// const customFields = await getCustomFields(URL, EMAIL, API_TOKEN);
// const issues = await getIssues(URL, EMAIL, API_TOKEN, p_key);
const screens = await getScreens(URL, EMAIL, API_TOKEN);

// await getEpics(URL, EMAIL, API_TOKEN, p_key);
//await getTasks(URL, EMAIL, API_TOKEN, p_key);
//await getStories(URL, EMAIL, API_TOKEN, p_key);
//await getBugs(URL, EMAIL, API_TOKEN, p_key);
//await getSubTasks(URL, EMAIL, API_TOKEN, p_key);
// await getMultipleIssues(URL, EMAIL, API_TOKEN, p_key, ["Story", "Bug"]);

// const filepath = './data.json';
// const filepath = './issues.json';
// const filepath = '../json/workflows.json';
// const filepath = '../json/custom_fields.json';
// const filepath = '../json/issues.json';
const filepath = '../json/screens.json';
let data = {};

if (fs.existsSync(filepath)) {
    data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

if (!data.screens) {
    data.screens = [];
}

data.screens = screens;

fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');