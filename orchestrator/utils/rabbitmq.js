const amqplib = require('amqplib');

var connection = null;
var channel = null;

const connectRabbitMQ = async () => {
    try {

        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue('user-service-queue', { durable: false });
        await channel.assertQueue('user-service-queue-res', { durable: false });
        await channel.assertQueue('trans_queue', { durable: false });
        await channel.assertQueue('trans_response_queue', { durable: false });
        await channel.assertQueue('user-service-remove-user', { durable: false });
        await channel.assertQueue('user-service-credit-req', { durable: false });
        await channel.assertQueue('user-service-credit-res', { durable: false });
        await channel.assertQueue('problem-service-issue', { durable: false });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};

const sendToQueue = async (queue, message) => {
    try {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue');
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

const receiveFromQueue = async (queue, callback) => {
    try {
        channel.consume(queue, (message) => {
            callback(JSON.parse(message.content.toString()));
            channel.ack(message);
        });
    } catch (error) {
        console.error('Failed to receive message from queue:', error);
    }
}

module.exports = {connectRabbitMQ, sendToQueue, receiveFromQueue};