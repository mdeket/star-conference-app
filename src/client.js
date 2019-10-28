// const Chart = require('chart.js');

const url = 'ws://localhost:8080';
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
  myChart.data.datasets[0].data[0] = response.successes;
  myChart.data.datasets[0].data[1] = response.fails;
  myChart.update();
};

sendMessage = (data) => {
  connection.send(data);
};

document.addEventListener("DOMContentLoaded", function () {
  console.log('Your document is ready!');

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
          backgroundColor: ["#3e95cd", "#8e5ea2"],
          data: [0, 0]
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      aspectRatio:1
    }
  });
});

