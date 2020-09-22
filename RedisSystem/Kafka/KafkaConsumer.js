const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
  'metadata.broker.list': 'kafka-797775b-bargenish-dc7f.aivencloud.com:28211',
    'group.id': 'demo-consumer-group',
    'security.protocol': 'ssl',
    'ssl.key.location': '../../service.key',
    'ssl.certificate.location': '../../service.cert',
    'ssl.ca.location': '../../ca.pem'
};

const topic = 'Redis';
const consumer = new Kafka.KafkaConsumer(kafkaConf);

consumer.connect();

consumer.on("ready", function(arg) {
  console.log(`Redis consumer consuming on topic: `, topic);
  consumer.subscribe([topic]);
  consumer.consume();
});

module.exports.consumer = consumer;