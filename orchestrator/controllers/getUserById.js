const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const correlationId = uuidv4();

        const message = {
            type: "get_user_profile",
            mes: {
                userId,
                correlationId
            }
        };

        responseMap.set(correlationId, res);

        console.log(`Sending get user by ID request to user-service, correlationId: ${correlationId}, userId: ${userId}`);
        await sendToQueue('user-service-queue', message);

    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};