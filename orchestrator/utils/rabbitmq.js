const amqplib = require('amqplib');
const { TokenExpiredError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

let connection = null;
let channel = null;

const responseMap = new Map();

// Utility functions to handle specific messages


const creditUpdate = async (msg) => {
    const message_trans = {
        type: "new",
        mes: {
            correlationId: msg.correlationId,
            token: msg.token,
            creditAmount: msg.creditAmount,
            form: msg.form,
        }
    };
    await sendToQueue('trans_queue', message_trans);
};

const deleteUser = async (msg) => {
    const message_transaction = {
        type: "delete",
        mes: {
            correlationId: msg.correlationId,
            userId: msg.userId
        }
    };
    await sendToQueue('trans_queue', message_transaction);
};

const sendProblem = async (msg) => {
    const { type, ...otherFields } = msg; 
    const problemMessage = {
        type: "problemIssue",
        ...otherFields
    };
    await sendToQueue('problem-service-issue', problemMessage);
    const message_trans = {
        type: "new",
        mes: {
            correlationId: msg.correlationId,
            token: msg.token,
            creditAmount: -1,
            form: "spend",
        }
    };
    await sendToQueue('trans_queue', message_trans);

};

const simpleResponse = async (msg) => {
    const res = responseMap.get(msg.correlationId);
    if (res) {
        res.status(msg.status).json(msg.message);
        responseMap.delete(msg.correlationId);
    } else {
        console.error(`No response object found for correlationId: ${msg.correlationId}`);
    }
};

// RabbitMQ connection and channel setup
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
        await channel.assertQueue('probMan-to-orch-queue', { durable: false }); // Add this line

        channel.prefetch(1);

        // Consume messages
        consumeQueue('user-service-queue-res', handleUserServiceResponse);
        consumeQueue('trans_response_queue', handleTransactionServiceResponse);
        consumeQueue('probMan-to-orch-queue', handleProblemServiceIssue);
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
        process.exit(1);
    }
};


// Send message to a specific queue
const sendToQueue = async (queue, message) => {
    try {
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`Message sent to queue: ${queue}`);
    } catch (error) {
        console.error('Failed to send message to queue:', error);
    }
};

// Consume messages from a specific queue
const consumeQueue = async (queue, callback) => {
    try {
        console.log(`Consuming from queue: ${queue}`);
        await channel.consume(queue, async (message) => {
            if (message !== null) {
                const parsedMessage = JSON.parse(message.content.toString());
                await callback(parsedMessage);
                channel.ack(message);
            }
        }, { noAck: false });
    } catch (error) {
        console.error(`Failed to receive message from queue: ${queue}`, error);
    }
};

// Handlers for specific queues
const handleUserServiceResponse = async (msg) => {
    if(msg.status!==200) {
        const res = responseMap.get(msg.correlationId);
        if(res) {
            res.status(msg.status).json({ error : msg.message });
            responseMap.delete(msg.correlationId);
        } 
    }
    else {
        switch(msg.type) {
            case "credit_update": await creditUpdate(msg); break;
            case "delete": await deleteUser(msg); break;
            case "update": await simpleResponse(msg); break;
            case "google_signup": await simpleResponse(msg); break;
            case "signup": await simpleResponse(msg); break;
            case "login": await simpleResponse(msg); break;
            case "send_problem": await sendProblem(msg); break;
            default: const res = responseMap.get(msg.correlationId);
                        if(res) {
                            res.status(400).json({error : "Invalid message type"});
                        }
                        responseMap.delete(msg.correlationId);
        }
    }
};

const handleTransactionServiceResponse = async (msg) => {
    if (msg.status !== 200) {
        const res = responseMap.get(msg.correlationId);
        if (res) {
            res.status(msg.status).json({ error: msg.message });
            responseMap.delete(msg.correlationId);
        }
    } else {
        switch (msg.type) {
            case "new":
            case "delete":
                await simpleResponse(msg);
                break;
            default:
                const res = responseMap.get(msg.correlationId);
                if (res) {
                    res.status(400).json({ error: "Invalid message type" });
                }
                responseMap.delete(msg.correlationId);
        }
    }
};


const handleProblemServiceIssue = async (msg) => {
    // Add logic for handling problem-service-issue messages here
    const res = responseMap.get(msg.correlationId);
    
    if (res) {
        switch (msg.type) {
            case 'getStats':
                res.status(200).json({
                    stats: msg.stats
                });
                break;
            case 'getProblems':
                // TODO
                break;
            default:
                res.status(200).json(msg);
        }
        responseMap.delete(msg.correlationId);
    } else {
        console.error(`No response object found for correlationId: ${msg.correlationId}`);
    }

};

module.exports = { connectRabbitMQ, sendToQueue, consumeQueue, responseMap };