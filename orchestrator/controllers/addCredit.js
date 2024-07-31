const { json } = require('express');
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
                return res.status(500).json({ error: 'Internal Error - credit update' });
            } else {
                const message_trans = {
                    type: "new",
                    mes: {
                        userId,
                        creditAmount,
                        form
                    }
                };

                await sendToQueue('trans_queue', message_trans);
                
                await receiveFromQueue('trans_response_queue', async (msg) => {
                    console.log('Received message orchestration:', msg);
                    if (!msg.success) {
                        return res.status(500).json({ error: 'Internal Error - transaction creation' });
                    } else {
                        return res.status(200).json({ message: 'Credit Added Successfully' });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Internal Error', error);
        return res.status(500).json({ error: 'Internal Error' });
    }
};
