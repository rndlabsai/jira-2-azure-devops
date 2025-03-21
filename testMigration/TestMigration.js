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
    async migrateTestCases(){
        const testCases = await this.zephyrHandler.fetchAndTransformTestCases();
        try{

            
            
            for (const testcase of testCases){
                console.log("---------------------Creating test case-------------------\n");
                const id_test_casse = await this.azureHandler.createTestCase(testcase);
            }
            /*
            wait this.azureHandler. mapTestcaseToTestSuite(testPlanId, testSuiteId, testCaseIds); 
            Just the creation of test cases is implemented, the mapping of test cases to test suites is pending 
            due to the the problem exporting. There is no information about the realtion between a test case and a test suite
            */
            
        }
        catch(error){
            console.error('Failed to create test cases aaqui 2', error.message);
        }
    }
}

module.exports = TestsMigration;

