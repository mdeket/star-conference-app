const WebSocket = require('ws');
const connect = require('connect');
const serveStatic = require('serve-static');

const wss = new WebSocket.Server({port: 8080});

let successes = 0;
let fails = 0;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(message);
        if (message === "1") {
            successes += 1;
        } else if (message === "0") {
            fails += 1;
        }
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({successes, fails}));
            }
        });
    });
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({successes, fails}));
        }
    });
});

connect().use(serveStatic(__dirname)).listen(8081, function () {
    console.log('Server running on 8080...');
});