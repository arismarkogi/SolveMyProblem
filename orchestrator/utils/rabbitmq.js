const amqplib = require('amqplib');

var connection = null;
var channel = null;

const responseMap = new Map();

const connectRabbitMQ = async () => {
    try {

        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.assertQueue('user-service-queue', { durable: false } , {replyTo : 'user-service-queue-res'});
        await channel.assertQueue('user-service-queue-res', { durable: false }, {replyTo : 'user-service-queue'});
        await channel.assertQueue('trans_queue', { durable: false }, {replyTo : 'trans_response_queue'});
        await channel.assertQueue('trans_response_queue', { durable: false }, {replyTo : 'trans_queue'});
        await channel.assertQueue('user-service-remove-user', { durable: false });
        await channel.assertQueue('user-service-credit-req', { durable: false }, { replyTo : 'user-service-credit-res'});
        await channel.assertQueue('user-service-credit-res', { durable: false }, { replyTo : 'user-service-credit-req'});
        await channel.assertQueue('problem-service-issue', { durable: false });

        channel.prefetch(1);
    
        await consumeQueue('user-service-queue-res', async (msg) => {
            
            if (!msg.success) {
                const res = responseMap.get(msg.correlationId);
                if(res) {
                    res.status(500).json({ error : 'Not enough credit or internal error' });
                    responseMap.delete(msg.correlationId);
                }
                return;
            } else {
                console.log(msg.correlationId);
                const message_trans = {
                    type: "new",
                    mes: {
                        correlationId : msg.correlationId,
                        userId: msg.userId,
                        creditAmount: msg.creditAmount,
                        form : msg.form,
                    }
                };
                console.log('Sending message to transaction service:');
                await sendToQueue('trans_queue', message_trans);
            }
        });
        await consumeQueue('trans_response_queue', async (msg) => {
            console.log('Received message orchestration:', msg);
            const res = responseMap.get(msg.correlationId);
            if(res) {
                if(!msg.success) {
                    res.status(500).json({ error : 'Transaction failed' });
                }
                else {
                res.status(200).json(msg);
                }
                responseMap.delete(msg.correlationId);
            }
            else console.error('No matching response found for correlation ID:', msg.correlationId);
        });
        consumeQueue('problem-service-issue', async (msg) => {
            // stuff todo
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
        process.exit(1);
    }
};

const sendToQueue = async (queue, message) => {
    try {
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log('Message sent to queue');
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

const consumeQueue = async (queue, callback) => {
    try {
        console.log('consuming');
        await channel.consume(queue, async (message) => {
            if(message !== null) {
                console.log('callingback')
                await callback(JSON.parse(message.content.toString()));
                console.log('calledback');
                channel.ack(message);
            }
        }, { noAck: false});
    } catch (error) {
        console.error('Failed to receive message from queue:', error);
    }
}

module.exports = {connectRabbitMQ, sendToQueue, responseMap};

