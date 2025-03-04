import express from 'express';
import { retrieveAndWriteProjects } from './api_calls';

const app = express();

app.post('/api/jira/tokens', async (req, res) => {
    const { api_token, email, url } = req.body;
    // Here you can save the tokens in a file or database

    try {
        await retrieveAndWriteProjects(url, email, api_token);
    }
    catch (e) {
        if (e.cause && e.cause === 'invalid_token') {
            res.status(401).send({ message: "AUTHENTICATED_FAILED" });
            return;
        }
    }

    res.status(200).send({ message: "Jira information saved successfully!" });
});