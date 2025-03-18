const AzureDevOpsTests = require('./AzureDevOpsTests');
const ZephyrTests = require('./ZephyrTests');

//const zephyrToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2RhbmllbHRvcnJpY29iLmF0bGFzc2lhbi5uZXQiLCJ1c2VyIjp7ImFjY291bnRJZCI6IjcxMjAyMDplNGZiNGU5OC0yNTczLTQ4ZjYtYmQ0ZS01NWI3NTEyNzAwNDAiLCJ0b2tlbklkIjoiM2RmZGE4NGYtZTI0MS00YTUyLTk2OWEtNDZiMmJhOGIwYjM4In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6IjU3NWMyY2Q4LWI1MWUtMzU2NS1iN2U1LTRmOGU3NTJkODFjNCIsImV4cCI6MTc3MTAyMDcxNiwiaWF0IjoxNzM5NDg0NzE2fQ.BbrBWYp3pontZl3Kj5VpMfAp9tZtWvkaBRzYS_4cLig';

function migrateTestCases(jiraToken, jiraProject, azureToken, azureOrganization, azureProject){
    
    const azureHandler = new AzureDevOpsTests(azureToken, azureOrganization, azureProject);
    const zephyrHandler = new ZephyrTests(jiraToken, jiraProject);

    const testcasesInfo = zephyrHandler.fetchAndTransformTestCases();
    console.log(testcasesInfo);
    
    
}
const jiraToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL3Npbi1jaGFtYmEtdGVhbS5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI2MzFiM2ZkOTM3NzhhN2FhZGYxYWFiYWMiLCJ0b2tlbklkIjoiNTczYmM3YmMtZDQyOC00MzEzLWI1NTQtMDE1ZDhlYWYzN2Y5In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6IjhhODA0OTBmLWE2N2EtMzQyZi05ZWNjLWNmOTQ5YmUxM2ZkYiIsImV4cCI6MTc3Mzg0OTc2MywiaWF0IjoxNzQyMzEzNzYzfQ.re2rBMKv2N94XD_P55Ews_Sgx51HH29uRgK2_ggbeLY';
const jiraProject = 'SCT';
const azureToken = '859b1IgQnlhjrspx3srMdQvHoGTUPeHf86UYXTzQdIGKfcRc02IyJQQJ99BBACAAAAAcetVYAAASAZDOxuFl';
const azureOrganization = 'sin-chamba-team';
const azureProject = 'TestProject';

migrateTestCases(jiraToken, jiraProject, azureToken, azureOrganization, azureProject);