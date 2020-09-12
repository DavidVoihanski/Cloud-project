const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
  "group.id": "cloudkarafka-example",
  "metadata.broker.list": "rocket-01.srvs.cloudkafka.com:9094,rocket-02.srvs.cloudkafka.com:9094,rocket-03.srvs.cloudkafka.com:9094".split(","),
  "socket.keepalive.enable": true,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "SCRAM-SHA-256",
  "sasl.username": "oerf9u12",
  "sasl.password": "4dtKihVz3nU7Erjofw9kS3ZjPj0X9_L7",
  "debug": "generic,broker,security"
};

const prefix = "oerf9u12-";
const topic = `${prefix}test`;
const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer.connect();

consumer.on("ready", function(arg) {
  console.log(`consumer Ariel is ready.`);
  consumer.subscribe([topic]);
  consumer.consume();
});

module.exports.consumer = consumer;