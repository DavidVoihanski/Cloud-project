
//------------ kafka------------
const kafka = require('../Kafka/KafkaConsumer');
const redisReceiver = require('../Redis4Ariel/RedisForArielReciver');

// websocket
io = require("socket.io");
ioServerRedis = io(6062);

ioServerRedis.on('connection', function (socket) { 
    socket.on("viewDash", (msg) => {
        viewDash();
    });
});

async function viewDash(){
    var totalWaitingCalls = await redisReceiver.getTotalWaitingCalls();
    console.log("Total waiting calls: ", totalWaitingCalls)
    var avgWaitTime = await redisReceiver.getAverageWaitTime();
    console.log("average waiting time: ", avgWaitTime)
    var languagesData = await redisReceiver.getNumberOfCallsPerLanguage();
    var languages = languagesData[0];
    var callPerLanguage = languagesData[1];
    var cityData = await redisReceiver.getNumberOfCallsPerCity();
    var cities = cityData[0];
    var callsPerCity = cityData[1];
    var topicData = await redisReceiver.getNumberOfCallsPerTopic();
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
    var totalWaitingListForAggregation = await redisReceiver.getTotalWaitingForAggregation();
    var averageWaitTimeListForAggregation = await redisReceiver.getAverageWaitForAggregation();
    var dataForAggregationTabe = {
        totalWaitList: totalWaitingListForAggregation,
        averageWaitList: averageWaitTimeListForAggregation
    }
    ioServerRedis.emit("totalWaitingCallsForAggregation", dataForAggregationTabe);
    ioServerRedis.emit("topicLang",callTopicAndLanguageChartData);
    ioServerRedis.emit("cityTopic",callTopicAndCitiesChartData);
    ioServerRedis.emit("totalWaiting",totalWaitingCalls);
    ioServerRedis.emit("avgWaitTime", avgWaitTime);
}


async function updateAverage(){
    var avgWaitTime = await redisReceiver.getAverageWaitTime();
    ioServerRedis.emit("avgWaitTime", avgWaitTime);
}

kafka.consumer.on('data', function(data) {
    //viewDash();
    console.log("Got new kafka message in RedsNode: ", data.value.toString());
    var msg = data.value.toString();
    msgJson = JSON.parse(msg);
    if (!msg.includes("city")){
        ioServerRedis.emit("totalWaiting", msg);
    }
    else{
        ioServerRedis.emit("endCallReport", msg);
        updateAverage();
    }
});
