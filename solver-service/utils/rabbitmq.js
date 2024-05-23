const amqplib = require('amqplib');

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL);
        return connection;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};

const sendToQueue = async (queue, message, connection) => {
    try {
        const channel = await connection.createChannel();
        await channel.assertQueue(queue);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue:', queue);
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

module.exports = { connectRabbitMQ, sendToQueue };
