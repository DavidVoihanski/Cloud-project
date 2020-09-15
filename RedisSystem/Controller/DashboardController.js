
Chart.defaults.global.defaultFontColor = 'white';

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
    chart = new Chart(location, {type:"bar"});
    var chartData =[{
            label: label,
            data: [data_],
            // this dataset is drawn below
            backgroundColor: colors,
            labels: "label"
            
    }]
    var chartOptions = {
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
    
    chart.data.datasets = chartData;
    chart.options = chartOptions;
    chart.update();
}
function removeData(chart, location){
    chart.destroy();
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

let CallsPerTopicChartCanvas =document.getElementById("CallsPerTopicChartCanvas").getContext('2d');
var CallsPerTopicChart = new Chart(CallsPerTopicChartCanvas, {
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
let CallsPerLanguageChartCanvas = document.getElementById("CallsPerLanguageChartCanvas").getContext('2d');
var CallsPerLanguageChart = new Chart(CallsPerLanguageChartCanvas, {
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
    socket.on("totalWaiting", (msg) => { updateTotalWaiting(msg);});
    socket.on("avgWaitTime", (msg) => { updateAvg(msg);});
    socket.on("topicLang", (msg) => { updateLanguageAndCallTopic(msg)});
    socket.on('cityTopic', (msg) => { updateCityAndCallTopic(msg)});
    socket.on("totalWaitingCallsForAggregation", (msg) => {updateAggregationTable(msg.totalWaitList, msg.averageWaitList, msg.timeList);
                                                    updateAggregationChart(msg)});
    socket.emit('viewDash',0); 
}

function updateAggregationTable(totalWaitingTable, avgWaitTimeTable, timeTable){
    let len = totalWaitingTable.length;
    var table = document.getElementById('SnapShotTable');
    for (var i = 0; i < len; i++){
        var tr = table.insertRow();
        var timeCell = tr.insertCell(0); 
        timeCell.innerHTML = timeTable[i];
        var totalWaitingCell = tr.insertCell(1); 
        totalWaitingCell.innerHTML = totalWaitingTable[i];
        var avgWaitTimeCell = tr.insertCell(2); 
        avgWaitTimeCell.innerHTML = avgWaitTimeTable[i]
    }
}
async function updateAggregationChart(msg){
    var totalWaitingChart = msg.totalWaitList;  
    var avgWaitTimeChart = msg.averageWaitList;
    var timeCart = msg.timeList;
    let WaitingCallsAggregetionChartCanvas =document.getElementById("WaitingCallsAggregetionChartCanvas").getContext('2d');
    var WaitingCallsAggregetionChart = new Chart(WaitingCallsAggregetionChartCanvas, {
    type: 'bar',
    data: {
        labels: timeCart,
        datasets: [{
            label: 'waiting calls',
            data: totalWaitingChart,
            backgroundColor: colors
        }]
    }
});
    let WaitingTimeAggregetionChartCanvas = document.getElementById("WaitingTimeAggregetionChartCanvas").getContext('2d');
    var WaitingTimeAggregetionChart = new Chart(WaitingTimeAggregetionChartCanvas, {
    type: 'bar',
    data: {
        labels: timeCart,
        datasets: [{
            label: 'waiting times',
            data: avgWaitTimeChart,
            backgroundColor: colors.reverse()
        }]
    }
    });
}

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
