import fetch from 'node-fetch';

export const getIssues = async (url, email, api_token, project_key) => {
    const response = await fetch(`${url}/rest/api/3/search/jql?jql=project=${project_key}&expand=renderedFields`, {
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
}