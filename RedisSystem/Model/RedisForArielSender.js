// הפעילו את 
// redis
// מתמונת דוקר הנמצאית כאן
// https://hub.docker.com/_/redis
var bluebird = require('bluebird')
var redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var redisClient = redis.createClient()
io = require("socket.io-client");
ioClient = io.connect("http://localhost:6062");
async = require('async');

var todayEnd = new Date().setHours(23, 59, 59, 999);
var updatedTotalWaitingCalls = new Date().setHours(0, 0, 0, 0);
var totalWaitingCallsCounter = 0;
var averageWaitTimeCounter = 0;
var tempAverageWait = 0;
var updatedAverageWait = new Date().setHours(0, 0, 0, 0);
var numberOfCallsForAvg = 0;


redisClient.keys('lang-*', function (err, keys) {
    if (err) return console.log(err);
    async.map(keys, function (key, cb) {
        redisClient.get(key, function (error, value) {
            redisClient.ttl(key, function (er, ttl) {
                if (error | er) return cb(error);
                var job = {};
                job['key'] = key;
                job['val'] = value;
                job['ttl'] = ttl;
                cb(null, job);
            });
        });
    },
        function (error, results) {
            if (error) return console.log(error);
            console.log(results);
        }
    )
});
ioClient.on("endCallReport", (msg) => {
    callDetailsJson = JSON.parse(msg)
    console.log("end call report in redis: ", msg);
    var Callkey = 'callReport-' + callDetailsJson.id;
    redisClient.set(Callkey, msg, function (err, reply) {
        redisClient.expireat(Callkey, parseInt(todayEnd / 1000));
    });
    var key = 'waitingTime-' + callDetailsJson.id;
    
    if ( Math.floor((new Date() - updatedAverageWait)/60000) > 5 ) {
        updatedAverageWait = new Date();
        if (numberOfCallsForAvg > 0){
            tempAverageWait = tempAverageWait/numberOfCallsForAvg;
        }
        redisClient.set("waitTimeForAggregation-" + averageWaitTimeCounter, callDetailsJson.totalTime, function (err, reply) {
            redisClient.expireat(key, parseInt((+new Date) / 1000) + 600);
        });
        averageWaitTimeCounter += 1;
        tempAverageWait = 0;
        numberOfCallsForAvg = 0;
    }
    else{
        numberOfCallsForAvg += 1;
        tempAverageWait += callDetailsJson.totalTime;
    }
    redisClient.set(key, callDetailsJson.totalTime, function (err, reply) {
        redisClient.expireat(key, parseInt((+new Date) / 1000) + 600);
    });
    var cityName = "city-" + callDetailsJson.city;
    redisClient.get(cityName, function (err, key) {
        if (err) return console.log(err);
        if (key == null) {
            redisClient.set(cityName, 1, function (err, reply) {
                redisClient.expireat(cityName, parseInt(todayEnd / 1000));
            });
        }
        else redisClient.incr(cityName);
    });
    var topicName = "topic-" + callDetailsJson.topic;
    redisClient.get(topicName, function (err, key) {
        if (err) return console.log(err);
        if (key == null) {
            redisClient.set(topicName, 1, function (err, reply) {
                redisClient.expireat(topicName, parseInt(todayEnd / 1000));
            });
        }
        else redisClient.incr(topicName);
    });
    var langName = "lang-" + callDetailsJson.language;
    redisClient.get(langName, function (err, key) {
        if (err) return console.log(err);
        if (key == null) {
            redisClient.set(langName, 1, function (err, reply) {
                redisClient.expireat(langName, parseInt(todayEnd / 1000));
            });
        }
        else redisClient.incr(langName);
    });
});
var totalKey = "totalWaiting";
ioClient.on(totalKey, (msg) => {
    if ( Math.floor((new Date() - updatedTotalWaitingCalls)/60000) >= 5 ) {
        updatedTotalWaitingCalls =  new Date();
        redisClient.set("totalWaitingAgg-" + totalWaitingCallsCounter, parseInt(msg), function (err, reply) {
            redisClient.expireat(totalKey, parseInt(todayEnd / 1000));
        });
        totalWaitingCallsCounter += 1;
    }
    console.log("New total waiting calls in Redis: ", msg);
    redisClient.set(totalKey, parseInt(msg), function (err, reply) {
        redisClient.expireat(totalKey, parseInt(todayEnd / 1000));
    });
});

redisClient.on('connect', function () {
    console.log('Sender connected to Redis');
});

module.exports = redisClient;