import fetch from 'node-fetch'

const retrieveWorkflows = async (url, email, api_token) => {
    let startAt = 0;
    let isLast = false;
    let values = [];
    do {
        const response = await fetch(`${url}/rest/api/3/workflow/search?expand=transitions,statuses&startAt=${startAt}`, {
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

        const data = await response.json();

        isLast = data.isLast;
        if (!isLast) {
            startAt += data.maxResults;
        }
        values = values.concat(data.values);
    }
    while (!isLast);

    console.log(values);
    return values;
}

const cleanWorkflows = async (workflows) => {
    let clean_workflows = [];

    workflows.forEach(workflow => {
        clean_workflows.push({
            id: workflow.id.entityId,
            name: workflow.id.name,
            description: workflow.description,
            statuses: workflow.statuses,
            transitions: workflow.transitions
        });
    });

    return clean_workflows;
}

export const getWorkflows = async (url, email, api_token) => {
    const workflows = await retrieveWorkflows(url, email, api_token);
    return await cleanWorkflows(workflows);
}