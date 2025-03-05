import express from 'express';
import { retrieveAndWriteProjects } from './api_calls/index.js';
import bodyParser from 'body-parser';

const PORT = 4000;

const app = express();

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/jira/tokens', bodyParser.json(), async (req, res) => {
    const { api_token, email, url } = req.body;
    // Here you can save the tokens in a file or database

    try {
        await retrieveAndWriteProjects(url, email, api_token, "./json/projects.json");
    }
    catch (e) {
        if (e.cause && e.cause === 'invalid_token') {
            res.status(401).send({ message: "AUTHENTICATED_FAILED" });
            return;
        }
        else {
            res.status(500).send({ message: "Internal server error" });
            return;
        }
    }

    res.status(200).send({ message: "Jira information saved successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});