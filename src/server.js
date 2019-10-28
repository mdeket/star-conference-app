const WebSocket = require('ws');
const connect = require('connect');
const serveStatic = require('serve-static');

const wss = new WebSocket.Server({port: 8080});

let successes = 0;
let fails = 0;
let votes = [];

function addVote(data) {
    for (let i = 0; i < votes.length; i++) {
        if(votes[i].id === data.id) {
            // Reset old vote
            if(votes[i].vote === 1) {
                successes -= 1;
            } else if(votes[i].vote === 0) {
                fails -= 1;
            }

            // Record new vote
            if (data.vote === 1) {
                successes += 1;
            } else if (data.vote === 0) {
                fails += 1;
            }

            // Update vote
            votes[i] = data;
            return true;
        }
    }

    // Record new vote
    if (data.vote === 1) {
        successes += 1;
    } else if (data.vote === 0) {
        fails += 1;
    }

    // Update vote
    votes.push(data);
    return true;

}

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log(message);
        let data = JSON.parse(message);

        console.log(JSON.stringify({successes, fails}));
        addVote(data);

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