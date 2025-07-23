const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/search', (req, res) => {
    const query = req.body.query;
    if (!query) {
        return res.status(400).send({ error: 'Query is required' });
    }

    const command = `es -n 20 "${query}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send({ error: stderr });
        }
        res.send({ results: stdout.split('\n').filter(line => line.trim() !== '') });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});