const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

exports.searchUsers = async (req, res) => {
    try {

        const { username, email} = req.body;
        console.log('Searching users with username:', username, 'email:', email);
        const correlationId = uuidv4();
        const message = {
            headers: {
                authorization: `Bearer ${req.token}`,
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                correlationId,
                username,
                email
            },
            type: "search",
        };
        responseMap.set(correlationId, res);
        console.log(`Sending search users request to user-service, correlationId: ${correlationId}`);
        
        const apiResponse = await axios.get(`http://user-service:4217/search-users`, message);

        res.status(apiResponse.status).json(apiResponse.data);

        responseMap.delete(correlationId);
        
    } catch (error) {
        console.error('Error in user search', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};

    