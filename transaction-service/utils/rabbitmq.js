const amqplib = require('amqplib');

const connectRabbitMQ = async () => {
    try {
        const connection = await amqplib.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        
        await channel.assertQueue('trans_queue', { durable: false });
        await channel.assertQueue('trans_response_queue', { durable: false });
        return channel;//,connection; // Possibly return the channel and connection
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        process.exit(1);
    }
};


const sendToQueue = async (queue, message, channel) => {
    try {
        console.log('Sending message to queue:', queue);
        console.log('Message:', message);
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        //await channel.assertQueue(queue);
        //channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue:', queue);
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

module.exports = { connectRabbitMQ, sendToQueue };
