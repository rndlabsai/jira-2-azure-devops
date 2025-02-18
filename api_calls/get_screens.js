import fetch from 'node-fetch';

export const getScreens = async (url, email, api_token) => {
    const response = await fetch(`${url}/rest/api/3/screens?scope=PROJECT`, {
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