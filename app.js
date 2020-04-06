const statesUrl = "https://covidtracking.com/api/states";
const usaUrl = "https://covidtracking.com/api/us";
const ctx = document.getElementById('myChart');

let myChart;


async function getCovidData(url) {
  try {
    const covidData = await fetch(url);
    const covidJson = await covidData.json();
    return covidJson;
  }catch(e) {
    console.log(`Problem with getCovidData: ${e}`)
  }

}


function removeData(chart) {
 chart.data.datasets[0].data.splice(0, 4)
 chart.update();
}


function addData(chart, label, data) {
console.log(data[0])

  chart.data.datasets[0].data.push(data[0].positive, data[0].negative, data[0].hospitalizedCurrently, data[0].death);
    chart.update();
}




getCovidData(usaUrl).then(totals => {

const { positive, negative, hospitalizedCurrently, death } = totals[0];

  myChart = new Chart(ctx, {
     type: 'bar',
     data: {
         labels: ["Positive", "Negative", "Currently Hospitalized", "Death"],
         datasets: [{
             label: 'COVID-19',
             data: [positive, negative, hospitalizedCurrently, death],
             backgroundColor: [
                 'rgba(255, 99, 132, 0.2)',
                 'rgba(54, 162, 235, 0.2)',
                 'rgba(255, 206, 86, 0.2)',
                 'rgba(75, 192, 192, 0.2)'
             ],
             borderColor: [
                 'rgba(255, 99, 132, 1)',
                 'rgba(54, 162, 235, 1)',
                 'rgba(255, 206, 86, 1)',
                 'rgba(75, 192, 192, 1)'
             ],
             borderWidth: 1
         }]
     },
     options: {
         scales: {
             yAxes: [{
                 ticks: {
                     beginAtZero: true
                 }
             }]
         }
     }
  });





});


document.getElementById("state-select").addEventListener("change", e => {
  removeData(myChart);
  getCovidData(statesUrl).then(results => {

  const stateSelected = results.filter(state => state.state === e.target.value);

  addData(myChart, undefined, stateSelected);

  });
});
