const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

exports.updateUser = async (req, res) => {
    try {
        const {userId, username, password, email } = req.body;

        if(!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const message = {
            type: "update",
            mes: {
                userId,
                username,
                password,
                email
            }
        };

        await sendToQueue('user-service-queue', message);
        await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
                console.log('Error:', msg.message);
            } else {
                res.status(200);
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ success: 'user updated' });
        }
        else {
            return res.status(500).json({ error: msg.message });
        }
    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
        return res.status(500).json({ error: 'Internal Error' });
    }
};