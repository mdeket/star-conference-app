const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let successes = 0;
let fails = 0;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(message);
    if(message == "1") {
      successes += 1;
    } else if(message == "0"){
      fails += 1;
    }
    ws.send(JSON.stringify({successes, fails}));

  });
  ws.send("Server: Connected")
});