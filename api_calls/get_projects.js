import { getHttpRequest } from '../utils/utils.js';

export const getProjects = async (url, email, api_token) => {
    const response = await getHttpRequest(
        `${url}/rest/api/3/project/search`,
        {
            'Authorization': `Basic ${Buffer.from(
                `${email}:${api_token}`
            ).toString('base64')}`,
            'Accept': 'application/json'
        }
    );

    if (response.headers.get('x-seraph-loginreason') === 'AUTHENTICATED_FAILED') {
        throw new Error("Your token is invalid, try again...", { cause: 'invalid_token' });
    }

    const data = await response.json();
    console.log(data);

    if (data.total === 0) {
        console.log("There are no projects...");
        return;
    }
    console.log(`There are ${data.total} projects:`);

    data.values.forEach(project => {
        console.log(`- Name: ${project.name}\n\t  ID: ${project.id}\n\t  Key: ${project.key}`);
    });

    // console.log([data.values[0].name, data.values[0].id, data.values[0].key]);
    return [data.values[0].name, data.values[0].id, data.values[0].key]; // return data.values;// 
}
