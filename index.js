import express from 'express';
import cors from 'cors';
import { loginUser, registerUser } from './userService.js';

const app = express();
app.use(express.json()); // Para manejar JSON en requests
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // Permitir solicitudes desde el frontend

// Ruta de prueba para verificar conexión
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend funcionando correctamente" });
});

// Ruta para login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        res.json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

// Ruta para registro
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        await registerUser(username, password);
        res.json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


// Guardar token de Jira
app.post('/api/save-token', async (req, res) => {
    try {
        const { username, token, email, url } = req.body;

        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
        if (userRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Insertar el token en la tabla `token`
        const [tokenResult] = await pool.query(
            'INSERT INTO token (number,app, email, url) VALUES (?, ?, ?, ?)',
            [token,'Jira', email, url]
        );

        const tokenNumber = tokenResult.insertId; // ID del token recién insertado

        // Registrar la relación en `tokenReg`
        await pool.query('INSERT INTO tokenReg (userName, number) VALUES (?, ?)', [username, tokenNumber]);

        res.json({ success: true, message: 'Token guardado con éxito' });
    } catch (error) {
        console.error('Error al guardar el token:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
