// const Chart = require('chart.js');

const url = 'ws://192.168.1.105:8080';
const connection = new WebSocket(url);
let myChart;
let voteCounter = 0;


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

if (!localStorage.getItem('id')) {
    console.log('No ID found.');
    let id = uuidv4();
    console.log(id);
    localStorage.setItem('id', id);
}

if (localStorage.getItem("voted")) {
    if (localStorage.getItem("voted") === "success") {
        document.getElementById("lastVote").innerHTML = "You voted: Succeeded";
    } else {
        document.getElementById("lastVote").innerHTML = "You voted: Failed";
    }
}

connection.onopen = () => {
    // connection.send('hey')
};

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
};

connection.onmessage = (e) => {
    let response = JSON.parse(e.data);
    let success = response.successes;
    let fails = response.fails;
    myChart.data.datasets[0].data[0] = success;
    myChart.data.datasets[0].data[1] = fails;
    if (success >= fails && success > myChart.options.scales.yAxes[0].ticks.max) {
        myChart.options.scales.yAxes[0].ticks.max = success + 5;
    }

    if (success < fails && fails > myChart.options.scales.yAxes[0].ticks.max) {
        myChart.options.scales.yAxes[0].ticks.max = fails + 5;
    }

    myChart.update();
};

sendMessage = (vote, id) => {
    connection.send(JSON.stringify({vote, id}));
};

function justVoted() {

    voteCounter += 1;
    let interval = setInterval(function () {
        if (voteCounter >= 3) {
            voteCounter = 0;
            location.href = 'https://i1.wp.com/picsmine.com/wp-content/uploads/2017/04/Please-just-stop-Stop-Meme.jpg?resize=400%2C400';
        }
        voteCounter = 0;
        clearInterval(interval);
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
    console.log('Your document is ready!');

    Chart.defaults.global.defaultFontColor = 'white';
    let success = document.getElementById("succeeded");
    success.addEventListener("click", () => {
        justVoted();
        localStorage.setItem('voted', "success");
        document.getElementById("lastVote").innerHTML = "You voted: Succeeded";
        sendMessage(1, localStorage.getItem('id'));
    });

    let fail = document.getElementById("failed");
    fail.addEventListener("click", () => {
        justVoted();
        localStorage.setItem('voted', "fail");
        document.getElementById("lastVote").innerHTML = "You voted: Failed";
        sendMessage(0, localStorage.getItem('id'));
    });


    let ctx = document.getElementById('bar-chart');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Succeeded", "Failed"],
            datasets: [
                {
                    label: "Votes",
                    backgroundColor: ["#47b9e7", "#47b9e7"],
                    data: [0, 0]
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            aspectRatio: 1,
            legend: {
                position: 'bottom',
                labels: {
                    fontColor: 'white',
                    defaultFontFamily: 'Montserrat'
                }
            },
            hover: {
                mode: 'label'
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        stepValue: 2,
                        max: 6,
                        min: 0
                    }
                }]
            },
            title: {
                display: true,
                text: 'Result'
            }
        }
    });
});

