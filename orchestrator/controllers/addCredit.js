const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

exports.addCredit = async (req, res) => {
    try {
        const { userId, creditAmount, form } = req.body;

        if (!userId || !creditAmount || !form) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const message_user = {
            type: "credit_update",
            mes: {
                userId,
                creditAmount
            }
        };

        // Send message to user service and wait for response
        await sendToQueue('user-service-queue', message_user);
        const userServiceResponse = await new Promise((resolve) => {
            receiveFromQueue('user-service-queue-res', resolve);
        });

        console.log('Response from user service');

        if (!userServiceResponse.success) {
            return res.status(500).json({ error: 'Internal Error - credit update' });
        }

        const message_trans = {
            type: "new",
            mes: {
                userId,
                creditAmount,
                form
            }
        };

        // Send message to transaction service and wait for response
        await sendToQueue('trans_queue', message_trans);
        const transServiceResponse = await new Promise((resolve) => {
            receiveFromQueue('trans_response_queue', resolve);
        });

        if (!transServiceResponse.success) {
            return res.status(500).json({ error: 'Internal Error - transaction creation' });
        }

        res.status(200).json({ message: 'Credit Added Successfully' });

    } catch (error) {
        console.error('Internal Error', error);
        res.status(500).json({ error: 'Internal Error' });
    }
};