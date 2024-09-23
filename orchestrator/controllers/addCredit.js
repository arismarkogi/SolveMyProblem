const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.addCredit = async (req, res) => {
    try {
        const { token, creditAmount, form } = req.body;

        if (!token || !creditAmount || !form) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const correlationId = uuidv4();
        
        const message_user = {
            type: "credit_update",
            mes: {
                token,
                creditAmount,
                form,
                correlationId 
            }
        };
        responseMap.set(correlationId, res);
        
        console.log(`Sending credit update request to user-service, correlationId: ${correlationId}`, token);
        await sendToQueue('user-service-queue', message_user);
        
    } catch (error) {
        console.error('Internal Error in addCredit:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};