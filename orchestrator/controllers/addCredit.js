const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.addCredit = async (req, res) => {
    try {
        const { userId, creditAmount, form} = req.body;

        if (!userId || !creditAmount || !form) {
            res.status(400).json({ error: 'Missing required fields' });
        }

        const correlationId = uuidv4();


        const message_user = {
            type: "credit_update",
            mes: {
                userId,
                creditAmount,
                form,
                correlationId 
            }
            
        };

        responseMap.set(correlationId, res);
        
        //console.log(responseMap.get(correlationId));

        await sendToQueue('user-service-queue', message_user);

        /*await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
            } else {
                const message_trans = {
                    type: "new",
                    mes: {
                        userId,
                        creditAmount,
                        form
                    }
                };
                console.log('Sending message to transaction service:');
                await sendToQueue('trans_queue', message_trans);
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
                console.log('Response from transaction service:', res.statusCode);
            }
        });*/

        //res.status(200).json({ success: 'Credit add sent succesfully' });
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};