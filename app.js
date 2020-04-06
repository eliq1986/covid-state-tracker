const statesUrl = "https://covidtracking.com/api/states";
const usaUrl = "https://covidtracking.com/api/us";
const ctx = document.getElementById('myChart');

let myChart;



/**
  * @desc Retrives covid-19 data to display
  * @param string url - url to fetch data from
  * @return promise - with data or error.
*/
async function getCovidData(url) {
  try {
    const covidData = await fetch(url);
    const covidJson = await covidData.json();
    return covidJson;
  }catch(e) {
    console.log(`Problem with getCovidData: ${e}`)
  }

}



/**
  * @desc Removes data from chart
  * @param object chart - points to instance of myChart
  * @return no return
*/
function removeData(chart) {
 chart.data.datasets[0].data.splice(0, 4)
 chart.update();
}



/**
  * @desc Adds data to chart
  * @param object chart - points to instance of myChart
  * @param array data - gets pushed onto chart array.
  * @return no return
*/
function addData(chart, data) {
  const { positive, negative, hospitalizedCurrently, death } = data[0];
  console.log(data[0]);
  chart.data.datasets[0].data.push(positive, negative, hospitalizedCurrently, death);
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

  const optionSelected = e.target.value;

  removeData(myChart);

  getCovidData(statesUrl).then(allStates => {

  const stateSelected = allStates.filter(state => state.state === optionSelected);

  addData(myChart, stateSelected);

  });
});
