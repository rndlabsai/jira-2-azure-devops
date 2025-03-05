import { getProjects } from './get_projects.js';
import { getCustomFields } from './get_fields.js';
import { getIssues, getEpics, getStories, getTasks, getBugs, getSubTasks, getMultipleIssues } from './get_issues.js';
import { getScreens } from './get_screens.js';
import { getWorkflows } from './get_workflows.js';

import fs from 'fs';

export const retrieveAndWriteProjects = async (url, email, api_token, filepath) => {
    const projects = await getProjects(url, email, api_token);

    const data = {
        projects
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const retrieveAndWriteCustomFields = async (url, email, api_token, filepath) => {
    const customFields = await getCustomFields(url, email, api_token);

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

export const retrieveAndWriteWorkflows = async (url, email, api_token, filepath) => {
    const workflows = await getWorkflows(url, email, api_token);

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

export const retrieveAndWriteScreens = async (url, email, api_token, filepath) => {
    const screens = await getScreens(url, email, api_token);

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