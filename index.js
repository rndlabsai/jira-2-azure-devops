import express from 'express';
// import cors from 'cors';
import { loginUser, registerUser } from './userService.js';
import pool from './db.js';
import bodyParser from 'body-parser';

// project's cache
let projects = [];

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

app.use('/api/jira/tokens', bodyParser.json(), async (req, res, next) => {
    try {
        const { _, token, email, url } = req.body;
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

// Ruta para obtener tokens de un usuario
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
            SELECT t.Number, t.Application, t.email, t.url 
            FROM token t
            JOIN tokenreg tr ON t.id = tr.id
            WHERE tr.username = ?
        `, [username]);

        res.json({ success: true, tokens });
        console.log("Respuesta de la API:", tokens);
    } catch (error) {
        console.error('Error al obtener los tokens:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.get('/api/jira/projects', async (_, res) => {
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

// Guardar token de Jira
app.post('/api/jira/tokens', bodyParser.json(), async (req, res) => {
    try {
        const { username, token, email, url } = req.body;

        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Insertar el token en la tabla `token`
        const [tokenResult] = await pool.query(
            'INSERT INTO token (Number, Application, email, url) VALUES (?, ?, ?, ?)',
            [token, 'Jira', email, url]
        );

        const tokenId = tokenResult.insertId; // ID del token recién insertado

        // Registrar la relación en `tokenreg`
        await pool.query('INSERT INTO tokenreg (username,id) VALUES (?, ?)', [username, tokenId]);

        res.status(200).send({ message: "Jira credentials saved successfully!" });
    }
    catch (error) {
        console.error('Error al guardar el token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



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

console.log('Pool initialized:', pool);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});

