// https://www.cloudkarafka.com/ הפעלת קפקא במסגרת ספק זה

const uuid = require("uuid");
const Kafka = require("node-rdkafka");

const kafkaConf = {
  'metadata.broker.list': 'kafka-797775b-bargenish-dc7f.aivencloud.com:28211',
    'security.protocol': 'ssl',
    'ssl.key.location': '../KafkaConf/service.key',
    'ssl.certificate.location': '../KafkaConf/service.cert',
    'ssl.ca.location': '../KafkaConf/ca.pem',
    'dr_cb': true
};

const producer = new Kafka.Producer(kafkaConf);
const genMessage = m => new Buffer.alloc(m.length,m);

producer.on("ready", function(arg) {
  console.log(`Call center producer is ready.`);
});
producer.connect();

module.exports.publish= function(msg, topic)
{   
  m=JSON.stringify(msg);
  producer.produce(topic, -1, genMessage(m), uuid.v4());
  //producer.disconnect();
}