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
            name: cycle.name,
            description: cycle.objective || "Sin descripción",
            suiteType: "StaticTestSuite",
        }));
    }

    async extractField(endpoint) {
        const zephyrData = await this.fetchZephyrData(endpoint);
        if (zephyrData) {
            const transformedData = this.transformDataForAzure(endpoint, zephyrData);
            fs.writeFileSync(`${endpoint}.json`, JSON.stringify(transformedData, null, 2));
            console.log(`✅ JSON formateado guardado en ${endpoint}.json`);
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
        return transformedTestCases;
        //fs.writeFileSync('testcases.json', JSON.stringify(transformedTestCases, null, 2));
        //console.log('✅ JSON formateado guardado en testcases.json');
    }
}

module.exports = ZephyrTests;
