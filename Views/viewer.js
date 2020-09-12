


var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
'#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
'#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
'#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
'#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
'#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
'#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
'#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
'#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
'#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

let totalWaitingChartLocation = document.getElementById("SnapShotChartTotals").getContext('2d');
var totalWaitingChart = new Chart(totalWaitingChartLocation, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'Total waiting',
            data: 0,
            // this dataset is drawn below
            backgroundColor: colors,
            labels: "Total waiting"
    }]
    },
     options: {
        responsive: true,
        scales: {
            yAxes: [{
                    display: true,
                    ticks: {
                        max: 1,
                        min: 0,
                        stepSize: 1
                    }
                }]
        }
    }
});

let myChartAvgLocation = document.getElementById("SnapShotChartAvg").getContext('2d');
var chartAvg = new Chart(myChartAvgLocation, {
    type: 'bar',
    data: {
        datasets: [{
            label: 'Average',
            data: 1,
            // this dataset is drawn below
            backgroundColor: colors,
            labels: "Average"
    }]
    },
    options: {
        responsive: true,
        scales: {
            yAxes: [{
                    display: true,
                    ticks: {
                        max: 1,
                        min: 0,
                        stepSize: 1
                    }
                }]
        }
    }
});

function addData(chart, label, data_, location) {
  
    chart = new Chart(location, {
        type: 'bar',
        data: {
            datasets: [{
                label: label,
                data: [data_],
                // this dataset is drawn below
                backgroundColor: colors,
                labels: "label"
        }]
        },
        options: {
            responsive: true,
            tooltips: { callbacks: { title: function(tooltipItem, data) { 
                return  data.labels[tooltipItem.Index]; }}
            },
            scales: {
                yAxes: [{
                        display: true,
                        ticks: {
                            max: parseInt(data_) + 1,
                            min: 0,
                            stepSize: Math.ceil(parseInt(data_)/5)
                        }
                    }]
            }
        }
    });
    chart.update();
}
function removeData(chart, location){
    chart.destroy();
    //location.clear();
   
    //chart.update();
}
function updateAvg(avg){
    removeData(window.chartAvg, myChartAvgLocation);
    addData(window.chartAvg, "Average", avg, myChartAvgLocation);
}

function updateTotalWaiting(totals){
    removeData(totalWaitingChart, totalWaitingChartLocation);
    addData(window.totalWaitingChart, "Total waiting", totals, totalWaitingChartLocation);
}

async function updateLanguageAndCallTopic(msg){
    langs = msg.languages;
    topics = msg.topics;
    topicCount = msg.topicsCount;
    langCount = msg.languagesCount;
let colors3 = []

colors3 = ['#49A9EA', '#36CAAB', '#34495E', '#B370CF','#49A9EA', '#36CAAB', '#34495E', '#B370CF','#49A9EA', '#36CAAB', '#34495E', '#B370CF'];

let myChart3 =document.getElementById("lastChart").getContext('2d');
var chart3 = new Chart(myChart3, {
    type: 'pie',
    data: {
        datasets: [{
            label: 'Topics',
            data: topicCount,
            backgroundColor: colors
        }],
        labels: topics,
    }
});
let myChart4 = document.getElementById("lastChart2").getContext('2d');
var chart4 = new Chart(myChart4, {
    type: 'doughnut',
    data: {
        datasets: [{
            label: 'Language',
            data: langCount,
            backgroundColor: colors.reverse()
        }],
        labels: langs,
    }
});
}


async function initSocket() {
    socket = io.connect("http://localhost:6062");
    alert("connected");
    socket.on("totalWaiting", (msg) => { updateTotalWaiting(msg);});
    socket.on("avgWaitTime", (msg) => { updateAvg(msg);});
    socket.on("topicLang", (msg) => { updateLanguageAndCallTopic(msg)});
    socket.on('cityTopic', (msg) => { updateCityAndCallTopic(msg)});
    socket.emit('viewDash',0); 
}
      

/*
let myChart1 = document.getElementById("RealTimeChart").getContext('2d');
let chart1 = new Chart(myChart1, {
    type: 'bar',
    data: {
        labels:  labels1,
        datasets: [ {
            data: data1,
            backgroundColor: colors1
        }]
    },
    options: {
        title: {
            text: "Do you like doughnuts?",
            display: true
        }
    }

});
*/


function updateCityAndCallTopic(msg){
    cities = msg.cities;
    topics = msg.topics;
    topicCount = msg.topicsCount;
    citiesCount = msg.citiesCount;
    var rowLen = Math.max(topics.length,cities.length)
    var table = document.getElementById('cityTopicsTable');
    for(var i=0; i<rowLen; i++){
        var tr = table.insertRow();
        if(i < cities.length){
            var c = tr.insertCell(0); 
            c.innerHTML = cities[i];
            var cC = tr.insertCell(1); 
            cC.innerHTML = citiesCount[i]
        }
        if(i < topics.length){
            var t = tr.insertCell(2);
            t.innerHTML = topics[i];
            var tC = tr.insertCell(3); 
            tC.innerHTML = topicCount[i]
        }
}
}
