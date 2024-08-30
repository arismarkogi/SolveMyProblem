/*const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.getUserProfile = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            
            // If token is valid, proceed with the request
            const userId = decoded.id;
            const correlationId = uuidv4();

            const message = {
                type: "get_user_profile",
                mes: {
                    userId,
                    correlationId
                }
            };

            responseMap.set(correlationId, res);

            console.log(`Sending get user profile request to user-service, correlationId: ${correlationId}`);
            sendToQueue('user-service-queue', message);
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};*/
const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // Log the received token

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(401).json({ error: 'Invalid token', details: err.message });
            }
            
            console.log('Decoded token:', decoded); // Log the decoded token

            const userId = decoded.id;
            const correlationId = uuidv4();

            const message = {
                type: "get_user_profile",
                mes: {
                    userId,
                    correlationId
                }
            };

            responseMap.set(correlationId, res);

            console.log(`Sending get user profile request to user-service, correlationId: ${correlationId}`);
            sendToQueue('user-service-queue', message);
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};