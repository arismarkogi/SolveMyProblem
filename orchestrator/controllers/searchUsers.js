const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');


exports.searchUsers = async (req, res) => {
    try {

        const { username, email} = req.body;

        const message = {
            type: "search",
            mes: {
                username,
                email
            }
        };

        await sendToQueue('user-service-queue', message);
        let users = [];
        await receiveFromQueue('user-service-queue-res', async (msg) => {
            if (!msg.success) {
                res.status(500);
                
            } else {
                res.status(200);
                users = msg.users;
                console.log('Received users from user-service:', msg.users);
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ 
                success: true, 
                message: 'Matching users returned',
                users: users
            });
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

    