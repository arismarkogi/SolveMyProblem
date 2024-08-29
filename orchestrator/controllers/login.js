

const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');
/*
exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const correlationId = uuidv4();

        const message = {
            type: "login",
            mes: {
                correlationId,
                email,
                password
            }
        };

        responseMap.set(correlationId, res);

        await sendToQueue('user-service-queue', message);

        // Add a timeout to handle cases where the user-service doesn't respond
        setTimeout(() => {
            if (responseMap.has(correlationId)) {
                console.log('Login timeout: No response from user-service');
                res.status(500).json({ error: 'Login request timed out' });
                responseMap.delete(correlationId);
            }
        }, 5000); // 5 second timeout

    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal than server error' });
    }
};
*/


exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const correlationId = uuidv4();

        const message = {
            type: "login",
            mes: {
                correlationId,
                email,
                password
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