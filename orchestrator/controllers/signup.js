const jwt = require('jsonwebtoken');
const { sendToQueue, responseMap } = require('../utils/rabbitmq');
const { v4: uuidv4 } = require('uuid');

exports.signUp = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if(!username || !password || !email) {
            return res.status(400).json({ error: 'Missing username, password, or email' });
        }

        const correlationId = uuidv4();

        const message = {
            type: "signup",
            mes: {
                correlationId,
                username,
                password,
                email
            }
        };

        responseMap.set(correlationId, res);

        await sendToQueue('user-service-queue', message);
        
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
        return res.status(500).json({ error: 'Internal Error' });
    }
};


/*console.log('this should be before status code');
        await receiveFromQueue('user-service-queue-res', async (msg) => {
            console.log(msg, 'yes');
            if (msg.success !== true) {
                res.status(500);
            } else {
                res.status(200);
            }
            content = msg.message;
        });
        while(true) {
        if(content) {
            
            if (res.statusCode === 200) {
                return res.status(200).json({ success: content });
            }
            else {
                return res.status(500).json({ error: content });
            }
        }
        }*/