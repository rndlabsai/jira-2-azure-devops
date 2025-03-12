import express from 'express';
import cors from 'cors';
import { loginUser, registerUser } from './userService.js';
import pool from './db.js';
import bodyParser from 'body-parser';
import { readArrayFromJSONFile } from './utils/utils.js';
import { migrate } from './api_calls/index.js';
import { decryptToken, encryptToken } from './tokenService.js';

// project's cache
let projects = [];
// url's cache
let URL = null;
// email's cache
let EMAIL = null;
// token's cache
let API_TOKEN = null;

const app = express();
// app.use(express.json()); // Para manejar JSON en requests
// app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Permitir solicitudes desde el frontend

// app.options('*', cors());

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Habilitar CORS
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/jira/tokens', bodyParser.json(), async (req, res, next) => {
    try {
        const { _, token, email, url } = req.body;
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

    next();
})

/********* GET ENDPOINTS */
// Ruta de prueba para verificar conexión
app.get('/api/test', (_, res) => {
    res.json({ message: "Backend funcionando correctamente" });
});

app.get('/api/tokens', async (req, res) => {
    try {
        const { username } = req.query;

        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Obtener los tokens asociados con el usuario
        const [tokens] = await pool.query(`
            SELECT t.id, t.Number, t.Application, t.email, t.url 
            FROM token t
            JOIN tokenreg tr ON t.id = tr.id
            WHERE tr.username = ?
        `, [username]);

        console.log("Tokens devueltos en /api/tokens:", tokens); // Debug

        // Decrypt the tokens before sending them back
        const decryptedTokens = tokens.map(token => ({
            id: token.id, // 🔹 Asegurar que el id se devuelve
            Number: decryptToken(token.Number),
            Application: token.Application,
            email: token.email,
            url: token.url
        }));

        res.json({ success: true, tokens: decryptedTokens });
    } catch (error) {
        console.error('Error al obtener los tokens:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});


app.get('/api/jira/projects', async (_, res) => {
    projects = projects.length === 0 ? readArrayFromJSONFile("./json/projects.json", "projects") : projects;
    res.status(200).send({ projects, status: "ok" });
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
        const { username, token, email, url } = req.body;

        // Check if user exists
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Encrypt token before saving
        const encryptedToken = encryptToken(token);

        // Insert token
        const [tokenResult] = await pool.query(
            'INSERT INTO token (Number, Application, email, url) VALUES (?, ?, ?, ?)',
            [encryptedToken, 'Jira', email, url]
        );

        const tokenId = tokenResult.insertId; // New token ID

        // Register token ownership
        await pool.query('INSERT INTO tokenreg (username, id) VALUES (?, ?)', [username, tokenId]);

        res.status(200).json({ success: true, message: "Jira credentials saved successfully!" });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


app.delete('/api/delete-token', bodyParser.json(), async (req, res) => {
    try {
        const { username, tokenId } = req.body;

        if (!username || !tokenId) {
            return res.status(400).json({ success: false, message: 'Faltan parámetros requeridos.' });
        }

        console.log("Solicitud para eliminar token:", { username, tokenId }); // Debug

        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Verificar si el token pertenece al usuario
        const [tokenRows] = await pool.query(`
            SELECT t.id FROM token t
            JOIN tokenreg tr ON t.id = tr.id
            WHERE tr.username = ? AND t.id = ?
        `, [username, tokenId]);

        console.log("Resultados de la consulta en /api/delete-token:", tokenRows); // Debug

        if (tokenRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Token no encontrado o no pertenece al usuario' });
        }

        // Eliminar la relación en `tokenreg`
        await pool.query('DELETE FROM tokenreg WHERE username = ? AND id = ?', [username, tokenId]);

        // Eliminar el token de la tabla `token`
        await pool.query('DELETE FROM token WHERE id = ?', [tokenId]);

        res.status(200).json({ success: true, message: 'Token eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el token:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.post('/api/migration', async (req, res) => {
    const { origin, destination, options } = req.body;

    if (!origin || !destination || !options) {
        return res.status(400).json({ message: "Missing required parameters." });
    }

    if (start) {
        migrate(URL, EMAIL, API_TOKEN, origin, "./logfile.log", "./json/total.json", ["./json/custom_fields", "./json/workflows", "./json/issues"]);
        res.status(200).json({
            message: "Migration request received successfully.",
            receivedData: { origin, destination, options }
        });
    }
});

console.log('Pool initialized:', pool);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});