const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient();
    this.publisher = Redis.createClient();
    this.subscriber.connect();
    this.publisher.connect();
  }

  publish(channel, message) {
    this.publisher
      .publish(channel, message)
      .then((v) => {
        console.log("publish channel::", channel, v);
      })
      .catch((err) => {
        console.log("vao");
        console.log(err);
      });
  }

  subscribe(channel, callback) {
    this.subscriber
      .subscribe(channel, (message) => {
        callback(channel, message);
      })
      .then((v) => console.log("subscribe channel::", channel, v))
      .catch((err) => console.log(err));
  }
}

module.exports = new RedisPubSubService();
