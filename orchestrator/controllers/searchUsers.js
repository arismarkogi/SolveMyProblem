const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');


exports.searchUsers = async (req, res) => {
    try {

        const { username, email} = req.body;

        const correlationId = uuidv4();
        
        const message = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: "search",
            mes: {
                correlationId,
                username,
                email
            }
        };
        responseMap.set(correlationId, res);
        console.log(`Sending search users request to user-service, correlationId: ${correlationId}`);
        await sendToQueue('user-service-queue', message);
        
    } catch (error) {
        console.error('Error in user search', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};

    