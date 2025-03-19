const AzureDevOpsTests = require('./AzureDevOpsTests');
const ZephyrTests = require('./ZephyrTests');

class TestsMigration{
 
    constructor(jiraToken, jiraProject, azureToken, azureOrganization, azureProject){
        this.jiraToken = jiraToken;
        this.jiraProject = jiraProject;
        this.azureToken = azureToken;
        this.azureOrganization = azureOrganization;
        this.azureProject = azureProject;
        this.azureHandler = new AzureDevOpsTests(azureToken, azureOrganization, azureProject);
        this.zephyrHandler = new ZephyrTests(jiraToken, jiraProject);
        this.testPlanMapping = {};
        this.testCyclesMapping = {};
    }

    async migrateTestPlans(){
        const  testPlans = await this.zephyrHandler.extractField('testplans');
       
        for (const testPlan of testPlans) {
            const testPlanData = {
                name: testPlan.name,
                description: testPlan.description
            };
            const createdTestPlan = await this.azureHandler.createTestPlan(testPlanData);
            this.testPlanMapping[(testPlan.id)] = createdTestPlan.id;
        }
    
        return this.testPlanMapping
    }

    async migrateTestSuites() {
        const testCycles = await this.zephyrHandler.extractField('testcycles');
    
        for (const testCycle of testCycles) {
            const testPlanId = this.testPlanMapping[testCycle.testPlanIds[0]];
    
            const testCycleData = {
                name: testCycle.name,
                type: testCycle.suiteType,
                planId: testPlanId,
                parentSuiteId: testPlanId + 1
            };
            try{
                const createdTestSuite = await this.azureHandler.createTestSuite(testCycleData);
                this.testCyclesMapping[(testCycle.id)] = createdTestSuite.id;
            } catch(error){
                console.error('Failed to create test suite');
            }   
           
        }
    }
}

module.exports = TestsMigration;

