import { getProjects } from './get_projects.js';
import { getCustomFields } from './get_fields.js';
import { getIssues, getEpics, getStories, getTasks, getBugs, getSubTasks, getMultipleIssues } from './get_issues.js';
import { getScreens } from './get_screens.js';
import { getWorkflows } from './get_workflows.js';
import dotenv from 'dotenv';

import fs from 'fs';

dotenv.config({ path: "../.env" });

const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_TOKEN;

export const retrieveAndWriteProjects = async (url, email, api_token, filepath) => {
    const projects = await getProjects(url, email, api_token);

    const data = {
        projects
    }

    console.log(projects);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    return projects;
}

export const retrieveAndWriteCustomFields = async (url, email, api_token, filepath) => {
    const customFields = await getCustomFields(url, email, api_token);

    customFields.forEach(field => {
        fs.writeFileSync(`${filepath}/${field.id}.json`, JSON.stringify(field, null, 2), 'utf8');
    });
}

export const retrieveAndWriteWorkflows = async (url, email, api_token, p_key, filepath) => {
    const workflows = await getWorkflows(url, email, api_token, p_key);

    workflows.forEach(workflow => {
        fs.writeFileSync(`${filepath}/${workflow.id}.json`, JSON.stringify(workflow, null, 2), 'utf8');
    });
}

export const retrieveAndWriteScreens = async (url, email, api_token, p_id, filepath) => {
    const screens = await getScreens(url, email, api_token, p_id);

    screens.forEach(screen => {
        fs.writeFileSync(`${filepath}/${screen.id}.json`, JSON.stringify(screen, null, 2), 'utf8');
    });
}

export const retrieveAndWriteIssues = async (url, email, api_token, project_key, filepath, search_type = "All", search_obj = null) => {
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

// retrieveAndWriteProjects(URL, EMAIL, API_TOKEN, "../json/projects.json");
retrieveAndWriteWorkflows(URL, EMAIL, API_TOKEN, "GG", "../json/workflows");
// retrieveAndWriteCustomFields(URL, EMAIL, API_TOKEN, "../json/custom_fields");
// retrieveAndWriteIssues(URL, EMAIL, API_TOKEN, "GG", "../json/issues.json", "All");
// retrieveAndWriteScreens(URL, EMAIL, API_TOKEN, "10001", "../json/screens");