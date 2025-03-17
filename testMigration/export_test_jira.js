const axios = require('axios');
const fs = require('fs');

const zephyrToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2RhbmllbHRvcnJpY29iLmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjcxMjAyMDplNGZiNGU5OC0yNTczLTQ4ZjYtYmQ0ZS01NWI3NTEyNzAwNDAiLCJ0b2tlbklkIjoiM2RmZGE4NGYtZTI0MS00YTUyLTk2OWEtNDZiMmJhOGIwYjM4In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6IjU3NWMyY2Q4LWI1MWUtMzU2NS1iN2U1LTRmOGU3NTJkODFjNCIsImV4cCI6MTc3MTAyMDcxNiwiaWF0IjoxNzM5NDg0NzE2fQ.BbrBWYp3pontZl3Kj5VpMfAp9tZtWvkaBRzYS_4cLig';

async function fetchZephyrData(endpoint, projectKey) {
    const baseUrl = 'https://api.zephyrscale.smartbear.com/v2/';
    const fullUrl = ${baseUrl}${endpoint};

    try {
        const response = await axios.get(fullUrl, {
            headers: {
                Authorization: Bearer ${zephyrToken}
            },
            params: {
                projectKey: projectKey,
            }
        });

        return response.data;
    } catch (error) {
        console.error(❌ Error al obtener los datos de ${endpoint}:, error?.response?.data || error.message);
        return null;
    }
}

function transformDataForAzure(field, zephyrData) {
    if (field === 'testplans') {
        return transformTestPlans(zephyrData);
    } else if (field === 'testcycles') {
        return transformTestCycles(zephyrData);
    }
    return zephyrData;
}

function transformTestPlans(zephyrData) {
    return zephyrData.values.map(plan => ({
        id: plan.id,
        name: plan.name,
        description: plan.objective || "Sin descripción",
    }));
}

function transformTestCycles(zephyrData) {
    return zephyrData.values.map(cycle => ({
        id: cycle.id,
        name: cycle.name,
        description: cycle.objective || "Sin descripción",
        suiteType: "StaticTestSuite",
    }));
}

async function extractField(endpoint, projectKey) {
    const zephyrData = await fetchZephyrData(endpoint, projectKey);
    if (zephyrData) {
        const transformedData = transformDataForAzure(endpoint, zephyrData);
        fs.writeFileSync(${endpoint}.json, JSON.stringify(transformedData, null, 2));
        console.log(✅ JSON formateado guardado en ${endpoint}.json);
    }
}

async function fetchTestSteps(testCaseKey, projectKey) {
    const endpoint = testcases/${testCaseKey}/teststeps;
    const testStepsData = await fetchZephyrData(endpoint, projectKey);
    
    if (!testStepsData || !testStepsData.values) {
        return '';
    }
    
    const stepsXml = testStepsData.values.map((step, index) => {
        return <step id=\"${index + 1}\" type=\"Action\"><description>${step.inline.description}</description><expectedresult>${step.inline.expectedResult || ''}</expectedresult></step>;
    }).join('');
    
    return <?xml version=\"1.0\" encoding=\"utf-16\"?><steps>${stepsXml}</steps>;
}

async function fetchAndTransformTestCases(projectKey) {
    const testCasesData = await fetchZephyrData('testcases', projectKey);
    if (!testCasesData || !testCasesData.values) {
        console.error('❌ No se pudieron obtener los test cases.');
        return;
    }
    
    const transformedTestCases = await Promise.all(testCasesData.values.map(async (testCase) => {
        const testStepsXml = await fetchTestSteps(testCase.key, projectKey);
    
        return [
            {
                "op": "add",
                "path": "/fields/System.Title",
                "value": testCase.name
            },
            {
                "op": "add",
                "path": "/fields/Microsoft.VSTS.TCM.Steps",
                "value": testStepsXml
            },
            {
                "op": "add",
                "path": "/fields/System.Description",
                "value": testCase.objective || "Sin descripción."
            }
        ];
    }));
    
    fs.writeFileSync('testcases.json', JSON.stringify(transformedTestCases, null, 2));
    console.log('✅ JSON formateado guardado en testcases.json');
}
