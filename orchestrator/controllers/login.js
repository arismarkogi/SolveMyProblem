
const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.logIn = async (req, res) => {
    try {
        const { email, password,isAdmin} = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const correlationId = uuidv4();
        
        const message = {
            type: "login",
            mes: {
                correlationId,
                email,
                password,
                isAdmin
            }
        };

        responseMap.set(correlationId, res);

        console.log(`Sending login request to user-service, correlationId: ${correlationId}`);
        await sendToQueue('user-service-queue', message);

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};