import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { loginUser, registerUser } from './userService.js';
import pool from './db.js';
import { readArrayFromFile } from './utils/utils.js';
import { decryptToken, encryptToken } from './tokenService.js';

// Project's cache
let projects = [];

const app = express();

// ✅ Middleware must be applied BEFORE defining routes
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(bodyParser.json());

// ✅ Debugging: List routes when the server starts
app.use((req, res, next) => {
    console.log(`📌 Request received: ${req.method} ${req.url}`);
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

        res.json({ success: true, tokens: decryptedTokens });
    } catch (error) {
        console.error('❌ Error fetching tokens:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// ✅ Save Token Route
app.post('/api/save-token', async (req, res) => {
    try {
        const { username, token, email, url } = req.body;
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);

        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        const encryptedToken = encryptToken(token);
        const [tokenResult] = await pool.query(
            'INSERT INTO token (Number, Application, email, url) VALUES (?, ?, ?, ?)',
            [encryptedToken, 'Jira', email, url]
        );

        const tokenId = tokenResult.insertId;
        await pool.query('INSERT INTO tokenreg (username, id) VALUES (?, ?)', [username, tokenId]);

        res.status(200).json({ success: true, message: "Jira credentials saved successfully!" });
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

        res.status(200).json({ success: true, message: 'Token eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar el token:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

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
