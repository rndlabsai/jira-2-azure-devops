const AzureDevOpsTests = require('./AzureDevOpsTests');
const ZephyrTests = require('./ZephyrTests');

//const zephyrToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2RhbmllbHRvcnJpY29iLmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjcxMjAyMDplNGZiNGU5OC0yNTczLTQ4ZjYtYmQ0ZS01NWI3NTEyNzAwNDAiLCJ0b2tlbklkIjoiM2RmZGE4NGYtZTI0MS00YTUyLTk2OWEtNDZiMmJhOGIwYjM4In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6IjU3NWMyY2Q4LWI1MWUtMzU2NS1iN2U1LTRmOGU3NTJkODFjNCIsImV4cCI6MTc3MTAyMDcxNiwiaWF0IjoxNzM5NDg0NzE2fQ.BbrBWYp3pontZl3Kj5VpMfAp9tZtWvkaBRzYS_4cLig';

function migrateTestCases(jiraToken, jiraProject, azureToken, azureOrganization, azureProject){
    
    const azureHandler = new AzureDevOpsTests(azureToken, azureOrganization, azureProject);
    const zephyrHandler = new ZephyrTests(jiraToken, jiraProject);

    const testcasesList = zephyrHandler.fetchAndTransformTestCases();
    azureHandler.createTestCases(testcasesList);
}
