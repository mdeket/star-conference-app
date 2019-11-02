const server = require('http').createServer();
const io = require('socket.io')(server);

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
            io.sockets.emit('recorded', {successes, fails});
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
    io.sockets.emit('recorded', {successes, fails});
    return true;

}

io.sockets.on('connection', client => {
    console.log('CONNECTED');

    client.emit('recorded', {successes, fails});


    client.on('vote', data1 => {
        console.log(data1);
        let data = data1;

        console.log(JSON.stringify({successes, fails}));
        addVote(data);

        client.emit('recorded', {successes, fails});
    });
});
server.listen(3000);
