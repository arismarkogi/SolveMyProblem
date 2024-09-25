const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');


exports.deleteUserandAssosiatedData = async (req, res) => {
    try {
        const { userId} = req.body;

        if (!userId ) {
            return res.status(400).json({ error: 'Missing user-id' });
        }
        const correlationId = uuidv4();

        const message_user = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: "delete",
            mes: {
                correlationId,
                userId
            }
        };
        responseMap.set(correlationId, res);

        await sendToQueue('user-service-queue', message_user);
        
       
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};

