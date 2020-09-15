
var redis = require('redis');
var redisClient = redis.createClient();
io = require("socket.io-client");
ioClient = io.connect("http://localhost:6062");
var data = require('./data');

ioClient.on("viewDash", (msg) => {
    sendDashboardData();
});

ioClient.on("getAverageWait", (msg) => {
    sendAverageWait();
});

async function sendAverageWait(){
    var average = await getAverageWaitTime();
    ioClient.emit("avgWaitTime", average);
}

async function sendDashboardData(){
    var totalWaitingCalls = await getTotalWaitingCalls();
    var avgWaitTime = await getAverageWaitTime();
    var languagesData = await getNumberOfCallsPerLanguage();
    var languages = languagesData[0];
    var callPerLanguage = languagesData[1];
    var cityData = await getNumberOfCallsPerCity();
    var cities = cityData[0];
    var callsPerCity = cityData[1];
    var topicData = await getNumberOfCallsPerTopic();
    var topics = topicData[0];
    var callsPerTopic = topicData[1];
    var callTopicAndLanguageChartData = {
        topics : topics,
        topicsCount : callsPerTopic,
        languages : languages,
        languagesCount : callPerLanguage
    };
    var callTopicAndCitiesChartData = {
        topics : topics,
        topicsCount : callsPerTopic,
        cities : cities,
        citiesCount : callsPerCity
    };
    var totalWaitingListForAggregation = await getTotalWaitingForAggregation();
    var averageWaitTimeListForAggregation = await getAverageWaitForAggregation();
    var timeListForAggregation = await getTimeForAggregation();
    var dataForAggregationTabe = {
        totalWaitList: totalWaitingListForAggregation,
        averageWaitList: averageWaitTimeListForAggregation,
        timeList: timeListForAggregation
    }
    ioClient.emit("totalWaitingCallsForAggregation", dataForAggregationTabe);
    ioClient.emit("topicLang",callTopicAndLanguageChartData);
    ioClient.emit("cityTopic",callTopicAndCitiesChartData);
    ioClient.emit("totalWaiting",totalWaitingCalls);
    ioClient.emit("avgWaitTime", avgWaitTime);
}

async function getAverageWaitForAggregation(){
    let keys = await redisClient.keysAsync('waitTimeForAggregation-*');
    keys.sort();
    let averageWaitTimeList = [];
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        averageWaitTimeList.push(response);
    }
    return averageWaitTimeList;
}

async function getTotalWaitingForAggregation(){
    let keys = await redisClient.keysAsync('totalWaitingAgg-*');
    keys.sort();
    let totalWaitingList = [];
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        totalWaitingList.push(response);
    }
    return totalWaitingList;
}

async function getTimeForAggregation(){
    let keys = await redisClient.keysAsync('timeAgg-*');
    keys.sort();
    let timeList = [];
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        timeList.push(response);
    }
    return timeList;
}

async function getTotalWaitingCalls(){
    var totalWaitingCalls = -1;
    let response = await redisClient.getAsync("totalWaiting");
    if (response == null){
        totalWaitingCalls = 0;
    }
    else{
        totalWaitingCalls = response;
    }
    return totalWaitingCalls;
}

async function getAverageWaitTime(){
    var averageWaitTime = -1;
    let keys = await redisClient.keysAsync('wait*');
    var sum = 0;
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        sum += parseFloat(response);
    }
    averageWaitTime = sum/keys.length;
    if (Number.isNaN(averageWaitTime)) averageWaitTime = 0;
    return averageWaitTime;
}

async function getNumberOfCallsPerLanguage(){
    var langArray = []
    for(lang in data.languages)
        langArray.push(data.languages[lang].langEng);
    var countsLangArray = []
    for(lang in langArray){
        let response = await redisClient.getAsync('lang-'+langArray[lang]);
        if(response == null) countsLangArray.push(0);
        else countsLangArray.push(parseInt(response));
    }
    return [langArray, countsLangArray];
}

async function getNumberOfCallsPerTopic(){
    var topicArray = []
    for(topic in data.topics)
        topicArray.push(data.topics[topic].topicEng);
    var countsTopicArray = []
    for(topic in topicArray){
        let response = await redisClient.getAsync('topic-'+topicArray[topic]);
        if(response == null) countsTopicArray.push(0);
        else countsTopicArray.push(parseInt(response));
    }
    return [topicArray, countsTopicArray];
}

async function getNumberOfCallsPerCity(){
    var citiesArray = []
    for(city in data.cities)
        citiesArray.push(data.cities[city].cityEng);
    var countsCityArray = []
    for(city in citiesArray){
        let response = await redisClient.getAsync('city-'+citiesArray[city]);
        if(response == null) countsCityArray.push(0);
        else countsCityArray.push(parseInt(response));
    }
    return [citiesArray, countsCityArray];
}

module.exports = {getTotalWaitingCalls, getAverageWaitTime, getNumberOfCallsPerCity, 
    getNumberOfCallsPerTopic, getNumberOfCallsPerLanguage, getTotalWaitingForAggregation, getAverageWaitForAggregation };
