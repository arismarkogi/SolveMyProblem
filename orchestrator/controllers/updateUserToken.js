const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.updateUserToken = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ error: 'Missing token' });
        }

        const correlationId = uuidv4();

        const message = {
            headers: {
                origin: `Bearer ${jwt.sign({origin: process.env.ORIGIN}, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: "update",
            mes: {
                correlationId,
                token,
                username,
                password,
                email
            }
        };

        // We're not including userId in the message, as the backend will extract it from the token

        responseMap.set(correlationId, res);

        await sendToQueue('user-service-queue', message);

    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};