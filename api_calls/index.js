import { getProjects } from './get_projects.js';
import { getCustomFields } from './get_fields.js';
import { getIssues, getEpics, getStories, getTasks, getBugs, getSubTasks, getMultipleIssues, setCustomFields } from './get_issues.js';
import { getScreens } from './get_screens.js';
import { getWorkflows } from './get_workflows.js';
import dotenv from 'dotenv';

import fs from 'fs';
import { appendToLogFile, assert, createDirectory } from '../utils/utils.js';

dotenv.config({ path: "../.env" });

const URL = process.env.URL;
const EMAIL = process.env.EMAIL;
const API_TOKEN = process.env.API_TOKEN;

let custom_fields_retrieved = false;

export const retrieveAndWriteProjects = async (url, email, api_token, filepath) => {
    const projects = await getProjects(url, email, api_token);

    const data = {
        projects
    }

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    return projects;
}

export const retrieveAndWriteCustomFields = async (url, email, api_token, filepath, total_filepath) => {
    const customFields = await getCustomFields(url, email, api_token);

    setCustomFields(customFields);
    custom_fields_retrieved = true;

    try {
        createDirectory(filepath);
    }
    catch (e) {
        console.error(e);
        return;
    }

    customFields.forEach(field => {
        fs.writeFileSync(`${filepath}/${field.id}.json`, JSON.stringify(field, null, 2), 'utf8');
    });

    if (fs.existsSync(total_filepath)) {
        const data = JSON.parse(fs.readFileSync(total_filepath, 'utf8'));
        data.fields = customFields.length;
        data.total += customFields.length;
        fs.writeFileSync(total_filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    else {
        fs.writeFileSync(total_filepath, JSON.stringify({ fields: customFields.length, total: customFields.length }, null, 2), 'utf8');
    }
}

export const retrieveAndWriteWorkflows = async (url, email, api_token, p_key, filepath, total_filepath) => {
    const workflows = await getWorkflows(url, email, api_token, p_key);

    try {
        createDirectory(filepath);
    }
    catch (e) {
        console.error(e);
        return;
    }

    workflows.forEach(workflow => {
        fs.writeFileSync(`${filepath}/${workflow.id}.json`, JSON.stringify(workflow, null, 2), 'utf8');
    });

    if (fs.existsSync(total_filepath)) {
        const data = JSON.parse(fs.readFileSync(total_filepath, 'utf8'));
        data.workflows = workflows.length;
        data.total += workflows.length;
        fs.writeFileSync(total_filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    else {
        fs.writeFileSync(total_filepath, JSON.stringify({ workflows: workflows.length, total: workflows.length }, null, 2), 'utf8');
    }
}

export const retrieveAndWriteScreens = async (url, email, api_token, p_id, filepath, total_filepath) => {
    const screens = await getScreens(url, email, api_token, p_id);

    try {
        createDirectory(filepath);
    }
    catch (e) {
        console.error(e);
        return;
    }

    screens.forEach(screen => {
        fs.writeFileSync(`${filepath}/${screen.id}.json`, JSON.stringify(screen, null, 2), 'utf8');
    });

    if (fs.existsSync(total_filepath)) {
        const data = JSON.parse(fs.readFileSync(total_filepath, 'utf8'));
        data.screens = screens.length;
        data.total += screens.length;
        fs.writeFileSync(total_filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    else {
        fs.writeFileSync(total_filepath, JSON.stringify({ screens: screens.length, total: screens.length }, null, 2), 'utf8');
    }
}

export const retrieveAndWriteIssues = async (url, email, api_token, project_key, filepath, total_filepath, log_filepath, search_type = "All", search_obj = null) => {
    assert(custom_fields_retrieved, "Custom fields must be retrieved before issues can be retrieved...")

    let issues = [];

    if (search_type === "All") {
        issues = await getIssues(url, email, api_token, project_key, log_filepath);
    }
    else if (search_type === "Multiple") {
        if (search_obj === null || search_obj.length === 0) {
            throw new Error("You need to provide a list of issues to search for...", { cause: 'invalid_search' });
        }

        issues = await getMultipleIssues(url, email, api_token, project_key, search_obj, log_filepath);
    }
    else if (search_type === "Specific") {
        switch (search_obj) {
            case "Epic":
                issues = await getEpics(url, email, api_token, project_key, log_filepath);
                break;
            case "Story":
                issues = await getStories(url, email, api_token, project_key, log_filepath);
                break;
            case "Task":
                issues = await getTasks(url, email, api_token, project_key, log_filepath);
                break;
            case "Bug":
                issues = await getBugs(url, email, api_token, project_key, log_filepath);
                break;
            case "SubTask":
                issues = await getSubTasks(url, email, api_token, project_key, log_filepath);
                break;
            default:
                throw new Error("Invalid search object...", { cause: 'invalid_search' });
        }
    }
    else {
        throw new Error("Invalid search type...\n\nValid search types are:\n\t- All\n\t- Multiple\n\t- Specific", { cause: 'invalid_search' });
    }

    try {
        createDirectory(filepath);
    }
    catch (e) {
        console.error(e);
        return;
    }

    issues.forEach(issue => {
        fs.writeFileSync(`${filepath}/${issue.id}.json`, JSON.stringify(issue, null, 2), 'utf8');
    });

    if (fs.existsSync(total_filepath)) {
        const data = JSON.parse(fs.readFileSync(total_filepath, 'utf8'));
        data.issues = issues.length;
        data.total += issues.length;
        fs.writeFileSync(total_filepath, JSON.stringify(data, null, 2), 'utf8');
    }
    else {
        fs.writeFileSync(total_filepath, JSON.stringify({ issues: issues.length, total: issues.length }, null, 2), 'utf8');
    }
}

// const projects = await retrieveAndWriteProjects(URL, EMAIL, API_TOKEN, "../json/projects.json");
// console.log(projects);

// await retrieveAndWriteCustomFields(URL, EMAIL, API_TOKEN, "../json/custom_fields", "../json/total.json");
// await retrieveAndWriteIssues(URL, EMAIL, API_TOKEN, "GG", "../json/issues", "../json/total.json", "All");
// await retrieveAndWriteWorkflows(URL, EMAIL, API_TOKEN, "GG", "../json/workflows", "../json/total.json");
// await retrieveAndWriteWorkflows(URL, EMAIL, API_TOKEN, "GG", "../json/workflows");
/* await retrieveAndWriteCustomFields(URL, EMAIL, API_TOKEN, "../json/custom_fields", "../json/total.json")
    .then(
        () => { retrieveAndWriteIssues(URL, EMAIL, API_TOKEN, "GG", "../json/issues", "../json/total.json", "All") }
    );*/
// await retrieveAndWriteWorkflows(URL, EMAIL, API_TOKEN, "GG", "../json/workflows");
// await retrieveAndWriteScreens(URL, EMAIL, API_TOKEN, "10001", "../json/screens");

export const migrate = async (url, email, api_token, p_key, log_filepath, total_filepath, json_filepaths = ["../json/custom_fields", "../json/workflows", "../json/issues"]) => {
    let index = 0;
    retrieveAndWriteCustomFields(url, email, api_token, json_filepaths[index], total_filepath)
        .then(() => {
            appendToLogFile(log_filepath, "Custom fields retrieved successfully...");
            index++;
            return retrieveAndWriteWorkflows(url, email, api_token, p_key, json_filepaths[index], total_filepath);
        })
        .then(() => {
            appendToLogFile(log_filepath, "Workflows retrieved successfully...");
            index++;
            return retrieveAndWriteIssues(url, email, api_token, p_key, json_filepaths[index], total_filepath, log_filepath, "All");
        })
        .then(() => {
            appendToLogFile(log_filepath, "Issues retrieved succesfully...");
        });
}