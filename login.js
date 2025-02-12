import { error } from 'console';
import fs from 'fs';

const passwordIsValid = (password) => {
    if (password.length < 8) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[a-zA-Z]/.test(password)) {
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return false;
    }

    return true;
}

const isUsernameUnique = (username) => {
    const filepath = './credentials.json';
    let data = { credentials: [] };

    if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    return data.credentials.find(credential => credential.username === username) === undefined;
}

const saveCredentials = (username, password) => {
    const filepath = './credentials.json';
    let data = { credentials: [] };

    if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    data.credentials.push({ username, password });

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
}

export const createAccount = (username, password) => {
    if (!isUsernameUnique(username)) {
        throw new Error('Username already exists...');
    }

    if (!passwordIsValid(password)) {
        throw new Error('Password is invalid...');
    }

    saveCredentials(username, password);
    console.log("Account created successfully...");
}

export const login = (username, password) => {
    const filepath = './credentials.json';
    let data = { credentials: [] };

    if (fs.existsSync(filepath)) {
        data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }

    const credential = data.credentials.find(credential => credential.username === username && credential.password === password);

    if (!credential) {
        throw new Error('Invalid credentials...');
    }

    console.log("Loged in successfully...");
}