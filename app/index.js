const client = require('prom-client');
const express = require('express');
const app = express();
const port = 3000;

require('./tracing');

const client = require('prom-client');
const register = client.register;
const counter = new client.Counter({ name: 'test_requests_total', help: 'Total requests' });
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/', (req, res) => {
    counter.inc();
    console.log('Received request at /');
    res.send('Hello from test-app!');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
