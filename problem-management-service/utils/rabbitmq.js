const amqplib = require('amqplib');

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Ensure all necessary queues are asserted
        await channel.assertQueue('solver-to-probMan-queue', { durable: false });
        await channel.assertQueue('probMan-to-solver-queue', { durable: false });
        await channel.assertQueue('orch-to-probMan-queue', {durable: false});
        await channel.assertQueue('probMan-to-orch-queue', {durable: false});
        await channel.assertQueue('problem-service-issue-res', { durable: false });

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
        console.log(`Sending message to queue ${queue}:`, message);
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message successfully sent to queue: ${queue}`);
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
        console.log(`Attempting to consume from queue: ${queue}`);
        await channel.consume(queue, async (message) => {
            if (message !== null) {
                const parsedMessage = JSON.parse(message.content.toString());
                console.log(`Received message from queue ${queue}:`, parsedMessage);
                await callback(parsedMessage);
                channel.ack(message);
                console.log(`Message from queue ${queue} acknowledged.`);
            }
        }, { noAck: false });
    } catch (error) {
        console.error(`Failed to consume from queue: ${queue}`, error);
        throw error;
    }
};

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue };
