const amqplib = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Ensure all necessary queues are asserted
        await channel.assertQueue('probMan-to-solver-queue', { durable: false });
        await channel.assertQueue('solver-to-probMan-queue', { durable: false });
        
        console.log('Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};

const sendToQueue = async (queue, message) => {
    try {
        if (!channel) {
            throw new Error('Channel not initialized');
        }
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue:', queue);
    } catch (error) {
        console.error('Failed to send message to queue:', error);
        throw error;
    }
};

const consumeQueue = async (queue, callback) => {
    try {
        if (!channel) {
            throw new Error('Channel not initialized');
        }
        await channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                await callback(content);
                channel.ack(msg);
            }
        }, { noAck: false});
        console.log(`Consuming from queue: ${queue}`);
    } catch (error) {
        console.error('Failed to consume from queue:', error);
        throw error;
    }
};

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue };