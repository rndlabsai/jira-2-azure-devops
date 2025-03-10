import { getHttpRequest } from '../utils/utils.js';

let custom_fields = [];

export const setCustomFields = (customFields) => {
    custom_fields = customFields;
}

const cleanIssues = async (issues) => {
    let cleanedIssues = [];

    issues.forEach(issue => {
        let cleanedIssue = {
            id: issue.id,
            key: issue.key,
            fields: {
                summary: issue.fields.summary,
                description: issue.fields.description,
                issuetype: {
                    id: issue.fields.issuetype.id,
                    name: issue.fields.issuetype.name
                },
                status: {
                    name: issue.fields.status.name
                },
                priority: {
                    name: issue.fields.priority.name
                },
                creator: issue.fields.creator ? {
                    displayName: issue.fields.creator.displayName,
                    emailAddress: issue.fields.creator.emailAddress ? issue.fields.creator.emailAddress : ""
                } : null,
                reporter: issue.fields.reporter ? {
                    displayName: issue.fields.reporter.displayName,
                    emailAddress: issue.fields.reporter.emailAddress ? issue.fields.reporter.emailAddress : ""
                } : null,
                assignee: issue.fields.assignee ? {
                    displayName: issue.fields.assignee ? issue.fields.assignee.displayName : "",
                    emailAddress: issue.fields.assignee ? issue.fields.assignee.emailAddress : ""
                } : null,
                created: issue.fields.created,
                updated: issue.fields.updated,
                duedate: issue.fields.duedate,
                labels: issue.fields.labels,
                components: issue.fields.components,
                fixVersions: issue.fields.fixVersions,
                attachment: issue.fields.attachment,
                subtasks: issue.fields.subtasks,
                issuelinks: issue.fields.issuelinks,
                comments: issue.fields.comment.comments
            }
        };

        Object.keys(issue.fields)
            .filter(key => key.startsWith('customfield_'))
            .forEach(key => {
                cleanedIssue.fields[key] = {
                    name: custom_fields.find(field => field.id === key).name,
                    value: issue.fields[key]
                };
            });

        cleanedIssues.push(cleanedIssue);
    });

    return cleanedIssues;
}

const getSpecificIssue = async (url, email, api_token, project_key, issue_type) => {
    const response = await getHttpRequest(
        `${url}/rest/api/3/search/jql?jql=project=${project_key} AND issuetype=${issue_type}&fields=*all,-project,-environment,-timespent,-votes,-aggregatetimespent,-aggregatetimeestimate,-aggregatetimeoriginalestimate,-timeestimate,-timeoriginalestimate,-timetracking,-security,-workratio,-resolution,-resolutiondate,-lastViewed,-watches`,
        {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        },
        {}
    );

    const data = await response.json();

    return data.issues;
}

export const getEpics = async (url, email, api_token, project_key) => {
    const epics = await getSpecificIssue(url, email, api_token, project_key, "Epic");
    return await cleanIssues(epics);
}

export const getStories = async (url, email, api_token, project_key) => {
    const stories = await getSpecificIssue(url, email, api_token, project_key, "Story");
    return await cleanIssues(stories);
}

export const getTasks = async (url, email, api_token, project_key) => {
    const tasks = await getSpecificIssue(url, email, api_token, project_key, "Task");
    return await cleanIssues(tasks);
}

export const getBugs = async (url, email, api_token, project_key) => {
    const bugs = await getSpecificIssue(url, email, api_token, project_key, "Bug");
    return await cleanIssues(bugs);
}

export const getSubTasks = async (url, email, api_token, project_key) => {
    const subtasks = await getSpecificIssue(url, email, api_token, project_key, "Sub-task");
    return await cleanIssues(subtasks);
}

const retrieveMultipleIssues = async (url, email, api_token, project_key, issue_types) => {

    let extra_query = "";
    issue_types.forEach(issue_type => {
        extra_query += `"${issue_type}", `;
    });

    if (extra_query.length > 0) {
        extra_query = "AND issuetype IN (" + extra_query.slice(0, -2) + ")";
    }

    const response = await getHttpRequest(
        `${url}/rest/api/3/search/jql?jql=project=${project_key} ${extra_query}&fields=summary,description,assignee,author,creator,reporter`,
        {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    );

    const data = await response.json();

    return data.issues;
}

export const getMultipleIssues = async (url, email, api_token, project_key, issue_types) => {
    const issues = await retrieveMultipleIssues(url, email, api_token, project_key, issue_types);
    return await cleanIssues(issues);
}

const retrieveIssues = async (url, email, api_token, project_key) => {
    const response = await getHttpRequest(
        `${url}/rest/api/3/search/jql?jql=project=${project_key}&fields=*all,-project,-environment,-timespent,-votes,-aggregatetimespent,-aggregatetimeestimate,-aggregatetimeoriginalestimate,-timeestimate,-timeoriginalestimate,-timetracking,-security,-workratio,-resolution,-resolutiondate,-lastViewed,-watches`,
        {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    );

    const data = await response.json();

    // console.log(data.issues);

    return data.issues;
}

export const getIssues = async (url, email, api_token, project_key) => {
    const issues = await retrieveIssues(url, email, api_token, project_key);
    return await cleanIssues(issues);
}