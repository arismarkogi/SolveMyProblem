const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.getStats = async (req, res) => {


    console.log("insideGetstast");
    try {
        

        const correlationId = uuidv4();

         const message = {
            type: "getStats",
            correlationId: correlationId
            
        };

        responseMap.set(correlationId, res);

        console.log(`Sending get user profile request to problem-management, correlationId: ${correlationId}`);
        sendToQueue('problem-service-issue', message);
        

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};