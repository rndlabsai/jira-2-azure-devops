const TestsMigration = require('./TestMigration');

const zephyrToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2x1aXN6YXBhdGEuYXRsYXNzaWFuLm5ldCIsInVzZXIiOnsiYWNjb3VudElkIjoiNjMxYjNmZDkzNzc4YTdhYWRmMWFhYmFjIiwidG9rZW5JZCI6IjkzMGFhZGM0LTQxNGItNGVlNS05NmExLTY1MzFhYTA4MTdlNyJ9fSwiaXNzIjoiY29tLmthbm9haC50ZXN0LW1hbmFnZXIiLCJzdWIiOiI2MTA0MDk4Mi1lNmU4LTNmYTYtOTRjYi0zMGY0YjhlYmU3ZmEiLCJleHAiOjE3NzM5MzEwMzgsImlhdCI6MTc0MjM5NTAzOH0.SCAAbdHjrIM6Dw10ATgcN_MQ7Bj_QKWB5B5FaMdi8bQ';
const zephyrId = 'TP';
const azureToken = '859b1IgQnlhjrspx3srMdQvHoGTUPeHf86UYXTzQdIGKfcRc02IyJQQJ99BBACAAAAAcetVYAAASAZDOxuFl';
const azureOrganization = 'sin-chamba-team';
const azureProject = 'TestProject';

(async () => {
const testMigration = new TestsMigration(zephyrToken, zephyrId, azureToken, azureOrganization, azureProject);
//await testMigration.migrateTestPlans();
//await testMigration.migrateTestSuites();

/*

este llama a la funcion fetchAndTransformTestCases de ZephyrTests.js
esta para hacer pruebas del get solamente
*/
//await testMigration.zephyrHandler.fetchAndTransformTestCases();
await testMigration.migrateTestCases(); //este es el migrador de todos los test cases

})();