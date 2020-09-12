
var redis = require('redis');
var redisClient = redis.createClient();
var data = require('../Model/data');

async function getAverageWaitForAggregation(){
    let keys = await redisClient.keysAsync('waitTimeForAggregation-*');
    let averageWaitTimeList = [];
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        averageWaitTimeList.push(response);
    }
    return averageWaitTimeList;
}

async function getTotalWaitingForAggregation(){
    let keys = await redisClient.keysAsync('totalWaitingAgg-*');
    let totalWaitingList = [];
    for(var i=0;i< keys.length;i++){
        let response = await redisClient.getAsync(keys[i]);
        totalWaitingList.push(response);
    }
    return totalWaitingList;
}

async function getTotalWaitingCalls(){
    var totalWaitingCalls = -1;
    let response = await redisClient.getAsync("totalWaiting");
    console.log(response)
    if (response == null){
        totalWaitingCalls = 0;
    }
    else{
        totalWaitingCalls = response;
    }
    console.log(totalWaitingCalls)
    return totalWaitingCalls;
}

async function getAverageWaitTime(){
    var averageWaitTime = -1;
    let keys = await redisClient.keysAsync('wait*');
    console.log("Keys: ", keys)
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
