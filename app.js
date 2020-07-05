const statesUrl = "https://covidtracking.com/api/states";
const usaUrl = "https://covidtracking.com/api/us/daily";
const statesDailyUrl = "https://covidtracking.com/api/v1/states/daily.json";


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
  * @param object chart - points to instance of specific chart
  * @return no return
*/
function removeData(chart) {
 chart.data.datasets[0].data.splice(0, 4)
 chart.update();
}



/**
  * @desc Adds data to chart
  * @param object chart - points to instance of specific chart
  * @param array data - gets pushed onto chart array.
  * @return no return
*/
function addData(chart, data) {
  const last28DaysData = formatLastTwentyEightDaysData(data);
  const {lastTwentyEightDays, totalPositive, totalNegative, deathIncrease, hospitalizedCurrently } = last28DaysData;

    chart.data.labels = [...lastTwentyEightDays]
    chart.data.datasets[0].data = [...totalPositive];
    chart.data.datasets[1].data = [...totalNegative];
    chart.data.datasets[2].data = [...hospitalizedCurrently];
    chart.data.datasets[3].data = [...deathIncrease];

    chart.update();
 }



 /**
   * @desc Calls multiple functions to update single chart
   * @param string optionSelected - State name
   * @param object chart - points to instance of specific chart
   * @return no return
 */
 function updateChart(optionSelected, chart) {

   removeData(chart);

   getCovidData(statesDailyUrl).then(data => {
     const stateSelectedData = data.filter(state => state.state === optionSelected);
     addData(chart, stateSelectedData);

   });


 }



 /**
   * @desc Adds data to chart
   * @param object chart - points to instance of specific chart
   * @param array data - gets pushed onto chart array.
   * @return no return
 */
 function formatsDateAndTime(date, stateBool) {

   const [year, month, day] = date.slice(0,10).split("-");
  if(stateBool) {
    return `${month}/${day}`
  }
   const time = date.slice(11,19);
   return `Last Updated: ${month}-${day}-${year} ${time}`;

 }



 /**
   * @desc Prints last updated date
   * @param string date - String that is formated => 04-06-2020 20:00:00
   * @return no return
 */
 function printLastModifiedMessage(date) {
    document.getElementById("last-updated").textContent =   formatsDateAndTime(date);
 }



 /**
   * @desc Prints selected state to chart title
   * @param chart chart - points to instance of specific chart
   * @return no return
 */
 function printStateName(chart, elementId) {
  chart.options.title.text = getSelectedOptionText(elementId)
 }



 /**
   * @desc Retrieves state selection option name
   * @return String - State name i.e. California
 */
 function getSelectedOptionText(elementId){
   const select = document.getElementById(elementId);
   const selectText = select.options[select.selectedIndex].textContent
   return selectText;
 }



 /**
   * @desc Formats USA data
   * @param array - last 28 days COVID-19 USA data
   * @return object - contains properties with USA data
  */
function formatLastTwentyEightDaysData(usaData) {

  const lastTwentyEightDays = usaData.slice(0,30).map(eachDay => formatsDateAndTime(eachDay.dateChecked, true)).reverse();

  const totalPositive = usaData.slice(0,30).map(day => day.positiveIncrease).reverse();
  const totalNegative = usaData.slice(0, 30).map(day => day.negativeIncrease).reverse();
  const hospitalizedCurrently = usaData.slice(0, 30).map(day => day.hospitalizedCurrently).reverse();
  const deathIncrease = usaData.slice(0, 30).map(day => day.deathIncrease).reverse();

  return {
    lastTwentyEightDays,
    totalPositive,
    totalNegative,
    hospitalizedCurrently,
    deathIncrease
  }
}


// Main chart USA
getCovidData(usaUrl).then(totals => {

 const { lastTwentyEightDays, totalPositive, totalNegative, hospitalizedCurrently, deathIncrease } = formatLastTwentyEightDaysData(totals);


 printLastModifiedMessage(totals[0].dateChecked);


const usaChart = new Chart(usaCtx, {
     type: 'line',
     data: {
         labels: [...lastTwentyEightDays],
         datasets: [{
             label: "# Increase of Positive Cases",
             fill: false,
             data: [...totalPositive],
             backgroundColor:['rgba(54, 162, 235, 0.2)'],
             borderColor:['rgba(54, 162, 235, 1)']

         },
         {
             label: "# Increase Of Negative Tests",
             fill: false,
             data: [...totalNegative],
             backgroundColor:['rgba(75, 192, 192, 0.2)'],
             borderColor:['rgba(75, 192, 192, 1)']
           },

         {
             label: "# of Currently Hospitalized",
             fill: false,
             data: [...hospitalizedCurrently],
             backgroundColor:['rgba(255, 206, 86, 0.2)'],
             borderColor:['rgba(255, 206, 86, 1)']

          },
         {
             label: "# Death Increase",
             fill: false,
             data: [...deathIncrease],
             backgroundColor:['rgba(255, 99, 132, 0.2)'],
             borderColor:['rgba(255, 99, 132, 1)']

           }
       ]
     },
     options: {
       responsive: true,
       maintainAspectRatio: false,
       legend: {
         display: true
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



//chart 1; lower left
const chartOne = new Chart(chart1Ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
          label: "# Increase of Positive Cases",
          fill: false,
          data: [],
          backgroundColor:['rgba(54, 162, 235, 0.2)'],
          borderColor:['rgba(54, 162, 235, 1)']
        },
        {
          label: "# Increase Of Negative Tests",
          fill: false,
          data: [],
          backgroundColor:['rgba(75, 192, 192, 0.2)'],
          borderColor:['rgba(75, 192, 192, 1)']
        },
        {
          label: "# of Currently Hospitalized",
          fill: false,
          data: [],
          backgroundColor:['rgba(255, 206, 86, 0.2)'],
          borderColor:['rgba(255, 206, 86, 1)']
        },
        {
          label: "# Death Increase",
          fill: false,
          data: [],
          backgroundColor:['rgba(255, 99, 132, 0.2)'],
          borderColor:['rgba(255, 99, 132, 1)']
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      title: {
        fontSize: 30,
        display: true,
        text: "STATE"
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




// chart 2; lower right
const chartTwo = new Chart(chart2Ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
          label: "# Increase of Positive Cases",
          fill: false,
          data: [],
          backgroundColor:['rgba(54, 162, 235, 0.2)'],
          borderColor:['rgba(54, 162, 235, 1)']
        },
        {
          label: "# Increase Of Negative Tests",
          fill: false,
          data: [],
          backgroundColor:['rgba(75, 192, 192, 0.2)'],
          borderColor:['rgba(75, 192, 192, 1)']
        },
        {
          label: "# of Currently Hospitalized",
          fill: false,
          data: [],
          backgroundColor:['rgba(255, 206, 86, 0.2)'],
          borderColor:['rgba(255, 206, 86, 1)']
        },
        {
          label: "# Death Increase",
          fill: false,
          data: [],
          backgroundColor:['rgba(255, 99, 132, 0.2)'],
          borderColor:['rgba(255, 99, 132, 1)']
        }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      title: {
        fontSize: 30,
        display: true,
        text: "STATE"
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




document.getElementById("select-state").addEventListener("change", e => {

  const optionSelected = e.target.value;
  const parentOptionId = e.srcElement.id;


   if(e.srcElement.id === "state-select-one") {
    updateChart(optionSelected, chartOne);
    printStateName(chartOne, parentOptionId);

 } else {

   updateChart(optionSelected, chartTwo);
   printStateName(chartTwo, parentOptionId);

}
});
