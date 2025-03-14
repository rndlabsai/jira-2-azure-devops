const axios = require('axios');

class AzureDevOpsTests {
    constructor(pat, organization, project) {
        this.pat = pat;
        this.organization = organization;
        this.project = project;
        this.authHeaders = this.createAuthHeaders(pat);
        this.validateProjectInfo();
    }

    createAuthHeaders(pat) {
        const auth = Buffer.from(`:${pat}`).toString('base64');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
        };
    }

    validateProjectInfo() {
        if (!this.pat) throw new Error('Personal Access Token is required');
        if (!this.organization) throw new Error('Organization is required');
        if (!this.project) throw new Error('Project is required');
    }

  
    // Utility
    async makeApiRequest(url, data) {
        try {
            const response = await axios.post(url, data, { headers: this.authHeaders });
            return response.data;
        } catch (error) {
            console.error('API Request Failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }


    async  createTestPlan(testPlanData) {
      
      console.log('Creating test plan:', testPlanData);
      // Validate inputs
      if (!testPlanData.name || testPlanData.name === '') {
        throw new Error('Test plan name is required');
      }
      
      // Prepare request
      const url = `https://dev.azure.com/${this.organization}/${this.project}/_apis/testplan/plans?api-version=5.0`;
 
      try {
        const result = await this.makeApiRequest(url, testPlanData);
        console.log('Test Plan Created:', result);
        return result;
      } catch (error) {
        console.error('Failed to create test plan:', error.message);
        throw error;
      }
    }

    
    async createTestSuite(suiteData) {
        if (!suiteData.planId) throw new Error('Plan ID is required');
        if (!suiteData.name) throw new Error('Suite name is required');
        if (!suiteData.type) throw new Error('Suite type is required');

        const url = `https://dev.azure.com/${this.organization}/${this.project}/_apis/test/Plans/${suiteData.planId}/suites?api-version=7.1`;

        const payload = {
            name: suiteData.name,
            suiteType: suiteData.type
        };

        if (suiteData.parentSuiteId) {
            payload.parentSuite = { id: suiteData.parentSuiteId };
        }

        switch (suiteData.type) {
            case 'staticTestSuite':
                break;
            case 'requirementTestSuite':
                if (!suiteData.requirementId) throw new Error('Requirement ID is required for requirementTestSuite');
                payload.requirementId = suiteData.requirementId;
                break;
            case 'queryBasedSuite':
                if (!suiteData.queryString) throw new Error('Query string is required for queryBasedSuite');
                payload.queryString = suiteData.queryString;
                break;
            default:
                throw new Error('Invalid suite type');
        }

        try {
            const result = await this.makeApiRequest(url, payload);
            console.log('Test Suite Created:', result);
            return result;
        } catch (error) {
            console.error('Failed to create test suite:', error.message);
            throw error;
        }
    }
}

module.exports = AzureDevOps;
