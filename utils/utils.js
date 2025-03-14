import fetch from 'node-fetch';
import fs from 'fs';

export const isEmptyString = (str) => {
    return str === null || str === undefined || str === '' || str.length === 0;
}

export const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message || "Assertion failed...");
    }
}

export const repeatString = (str, times) => {
    let res = "";
    for (let i = 0; i < times; i++) {
        res += str;
    }
    return res;
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

export const createDirectory = (dirpath) => {
    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
    }
}

export const readArrayFromJSONFile = (filepath, property) => {
    if (!fs.existsSync(filepath)) {
        throw new Error("File does not exist...");
    }
    const data = fs.readFileSync(filepath);
    const array = JSON.parse(data)[property];
    return array ? array : [];
}

export const appendToLogFile = (filepath, text) => {
    assert(!isEmptyString(filepath), "Invalid filepath...");
    assert(!isEmptyString(text), "Invalid text...");

    const formatter = new Intl.DateTimeFormat('en', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
    const date = formatter.formatToParts().map(obj => obj.value).join('');

    text += date + "\n" + repeatString("=", 12) + "\n";
    if (fs.existsSync(filepath)) {
        fs.appendFileSync(filepath, text, 'utf8');
    }
    else {
        fs.writeFileSync(filepath, text, 'utf8');
    }
}

export const downloadFile = async (download_url, destiny_file, log_download = false, log_file = null) => {
    if (log_download && log_file) {
        appendToLogFile(log_file, `Downloading file from ${download_url} to ${destiny_file}`);
    }
    const ws = fs.createWriteStream(destiny_file);
    ws.write(await (await fetch(download_url)).chunk());
    ws.end();
}