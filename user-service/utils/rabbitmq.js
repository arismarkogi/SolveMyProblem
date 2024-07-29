const amqplib = require('amqplib');

const sendToQueue = async (queue, message) => {
    try {
        const connection = await amqplib.connect(process.env.rabbitMQURL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue');
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

const receiveFromQueue = async (queue, callback) => {
    try {
        const connection = await amqplib.connect(process.env.rabbitMQURL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        channel.consume(queue, (message) => {
            callback(JSON.parse(message.content.toString()));
            channel.ack(message);
        });
    } catch (error) {
        console.error('Failed to receive message from queue:', error);
    }
}

module.exports = {sendToQueue, receiveFromQueue};