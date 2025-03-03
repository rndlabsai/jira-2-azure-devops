import fetch from 'node-fetch';

const retrieveCustomFields = async (url, email, api_token) => {
    let startAt = 0;
    let isLast = false;
    let values = [];
    do {
        const response = await fetch(`${url}/rest/api/3/field/search?type=custom&startAt=${startAt}`, {
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

const cleanCustomFields = async (customFields) => {
    let fields = [];

    customFields.forEach(field => {
        fields.push({
            name: field.name,
            description: field.description,
            type: field.schema.type,
            referenceName: `Custom${field.schema.customId}.${field.name}`,
            usage: "workItem"
        });
    });

    return fields;
}

export const getCustomFields = async (url, email, api_token) => {
    const fields = await retrieveCustomFields(url, email, api_token);
    return await cleanCustomFields(fields);
}