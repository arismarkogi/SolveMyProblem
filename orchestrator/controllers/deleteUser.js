const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');


exports.deleteUserandAssosiatedData = async (req, res) => {
    try {
        const { userId} = req.body;

        if (!userId ) {
            return res.status(400).json({ error: 'Missing user-id' });
        }
        const correlationId = uuidv4();

        const message_user = {
            type: "delete",
            mes: {
                correlationId,
                userId
            }
        };
        responseMap.set(correlationId, res);

        await sendToQueue('user-service-queue', message_user);
        
       
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};

/*
 await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
            } else {
                const message_transaction = {
                    type: "delete",
                    mes: {
                        userId
                    }
                };
                console.log('Sending message to transaction service:');
                await sendToQueue('trans_queue', message_transaction);
                console.log('Waiting for response from transaction service:');
                await receiveFromQueue('trans_response_queue', async (msg) => {
                    console.log('Received message orchestration:', msg);
                    if (!msg.success) {
                        res.status(500);
                    } 
                    else {
                        res.status(200);
                    }
                });
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ success: 'User and assosiated data removed successfully' });
        }
        else {
            return res.status(500).json({ error: 'Internal Error' });
        }*/