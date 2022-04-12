import * as amqp from "amqp-connection-manager";
const QUEUE_NAME = "judge";

const connection = amqp.connect([process.env.RABBITMQ!]);

connection.on("connect", function () {
  console.log("Connected to rabbit mq");
});

connection.on("disconnect", function (err) {
  console.log("Disconnected.", err);
});

// queue setup
const channelWrapper = connection.createChannel({
  json: true,
  setup: function (channel: any) {
    return channel.assertQueue(QUEUE_NAME, { durable: true });
  },
});

export const sendMessage = async (data: any) => {
  try {
    await channelWrapper.sendToQueue(QUEUE_NAME, data);
  } catch (error) {
    channelWrapper.close();
    connection.close();
  }
};
