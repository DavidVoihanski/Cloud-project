
//------------ kafka------------
const kafka = require('../Kafka/KafkaConsumer');
const redisReceiver = require('../Model/RedisForArielReciver');

// websocket
io = require("socket.io");
ioServerRedis = io(6062);

ioServerRedis.on('connection', function (socket) {
    socket.on("viewDash", (msg) => {
        ioServerRedis.emit("viewDash", msg);
    });
    socket.on("totalWaitingCallsForAggregation", (msg) => {
        ioServerRedis.emit("totalWaitingCallsForAggregation", msg);
    });
    socket.on("topicLang", (msg) => {
        ioServerRedis.emit("topicLang", msg);
    });
    socket.on("cityTopic", (msg) => {
        ioServerRedis.emit("cityTopic", msg);
    });
    socket.on("totalWaiting", (msg) => {
        ioServerRedis.emit("totalWaiting", msg);
    });
    socket.on("avgWaitTime", (msg) => {
        ioServerRedis.emit("avgWaitTime", msg);
    });
});


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
        ioServerRedis.emit("getAverageWait", 0);
    }
});
