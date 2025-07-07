require('./tracing');

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const client = require('prom-client');
const register = client.register;
const counter = new client.Counter({ name: 'test_requests_total', help: 'Total requests' });
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/', (req, res) => {
    counter.inc();
    console.log('Received request at /');
    res.send('Hello Hello from test-app!');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
app.get('/call', async (req, res) => {
    const resp = await axios.get('http://sub1-app.project-test-app.svc.cluster.local:3000/work');
    res.send(`Main-app -> ${resp.data}`);
});
app.get('/ping', async (req, res) => {
    try {
        const response = await axios.get('https://httpbin.org/get');
        res.json({
            message: 'pong',
            external: response.data.url,
        });
    } catch (err) {
        console.error('❌ 외부 요청 실패:', err.message);
        res.status(500).send('Error during external request');
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
