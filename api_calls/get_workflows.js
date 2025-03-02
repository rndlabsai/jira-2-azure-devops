import fetch from 'node-fetch'

export const getWorkflows = async (url, email, api_token) => {
    const response = await fetch(`${url}/rest/api/3/workflow/search?expand=transitions,statuses`, {
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

    return data.values;
}