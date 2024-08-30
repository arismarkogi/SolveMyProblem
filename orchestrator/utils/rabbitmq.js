const amqplib = require('amqplib');

var connection = null;
var channel = null;

const responseMap = new Map();

const creditUpdate = async (msg) => {
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
};

const deleteUser = async (msg) => {
    const message_transaction = {
        type: "delete",
        mes: {
            correlationId : msg.correlationId,
            userId : msg.userId
        }
    };
    console.log('Sending message to transaction service:');
    await sendToQueue('trans_queue', message_transaction);
};

const deleteTransaction = async (msg) => {
    const message_problem = {
        type: "delete",
        mes: {
            correlationId : msg.correlationId,
            userId : msg.userId
        }
    };
    console.log('Sending message to transaction service:');
    await sendToQueue('problem-service-issue', message_problem);
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
        /*await consumeQueue('user-service-queue-res', async (msg) => {
            console.log('Received response from user-service:', msg);
            const res = responseMap.get(msg.correlationId);
            if (res) {
                if (msg.status === 200) {
                    res.status(200).json({
                        message: msg.message,
                        token: msg.token,
                        userId: msg.userId
                    });
                } else {
                    res.status(msg.status).json({ error: msg.message });
                }
                responseMap.delete(msg.correlationId);
            } else {
                console.error(`No response object found for correlationId: ${msg.correlationId}`);
       */



/*
                
                await consumeQueue('user-service-queue-res', async (msg) => {
                    console.log('Received response from user-service:', msg);
                    const res = responseMap.get(msg.correlationId);
                    if (res) {
                        if (msg.status === 200) {
                            if (msg.type === 'login') {
                                res.status(200).json({
                                    message: msg.message,
                                    token: msg.token,
                                    userId: msg.userId
                                });
                            } else if (msg.type === 'credit_update') {
                                res.status(200).json({
                                    message: msg.message,
                                    newCreditAmount: msg.newCreditAmount
                                });
                            } else {
                                res.status(200).json({
                                    message: msg.message
                                });
                            }
                        } else {
                            res.status(msg.status).json({ error: msg.message });
                        }
                        responseMap.delete(msg.correlationId);
                    } else {
                        console.error(`No response object found for correlationId: ${msg.correlationId}`);
               



                        */
                        //working
                        /*
                        await consumeQueue('user-service-queue-res', async (msg) => {
                            console.log('Received response from user-service:', msg);
                            const res = responseMap.get(msg.correlationId);
                            if (res) {
                                if (msg.status === 200) {
                                    console.log('Sending successful login response:', {
                                        message: msg.message,
                                        token: msg.token,
                                        userId: msg.userId
                                    });
                                    res.status(200).json({
                                        message: msg.message,
                                        token: msg.token,
                                        userId: msg.userId
                                    });
                                } else {
                                    console.log('Sending error response:', { error: msg.message });
                                    res.status(msg.status).json({ error: msg.message });
                                }
                                responseMap.delete(msg.correlationId);
                            } else {
                                console.error(`No response object found for correlationId: ${msg.correlationId}`);
                        */
                       
await consumeQueue('user-service-queue-res', async (msg) => {
    console.log('Received response from user-service:', msg);
    const res = responseMap.get(msg.correlationId);
    if (res) {
        if (msg.status === 200) {
            switch(msg.type) {
                case 'login':
                    res.status(200).json({
                        message: msg.message,
                        token: msg.token,
                        userId: msg.userId
                    });
                    break;
                case 'get_user_profile':
                    res.status(200).json({
                        message: msg.message,
                        user: msg.user
                    });
                    break;
                default:
                    res.status(200).json(msg);
            }
        } else {
            res.status(msg.status).json({ error: msg.message });
        }
        responseMap.delete(msg.correlationId);
    } else {
        console.error(`No response object found for correlationId: ${msg.correlationId}`);
                                /*
        await consumeQueue('user-service-queue-res', async (msg) => {
            if(msg.status!==200) {
                const res = responseMap.get(msg.correlationId);
                if(res) {
                    res.status(msg.status).json({ error : msg.message });
                    responseMap.delete(msg.correlationId);
                } 
            }
            else {
                console.log(msg.correlationId);
                */

                switch(msg.type) {
                    case "credit": await creditUpdate(msg); return;
                    case "delete": await deleteUser(msg); return;
                    case "update": await simpleResponse(msg); return;
                    case "google_signup": await simpleResponse(msg); return;
                    case "signup": await simpleResponse(msg); return;
                    case "login": await simpleResponse(msg); return;
                }
            }
        }
    );



        await consumeQueue('trans_response_queue', async (msg) => {
            console.log('Received message orchestration:', msg);
            if(msg.status!==200) {
                const res = responseMap.get(msg.correlationId);
                if(res) {
                    res.status(msg.status).json({ error : msg.message });
                    responseMap.delete(msg.correlationId);
                } 
            }
            else {
                console.log(msg.correlationId);
                

                switch(msg.type) {
                    case "new": await simpleResponse(msg); return;
                    case "delete": await simpleResponse(msg);return;//deleteTransaction(msg); return;
                }
            }
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
   /* try {
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
    */
        try {
            console.log(`Consuming from queue: ${queue}`);
            await channel.consume(queue, async (message) => {
                if(message !== null) {
                    console.log('Received message:', message.content.toString());
                    const parsedMessage = JSON.parse(message.content.toString());
                    await callback(parsedMessage);
                    channel.ack(message);
                }
            }, { noAck: false});
        } catch (error) {
            console.error('Failed to receive message from queue:', error);
        }
}

module.exports = {connectRabbitMQ, sendToQueue, responseMap};

