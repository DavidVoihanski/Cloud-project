//------------ kafka------------
const kafka = require('../Kafka/KafkaConsumer');
// websocket
io = require("socket.io");
ioServerMongo = io(6666);

kafka.consumer.on('data', function(data) {
    console.log("Got new kafka message in MongoNode: ", data.value.toString());
    var msg = data.value.toString();

    if (!msg.includes("city")){
        ioServerMongo.emit("totalWaitingCalls", msg);
    }
    else{
        ioServerMongo.emit("endCallReport", msg);
    }
});
