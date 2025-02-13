import fetch from 'node-fetch';

export const getProjects = async (url, email, api_token) => {
    const response = await fetch(`${url}/rest/api/3/project/search`, {
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

    const data = JSON.parse(await response.text());

    if (data.total === 0) {
        console.log("There are no projects...");
        return;
    }
    console.log(`There are ${data.total} projects:`);
    data.values.forEach(project => {
        console.log(`- Name: ${project.name}\n\t  ID: ${project.id}\n\t  Key: ${project.key}`);
    });
}
