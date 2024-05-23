const amqplib = require('amqplib');

const sendToQueue = async (queue, message) => {
    try {
        const connection = await amqplib.connect(process.env.rabbitMQURL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue');
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

module.exports = sendToQueue;
