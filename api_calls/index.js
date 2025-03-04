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

export const retrieveAndWriteProjects = async (url, email, api_token) => {
    const filepath = '../json/projects.json';

    const projects = await getProjects(URL, EMAIL, API_TOKEN);

    /*if (fs.existsSync(filepath)) {
        pf = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    if (!pf.projects) {
        pf.projects = [];
    }*/

    const data = {
        projects
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const retrieveAndWriteCustomFields = async (url, email, api_token) => {
    const filepath = '../json/custom_fields.json';

    const customFields = await getCustomFields(URL, EMAIL, API_TOKEN);

    /*if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    if (!data.customFields) {
        data.customFields = [];
    }*/

    const data = {
        customFields
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const retrieveAndWriteWorkflows = async (url, email, api_token) => {
    const filepath = '../json/workflows.json';

    const workflows = await getWorkflows(URL, EMAIL, API_TOKEN);

    /*if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    if (!data.workflows) {
        data.workflows = [];
    }*/

    const data = {
        workflows
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const retrieveAndWriteScreens = async (url, email, api_token) => {
    const filepath = '../json/screens.json';

    const screens = await getScreens(URL, EMAIL, API_TOKEN);

    /*if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    if (!data.screens) {
        data.screens = [];
    }*/

    const data = {
        screens
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const retrieveAndWriteIssues = async (url, email, api_token, project_key, search_type = "All", search_obj = null) => {
    const filepath = '../json/issues.json';

    let issues = [];

    if (search_type === "All") {
        issues = await getIssues(url, email, api_token, project_key);
    }
    else if (search_type === "Multiple") {
        if (search_obj === null || search_obj.length === 0) {
            throw new Error("You need to provide a list of issues to search for...", { cause: 'invalid_search' });
        }

        issues = await getMultipleIssues(url, email, api_token, project_key, search_obj);
    }
    else if (search_type === "Specific") {
        switch (search_obj) {
            case "Epic":
                issues = await getEpics(url, email, api_token, project_key);
                break;
            case "Story":
                issues = await getStories(url, email, api_token, project_key);
                break;
            case "Task":
                issues = await getTasks(url, email, api_token, project_key);
                break;
            case "Bug":
                issues = await getBugs(url, email, api_token, project_key);
                break;
            case "SubTask":
                issues = await getSubTasks(url, email, api_token, project_key);
                break;
            default:
                throw new Error("Invalid search object...", { cause: 'invalid_search' });
        }
    }
    else {
        throw new Error("Invalid search type...\n\nValid search types are:\n\t- All\n\t- Multiple\n\t- Specific", { cause: 'invalid_search' });
    }

    const data = {
        issues
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}