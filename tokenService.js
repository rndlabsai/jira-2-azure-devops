import crypto from 'crypto';
import pool from './db.js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY.padEnd(32, '0'); // Llave de 32 bytes
const IV_LENGTH = 16;

// 🔐 Cifrar token
const encryptToken = (token) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// 🔓 Desencriptar token
const decryptToken = (encryptedToken) => {
    let parts = encryptedToken.split(':');
    let iv = Buffer.from(parts[0], 'hex');
    let encryptedText = Buffer.from(parts[1], 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
};

// Agregar un token para un usuario
export const saveUserToken = async (username, token, application) => {
    const encryptedToken = encryptToken(token);

    // Guardar en tabla `token`
    const [result] = await pool.query('INSERT INTO token (application) VALUES (?) ON DUPLICATE KEY UPDATE application = application', [application]);

    // Obtener el `number` del token insertado
    const [tokenRow] = await pool.query('SELECT number FROM token WHERE application = ?', [application]);
    if (tokenRow.length === 0) throw new Error('No se pudo recuperar el número del token');

    const tokenNumber = tokenRow[0].number;

    // Relacionar en `tokenreg`
    await pool.query('INSERT INTO tokenreg (username, number) VALUES (?, ?)', [username, tokenNumber]);

    return { message: 'Token almacenado correctamente' };
};

// Obtener tokens de un usuario
export const getUserTokens = async (username) => {
    const [rows] = await pool.query(
        `SELECT token.number, token.application 
         FROM token 
         INNER JOIN tokenreg ON token.number = tokenreg.number
         WHERE tokenreg.username = ?`, 
        [username]
    );

    if (rows.length === 0) throw new Error('No se encontraron tokens para este usuario');

    return rows.map(row => ({
        number: row.number,
        application: row.application
    }));
};
