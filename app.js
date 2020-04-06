const statesUrl = "https://covidtracking.com/api/states";
const usaUrl = "https://covidtracking.com/api/v1/us/current.json";
const usaCtx = document.getElementById("usa-chart");
const chart1Ctx = document.getElementById("chart-one");
const chart2Ctx = document.getElementById("chart-two");



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
  chart.data.datasets[0].data.push(positive, negative, hospitalizedCurrently, death);
  chart.update();
 }


 function updateChart(optionSelected) {

   removeData(usaChart);

   getCovidData(statesUrl).then(allStates => {

   const stateSelected = allStates.filter(state => state.state === optionSelected);

   addData(usaChart, stateSelected);

   });
 }


 function formatsDateAndTime(date) {
   console.log(date);
   const [year, month, day] = date.slice(0,10).split("-");
   const time = date.slice(11,19);
   return `Last Updated: ${month}-${day}-${year} ${time}`;

 }

 function printLastModifiedMessage(date) {
    document.getElementById("last-updated").textContent =   formatsDateAndTime(date);

 }




getCovidData(usaUrl).then(totals => {
const { positive, negative, hospitalizedCurrently, death, lastModified } = totals[0];
printLastModifiedMessage(lastModified)

const usaChart = new Chart(usaCtx, {
     type: 'bar',
     data: {
         labels: ["Positive", "Negative", "Currently Hospitalized", "Death"],
         datasets: [{

             data: [positive, negative, hospitalizedCurrently, death],
             backgroundColor: [
                 'rgba(54, 162, 235, 0.2)',
                 'rgba(255, 206, 86, 0.2)',
                 'rgba(75, 192, 192, 0.2)',
                 'rgba(255, 99, 132, 0.2)'
             ],
             borderColor: [
                 'rgba(54, 162, 235, 1)',
                 'rgba(255, 206, 86, 1)',
                 'rgba(75, 192, 192, 1)',
                 'rgba(255, 99, 132, 1)',
             ],
             borderWidth: 1
         }]
     },
     options: {
       responsive: true,
       maintainAspectRatio: false,
       legend: {
         display: false
       },
       title: {
         fontSize: 30,
         display: true,
         text: "USA"
       },

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


const chartOne = new Chart(chart1Ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});



const chartTwo = new Chart(chart2Ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});


document.getElementById("select-state").addEventListener("change", e => {



});
