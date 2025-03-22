const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); 

const { convertJiraToAzure } = require("./scripts/convert");
const { createWorkItemTypes, createWorkItem, fetchProcessId } = require("./scripts/migrateIssues");
const migrateCustomFields = require("./scripts/migrateCustomFields");
const JiraAzureMigrator = require("./scripts/migrateComments");
const migrateWorkflows = require("./scripts/migrateWorkflows");

const ISSUES_FOLDER = "issues_json"; // Carpeta donde están los JSON
const jiraKeyToAzureIdMap = {};

const app = express();
app.use(express.json());
app.use(cors());

const clients = []; // Para manejar conexiones de logs en tiempo real

// Guardar configuración en .env
app.post("/save-env", (req, res) => {
    const envData = Object.entries(req.body)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    fs.writeFileSync(".env", envData);

    // Recargar las variables de entorno
    require("dotenv").config({ path: path.resolve(__dirname, ".env") });

    res.json({ message: "Configuración guardada y recargada" });
});

// Enviar logs en tiempo real al frontend
app.get("/logs", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    clients.push(res);
    req.on("close", () => {
        clients.splice(clients.indexOf(res), 1);
    });
});

// Función para enviar logs a todos los clientes conectados
const sendLog = (message) => {
    clients.forEach((client) => client.write(`data: ${message}\n\n`));
};

// Iniciar migración al presionar el botón en el frontend
app.post("/migrate", async (req, res) => {
    try {
        sendLog("🚀 Iniciando migración...");
        sendLog("🔄 Obteniendo Process ID del proyecto...");
        const processId = await fetchProcessId();
        sendLog(`✅ Process ID obtenido: ${processId}`);

        sendLog("🔄 Creando Work Item Types personalizados...");
        await createWorkItemTypes(processId);
        sendLog("✅ Work Item Types creados exitosamente.");

        sendLog("🔄 Migrando Custom Fields...");
        await migrateCustomFields();
        sendLog("✅ Custom Fields migrados exitosamente.\n");

        const issueFiles = fs.readdirSync(ISSUES_FOLDER).filter(file => file.endsWith(".json"));
        if (issueFiles.length === 0) {
            sendLog("⚠️ No se encontraron archivos JSON en la carpeta issues_json.");
            return res.json({ message: "No hay archivos para migrar" });
        }

        for (const file of issueFiles) {
            try {
                const filePath = path.join(ISSUES_FOLDER, file);
                sendLog(`📂 Procesando archivo: ${file}`);

                const rawData = fs.readFileSync(filePath, "utf8");
                const jiraIssue = JSON.parse(rawData);

                const issueTypeMapping = {
                    "Bug": "Bug1",
                    "Epic": "Epic1",
                    "Feature": "Feature1",
                    "Impediment": "Impediment1",
                    "Product Backlog Item": "ProductBacklogItem1",
                    "Task": "Task1",
                    "Test Case": "TestCase1",
                    "Test Plan": "TestPlan1",
                    "Test Suite": "TestSuite1"
                };

                let issueType = jiraIssue.fields?.issuetype?.name || "Issue";
                issueType = issueTypeMapping[issueType] || "Task1";

                sendLog(`🛠️ Migrando Issue Type: ${issueType}...\n`);

                const azureWorkItem = convertJiraToAzure(jiraIssue);
                const workItemId = await createWorkItem(azureWorkItem, issueType);

                if (!workItemId) {
                    sendLog("❌ No se pudo obtener el ID del Work Item creado.");
                    continue;
                }

                sendLog(`🛠️ Work Item creado con ID: ${workItemId}`);

                if (!jiraKeyToAzureIdMap[jiraIssue.key]) {
                    jiraKeyToAzureIdMap[jiraIssue.key] = [];
                }
                jiraKeyToAzureIdMap[jiraIssue.key].push(workItemId);

                const migrator = new JiraAzureMigrator();
                await migrator.migrateCommentsAndAttachments(workItemId, jiraIssue.key);

            } catch (error) {
                sendLog(`❌ Error procesando ${file}: ${error.message}`);
            }
        }

        sendLog("🔄 Migrando Workflows...");
        await migrateWorkflows();
        sendLog("✅ Workflows migrados exitosamente.\n");

        sendLog("✅ Migración completada exitosamente.");
        sendLog(`🔍 Mapeo de Key de Jira a Work Item IDs de Azure DevOps: ${JSON.stringify(jiraKeyToAzureIdMap)}`);

        res.json({ message: "Migración finalizada" });

    } catch (error) {
        sendLog(`❌ Error en la migración: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor sin ejecutar migración
app.listen(5000, () => console.log("Backend corriendo en http://localhost:5000"));
