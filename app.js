const statesUrl = "https://covidtracking.com/api/states";
const usaUrl = "https://covidtracking.com/api/us/daily";
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
   const [year, month, day] = date.slice(0,10).split("-");
   const time = date.slice(11,19);
   return `Last Updated: ${month}-${day}-${year} ${time}`;

 }

 function printLastModifiedMessage(date) {
    document.getElementById("last-updated").textContent =   formatsDateAndTime(date);

 }




getCovidData(usaUrl).then(totals => {

const totalPositive = totals.slice(0,10).map(day => day.positiveIncrease).reverse();
//printLastModifiedMessage(lastModified)
console.log(totalPositive)
const usaChart = new Chart(usaCtx, {
     type: 'line',
     data: {
         labels: ["10 days","9 days","8 days","7 days","6 days","5 days","4 days","3 days" , "Yesterday","Today"],
         datasets: [{

             data: [...totalPositive],
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
        labels: ["Positive", "Negative", "Currently Hospitalized", "Death"],
        datasets: [{
            data: [],
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
      legend: {
        display: false
      },
      title: {
        fontSize: 20,
        display: true,
        text: ""
      },
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
        labels: ["Positive", "Negative", "Currently Hospitalized", "Death"],
        datasets: [{
            data: [],
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
      legend: {
        display: false
      },
      title: {
        fontSize: 20,
        display: true,
        text: ""
      },
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
  const optionSelected = e.target.value;

   if(e.srcElement.id === "state-select-one") {
     const select = document.getElementById("state-select-one");
     const selectText = select.options[select.selectedIndex].textContent

    chartOne.options.title.text = selectText;

   removeData(chartOne);


     getCovidData(statesUrl).then(allStates => {

     const stateSelected = allStates.filter(state => state.state === optionSelected);
     addData(chartOne, stateSelected);
   });
 } else {

   const select = document.getElementById("state-select-two");
   const selectText = select.options[select.selectedIndex].textContent;

  chartTwo.options.title.text = selectText;

   removeData(chartTwo);

     getCovidData(statesUrl).then(allStates => {

     const stateSelected = allStates.filter(state => state.state === optionSelected);

     addData(chartTwo, stateSelected);

 });
}
});
