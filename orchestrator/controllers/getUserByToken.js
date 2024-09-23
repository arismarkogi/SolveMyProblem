const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

exports.getUserByToken = async (req, res) => {
    try {
        
        const authHeader = req.headers.authorization;
        console.log('Received authHeader:', authHeader); // Log the received authHeader
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];
        console.log('Received token:', token); // Log the received token
        if (!token) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const correlationId = uuidv4();

        const message = {
            type: "get_user_by_token",
            mes: {
                token,
                correlationId
            }
        };

        responseMap.set(correlationId, res);

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id, role } = decoded;
        const userId = id;
        console.log(`User-service: Attempting to update credit for user ${userId}`);

        //console.log(`Sending get user by ID request to user-service, correlationId: ${correlationId}, userId: ${token}`);
        await sendToQueue('user-service-queue', message);

    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};