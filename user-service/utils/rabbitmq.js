const amqplib = require('amqplib');

var connection = null;
var channel = null;

const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        return channel;//,connection; // Possibly return the channel and connection
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};


const sendToQueue = async (queue, message) => {
    try {
        await channel.assertQueue(queue, { durable: false }); // Ensure queue is durable
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        //await channel.assertQueue(queue);
        //channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue:', queue);
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

module.exports = { connectRabbitMQ, sendToQueue };
