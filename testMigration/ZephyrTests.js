const axios = require('axios');
const fs = require('fs');

class ZephyrTests {

    constructor(token, project) {
        this.token = token;
        this.projectKey = project;
    }

    async fetchZephyrData(endpoint) {
        const baseUrl = 'https://api.zephyrscale.smartbear.com/v2/';
        const fullUrl = `${baseUrl}${endpoint}`;

        try {
            const response = await axios.get(fullUrl, {
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                params: {
                    projectKey: this.projectKey,
                }
            });

            return response.data;
        } catch (error) {
            console.error(`❌ Error al obtener los datos de ${endpoint}:`, error?.response?.data || error.message);
            return null;
        }
    }

    transformDataForAzure(field, zephyrData) {
        if (field === 'testplans') {
            return this.transformTestPlans(zephyrData);
        } else if (field === 'testcycles') {
            return this.transformTestCycles(zephyrData);
        }
        return zephyrData;
    }

    transformTestPlans(zephyrData) {
        return zephyrData.values.map(plan => ({
            id: plan.id,
            name: plan.name,
            description: plan.objective || "Sin descripción",
        }));
    }

    transformTestCycles(zephyrData) {
        return zephyrData.values.map(cycle => ({
            id: cycle.id,
            testPlanIds: cycle.links?.testPlans?.map(plan => plan.testPlanId) || [],
            name: cycle.name,
            description: cycle.objective || "Sin descripción",
            suiteType: "StaticTestSuite",
        }));
    }

    async extractField(endpoint) {
        const zephyrData = await this.fetchZephyrData(endpoint);
        if (zephyrData) {
            var aux = this.transformDataForAzure(endpoint, zephyrData);
            //console.log(aux);
            return aux;
            //fs.writeFileSync(`${endpoint}.json`, JSON.stringify(transformedData, null, 2));
            //console.log(`✅ JSON formateado guardado en ${endpoint}.json`);
        }
    }

    async fetchTestSteps(testCaseKey) {
        const endpoint = `testcases/${testCaseKey}/teststeps`;
        const testStepsData = await this.fetchZephyrData(endpoint);

        if (!testStepsData || !testStepsData.values) {
            return '';
        }

        const stepsXml = testStepsData.values.map((step, index) => {
            return `<step id=\"${index + 1}\" type=\"Action\"><description>${step.inline.description}</description><expectedresult>${step.inline.expectedResult || ''}</expectedresult></step>`;
        }).join('');

        return `<?xml version=\"1.0\" encoding=\"utf-16\"?><steps>${stepsXml}</steps>`;
    }

    async fetchAndTransformTestCases() {
        const testCasesData = await this.fetchZephyrData('testcases');
        if (!testCasesData || !testCasesData.values) {
            console.error('❌ No se pudieron obtener los test cases.');
            return;
        }

        const transformedTestCases = await Promise.all(testCasesData.values.map(async (testCase) => {
            const testStepsXml = await this.fetchTestSteps(testCase.key);

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
        //console.log(transformedTestCases);
        return transformedTestCases;
        //fs.writeFileSync('testcases.json', JSON.stringify(transformedTestCases, null, 2));
    }
}

module.exports = ZephyrTests;
//const aux = new ZephyrTests('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2RhbmllbHRvcnJpY29iLmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjcxMjAyMDplNGZiNGU5OC0yNTczLTQ4ZjYtYmQ0ZS01NWI3NTEyNzAwNDAiLCJ0b2tlbklkIjoiM2RmZGE4NGYtZTI0MS00YTUyLTk2OWEtNDZiMmJhOGIwYjM4In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6IjU3NWMyY2Q4LWI1MWUtMzU2NS1iN2U1LTRmOGU3NTJkODFjNCIsImV4cCI6MTc3MTAyMDcxNiwiaWF0IjoxNzM5NDg0NzE2fQ.BbrBWYp3pontZl3Kj5VpMfAp9tZtWvkaBRzYS_4cLig', 'PZ');
//console.log(aux.fetchAndTransformTestCases());
//console.log(aux.extractField('testplans'));
//console.log(aux.extractField('testcycles'));
