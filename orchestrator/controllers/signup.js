const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

exports.signUp = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if(!username || !password || !email) {
            return res.status(400).json({ error: 'Missing username, password, or email' });
        }

        const message = {
            type: "signup",
            mes: {
                username,
                password,
                email
            }
        };

        await sendToQueue('user-service-queue', message);
        await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
            } else {
                res.status(200);
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ success: 'user added' });
        }
        else {
            return res.status(500).json({ error: 'Internal Error' });
        }
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
        return res.status(500).json({ error: 'Internal Error' });
    }
};