// const Chart = require('chart.js');

const url = 'ws://192.168.1.105:8080';
const connection = new WebSocket(url);
let myChart;

connection.onopen = () => {
    connection.send('hey')
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
    if(success >= fails && success > myChart.options.scales.yAxes[0].ticks.max) {
        myChart.options.scales.yAxes[0].ticks.max = success + 5;
    }

    if(success < fails && fails > myChart.options.scales.yAxes[0].ticks.max) {
        myChart.options.scales.yAxes[0].ticks.max = fails + 5;
    }

    myChart.update();
};

sendMessage = (data) => {
    connection.send(data);
};

document.addEventListener("DOMContentLoaded", function () {
    console.log('Your document is ready!');


    Chart.defaults.global.defaultFontColor = 'white';

    let success = document.getElementById("succeeded");
    success.addEventListener("click", () => sendMessage(1));

    let fail = document.getElementById("failed");
    fail.addEventListener("click", () => sendMessage(0));

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
                    // This more specific font property overrides the global property
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

