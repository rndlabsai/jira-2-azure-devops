import fetch from 'node-fetch';
import { readFileSync } from 'fs';

export const isEmptyString = (str) => {
    return str === null || str === undefined || str === '' || str.length === 0;
}

export const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message || "Assertion failed...");
    }
}

export const getHttpRequest = async (URL, headers) => {
    const response = await fetch(URL, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error("Invalid information, try again...");
    }

    return response;
}

export const readArrayFromFile = (filepath, property) => {
    const data = readFileSync(filepath);
    return JSON.parse(data)[property];
}