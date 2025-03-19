import express from 'express';
<<<<<<< HEAD
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { loginUser, registerUser } from './userService.js';
import pool from './db.js';
import { readArrayFromFile } from './utils/utils.js';
import { decryptToken, encryptToken } from './tokenService.js';

// Project's cache
=======
// import cors from 'cors';
import { loginUser, registerUser } from './userService.js';
import pool from './db.js';
import bodyParser from 'body-parser';
import { readArrayFromJSONFile, getSelectionPaths, emptyArrayFromJSONFile } from './utils/utils.js';
import { retrieveAndWriteProjects } from './api_calls/index.js';
import { decryptToken, encryptToken } from './tokenService.js';
import fs from 'fs';
import { migrate } from './migrations/jiraMigrations.js';

// project's cache
>>>>>>> 7f921c470cf5c74ed5a3e04e0dcd193a8294f499
let projects = [];
// url's cache
let URL = null;
// email's cache
let EMAIL = null;
// token's cache
let API_TOKEN = null;

const app = express();
<<<<<<< HEAD

// ✅ Middleware must be applied BEFORE defining routes
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

// ✅ Debugging: List routes when the server starts
app.use((req, res, next) => {
    console.log(`📌 Request received: ${req.method} ${req.url}`);
=======
app.use(express.json());
// app.use(express.json()); // Para manejar JSON en requests
// Habilitar CORS
// app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Permitir solicitudes desde el frontend

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/save-token', bodyParser.json(), async (req, res, next) => {
    try {
        const { _, token, application, email, url } = req.body;
        console.log("app", application);
        if (application !== "Jira") {
            next();
        }
        URL = url;
        EMAIL = email;
        API_TOKEN = token;
        projects = await retrieveAndWriteProjects(url, email, token, "./json/projects.json");
        console.log("Projects cache updated!");
    }
    catch (e) {
        if (e.cause && e.cause === 'invalid_token') {
            res.status(401).send({ message: "AUTHENTICATED_FAILED" });
            return;
        }
    }

>>>>>>> 7f921c470cf5c74ed5a3e04e0dcd193a8294f499
    next();
});

// ✅ Test route to check if server is running
app.get('/api/test', (_, res) => {
    res.json({ message: "✅ Backend funcionando correctamente" });
});

// ✅ Check if routes are being registered
console.log("🔍 Loaded API routes:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`➡️ ${r.route.path}`);
    }
});

// ✅ User Registration Route (Fixed)
app.post('/api/register', async (req, res) => {
    console.log("📩 Received POST request at /api/register");

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Missing username or password" });
        }

        await registerUser(username, password);
        res.json({ success: true, message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error("❌ Error in /api/register:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
});

// ✅ User Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        res.status(200).json({ success: true, user: user.username });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(401).json({ success: false, message: "Unable to login" });
    }
});

// ✅ Fetch Tokens Route
app.get('/api/tokens', async (req, res) => {
    try {
        const { username } = req.query;
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        const [tokens] = await pool.query(`
            SELECT t.id, t.Number, t.Application, t.email, t.url 
            FROM token t
            JOIN tokenreg tr ON t.id = tr.id
            WHERE tr.username = ?`, [username]);

        const decryptedTokens = tokens.map(token => ({
            id: token.id,
            Number: decryptToken(token.Number),
            Application: token.Application,
            email: token.email,
            url: token.url
        }));

        const jiraToken = decryptedTokens.find(token => token.Application === 'Jira') || null;
        API_TOKEN = jiraToken.Number || null;
        EMAIL = jiraToken.email || null;
        URL = jiraToken.url || null;

        res.json({ success: true, tokens: decryptedTokens });
    } catch (error) {
        console.error('❌ Error fetching tokens:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

<<<<<<< HEAD
// ✅ Save Token Route
app.post('/api/save-token', async (req, res) => {
    try {
        const { username, token, email, url } = req.body;
=======

app.get('/api/jira/projects', async (_, res) => {
    projects = projects.length === 0 ? readArrayFromJSONFile("./json/projects.json", "projects") : projects;
    res.status(200).send({ projects });
});

/********* POST ENDPOINTS */
// Ruta para login
app.post('/api/login', bodyParser.json(), async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        console.log('User:', user.username);
        res.status(200).send({ success: true, user: user.username });
    } catch (error) {
        console.log(error);
        res.status(401).send({ success: false, message: "Unable to login" });
    }
});

// Ruta para registro
app.post('/api/register', bodyParser.json(), async (req, res) => {
    try {
        const { username, password } = req.body;
        await registerUser(username, password);
        res.json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Guardar token
app.post('/api/save-token', bodyParser.json(), async (req, res) => {
    try {
        const { username, token, application, email, url } = req.body;

        // Check if user exists
>>>>>>> 7f921c470cf5c74ed5a3e04e0dcd193a8294f499
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        const encryptedToken = encryptToken(token);
        const [tokenResult] = await pool.query(
            'INSERT INTO token (Number, Application, email, url) VALUES (?, ?, ?, ?)',
            [encryptedToken, application, email, url]
        );

        const tokenId = tokenResult.insertId;
        await pool.query('INSERT INTO tokenreg (username, id) VALUES (?, ?)', [username, tokenId]);

        res.status(200).json({ success: true, message: `${application} credentials saved successfully!` });
    } catch (error) {
        console.error('❌ Error saving token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// ✅ Delete Token Route
app.delete('/api/delete-token', async (req, res) => {
    try {
        const { username, tokenId } = req.body;

        if (!username || !tokenId) {
            return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos.' });
        }

        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        const [tokenRows] = await pool.query(`
            SELECT t.id FROM token t
            JOIN tokenreg tr ON t.id = tr.id
            WHERE tr.username = ? AND t.id = ?`, [username, tokenId]);

        if (tokenRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Token no encontrado o no pertenece al usuario' });
        }

        await pool.query('DELETE FROM tokenreg WHERE username = ? AND id = ?', [username, tokenId]);
        await pool.query('DELETE FROM token WHERE id = ?', [tokenId]);

        projects = [];
        emptyArrayFromJSONFile("./json/projects.json", "projects");

        res.status(200).json({ success: true, message: 'Token eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar el token:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

<<<<<<< HEAD
// ✅ Fixed /api/jira/projects
app.get('/api/jira/projects', async (_, res) => {
    projects = projects.length === 0 ? readArrayFromFile("./json/projects.json", "projects") : projects;
    res.status(200).send({ projects, status: "ok" });
});

// ✅ Migration Route
app.post('/api/migration', async (req, res) => {
    const { origin, destination, options } = req.body;

    if (!origin || !destination || !options) {
        return res.status(400).json({ message: "Missing required parameters." });
    }

    res.status(200).json({
        message: "Migration request received successfully.",
        receivedData: { origin, destination, options }
    });
});

// ✅ Start the server
=======
app.post('/api/migration', bodyParser.json(), async (req, res) => {
    // console.dir(req.body, { depth: null });
    const { start, origin, destination, options } = req.body;

    // console.dir(options, { depth: null });

    if (!origin || !destination) {
        return res.status(400).json({ message: "Missing required parameters." });
    }

    if (start) {
        let new_options = options;
        if (options === null) {
            new_options = {
                customFields: true,
                issues: true,
                workflows: true
            };
        }
        const options_paths = getSelectionPaths(new_options, "./json");
        // console.dir(options_paths, { depth: null });
        migrate(URL, EMAIL, API_TOKEN, origin, "./logfile.log", "./json/total.json", new_options, options_paths);

        res.status(200).json({
            message: "Migration request received successfully.",
            receivedData: { origin, destination, options }
        });
    }
});

//endpoint /api/migration-status (GET) lo que debo hacer es leer logfile.log, luego debo retornar un array de logs (siguiendo el formato en progress.jsx)
// luego calcular el progreso [Log1, Log2, Log3]
app.get('/api/migration-status', async (_, res) => {
    try {
        const logData = await fs.promises.readFile('./logfile.log', 'utf-8');

        const logs = logData.split('============\n').map(log => log.trim()).filter(log => log);

        const totalJsonData = await fs.promises.readFile('./json/total.json', 'utf-8');
        const totalData = JSON.parse(totalJsonData);

        const progress = (totalData.migrated / totalData.total) * 100;

        res.status(200).json({ progress, logs });

    } catch (error) {
        console.error('Error while reading logfile.log:', error);
        res.status(500).json({ error: 'There was an error while reading the status. Could not get the migration status' });
    }
});
console.log('Pool initialized:', pool);

// Iniciar servidor
>>>>>>> 7f921c470cf5c74ed5a3e04e0dcd193a8294f499
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);

    // ✅ List registered routes after server starts
    console.log("🔍 Loaded API routes:");
    app._router.stack.forEach((r) => {
        if (r.route && r.route.path) {
            console.log(`➡️ ${r.route.path}`);
        }
    });
});
