const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

exports.addCredit = async (req, res) => {
    try {
        const { userId, creditAmount, form } = req.body;

        if (!userId || !creditAmount || !form) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const message_user = {
            type: "credit_update",
            mes: {
                userId,
                creditAmount
            }
        };

        await sendToQueue('user-service-queue', message_user);

        await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
                return;
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
                            return;
                    } 
                    else {
                            res.status(200);
                            return;
                    }
                });
                console.log('Response from transaction service:', res.statusCode);
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ success: 'Credit added successfully' });
        }
        else {
            return res.status(500).json({ error: 'Internal Error' });
        }
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
        return res.status(500).json({ error: 'Internal Error' });
    }
};