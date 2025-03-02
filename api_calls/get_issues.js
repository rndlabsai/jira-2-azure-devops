import fetch from 'node-fetch';

const getSpecificIssue = async (url, email, api_token, project_key, issue_type) => {
    const response = await fetch(`${url}/rest/api/3/search/jql?jql=project=${project_key} AND issuetype=${issue_type}&fields=*all`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Invalid information, try again...");
    }

    const text = await response.text();

    if (!text) {
        throw new Error("No data was received...");
    }

    const data = JSON.parse(text);
    console.log(data);

    data.issues.forEach(issue => {
        console.log(issue.fields);
    });
}

export const getEpics = async (url, email, api_token, project_key) => {
    getSpecificIssue(url, email, api_token, project_key, "Epic");
}

export const getStories = async (url, email, api_token, project_key) => {
    getSpecificIssue(url, email, api_token, project_key, "Story");
}

export const getTasks = async (url, email, api_token, project_key) => {
    getSpecificIssue(url, email, api_token, project_key, "Task");
}

export const getBugs = async (url, email, api_token, project_key) => {
    getSpecificIssue(url, email, api_token, project_key, "Bug");
}

export const getSubTasks = async (url, email, api_token, project_key) => {
    getSpecificIssue(url, email, api_token, project_key, "Sub-task");
}

export const getMultipleIssues = async (url, email, api_token, project_key, issue_types) => {

    let extra_query = "";
    issue_types.forEach(issue_type => {
        extra_query += `"${issue_type}", `;
    });

    if (extra_query.length > 0) {
        extra_query = "AND issuetype IN (" + extra_query.slice(0, -2) + ")";
    }

    const response = await fetch(`${url}/rest/api/3/search/jql?jql=project=${project_key} ${extra_query}&fields=*all`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Invalid information, try again...");
    }

    const text = await response.text();

    if (!text) {
        throw new Error("No data was received...");
    }

    const data = JSON.parse(text);
    console.log(data);

    data.issues.forEach(issue => {
        console.log(issue.fields);
    });
}

export const getIssues = async (url, email, api_token, project_key) => {
    const response = await fetch(`${url}/rest/api/3/search/jql?jql=project=${project_key}&fields=summary,description,assignee,author,creator,reporter`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error("Invalid information, try again...");
    }

    const text = await response.text();

    if (!text) {
        throw new Error("No data was received...");
    }

    const data = JSON.parse(text);
    console.log(data);

    data.issues.forEach(issue => {
        console.log(issue.fields);
    });
    return data.issues;
}