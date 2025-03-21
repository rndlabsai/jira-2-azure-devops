import  appendToLogFile  from '../utils/utils.js';
import AzureDevOpsTests from './AzureDevOpsTests.js';
import ZephyrTests from './ZephyrTests.js';



export class TestsMigration{
 
    constructor(jiraToken, jiraProject, azureToken, azureOrganization, azureProject, log_filepath){
        this.jiraToken = jiraToken;
        this.jiraProject = jiraProject;
        this.azureToken = azureToken;
        this.azureOrganization = azureOrganization;
        this.azureProject = azureProject;
        this.log_filepath = log_filepath;
        this.azureHandler = new AzureDevOpsTests(azureToken, azureOrganization, azureProject);
        this.zephyrHandler = new ZephyrTests(jiraToken, jiraProject);
        this.testPlanMapping = {};
        this.testCyclesMapping = {};
    }

    async migrateTestPlans(){
        try{
            const  testPlans = await this.zephyrHandler.extractField('testplans');
            this.log('Migrating test plans');
            for (const testPlan of testPlans) {
                const testPlanData = {
                    name: testPlan.name,
                    description: testPlan.description
                };
                try{
                    this.log('Creating test plan:', testPlan);
                    const createdTestPlan = await this.azureHandler.createTestPlan(testPlanData);
                    this.log('Test plan created:', createdTestPlan.id);
                    this.testPlanMapping[(testPlan.id)] = createdTestPlan.id;
                }   
                catch(error){
                    this.log('Failed to create test plan');
                    throw error;
                }
            }
        } catch(error){
            this.appendLogFile('Failed to obtain Zephyr Jira Test Plans');
            console.error('Failed to create test plans', error.message);
        }
        
    }

    async migrateTestSuites() {
        try{
            const testCycles = await this.zephyrHandler.extractField('testcycles');
            this.log('Migrating test cycles (test suites)');
            for (const testCycle of testCycles) {

                const testPlanId = this.testPlanMapping[testCycle.testPlanIds[0]];
                const testCycleData = {
                    name: testCycle.name,
                    type: testCycle.suiteType,
                    planId: testPlanId,
                    parentSuiteId: testPlanId + 1
                };

                try{
                    this.log('Creating test suite:', testCycleData);
                    const createdTestSuite = await this.azureHandler.createTestSuite(testCycleData);
                    this.log('Test suite created:', createdTestSuite.id);
                    this.testCyclesMapping[(testCycle.id)] = createdTestSuite.id;
                } catch(error){
                    console.error('Failed to create test suite');
                }   
               
            }
        } catch(error){
            this.log('Failed to obtain Zephyr Jira Test Cycles');
            console.error('Failed to create test suites', error.message);
        }
       
    }
    async migrateTestCases(){
        const testCases = await this.zephyrHandler.fetchAndTransformTestCases();
        try{

            for (const testcase of testCases){
                console.log("---------------------Creating test case-------------------\n");
                const id_test_case = await this.azureHandler.createTestCase(testcase);
            }
            /*
            wait this.azureHandler. mapTestcaseToTestSuite(testPlanId, testSuiteId, testCaseIds); 
            Just the creation of test cases is implemented, the mapping of test cases to test suites is pending 
            due to the the problem exporting. There is no information about the realtion between a test case and a test suite
            */
            
        }
        catch(error){
            console.error('Failed to create test cases', error.message);
        }
    }


    updateProgressBarCounter(){

    }

    log(content){
        appendToLogFile(this.log_filepath, content);
    }
}

