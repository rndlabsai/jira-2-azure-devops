import { registerUser, loginUser } from './userService.js';

async function main() {
    try {
       
         // Intentamos registrar un usuario
         await registerUser('andres123', 'SecurePass123!')
         .then(() => console.log("Usuario registrado con éxito."))
         .catch(err => console.log(err.message));

        // Intentamos hacer login
        const user = await loginUser('andres123', 'SecurePass123!');
        console.log('Bienvenido:', user.username);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
