
const io = require("socket.io");
const ioServerRedis = io(6063);
const kafka = require('../Kafka/kafkaProduce');

ioServerRedis.on("connection", (socket) => {
    console.log("new user connected to call center");

    socket.on("totalWaitingCalls", (msg) => { 
        console.log("got new message in Call center.js: ", msg); 
        kafka.publish(msg, "Mongo");
        kafka.publish(msg, "Redis");
    });

    socket.on("callDetails", (msg) => { 
        console.log(msg);
        kafka.publish(msg, "Mongo");
        kafka.publish(msg, "Redis");
    });
});