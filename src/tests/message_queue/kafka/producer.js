const { Kafka, logLevel } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["0.0.0.0:9092"],
  logLevel: logLevel.NOTHING
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user By CNDvn" }],
  });

  await producer.disconnect();
};

runProducer().catch(console.error);
