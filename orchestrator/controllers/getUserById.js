const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const axios = require('axios');

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const correlationId = uuidv4();

        const message = {
            headers: {
                authorization: `Bearer ${req.token}`,
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                userId,
                correlationId
            },
            type: "get_user_profile",
            
        };

        responseMap.set(correlationId, res);

        console.log(`Sending get user by ID request to user-service, correlationId: ${correlationId}, userId: ${userId}`);
        const apiResponse = await axios.get(`http://user-service:4217/get-user-by-id/${userId}`, message);

        // Return the API response to the client
        res.status(apiResponse.status).json(apiResponse.data);
        responseMap.delete(correlationId);

    } catch (error) {
        console.error('Error in getUserById:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
