const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.googleSignUp = async (req, res) => {
    try{
        const {id, username, email } = req.body;

        if (!id || !username || !email) {
            res.status(400).json({ error: 'Missing required fields' });
        }

        const correlationId = uuidv4();

        const message_user = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type:"google_signup",
            mes:{
                correlationId,
                id,
                username,
                email
            }
        };

        responseMap.set(correlationId, res);
        await sendToQueue('user-service-queue', message_user);

        
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};


    