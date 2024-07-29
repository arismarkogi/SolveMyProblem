const { json } = require('express');
const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');
// Delete User and associated data
receiveFromQueue('user-service-remove-user', async (msg) => {//μπορει να πρεπει να παει μεσα στο addCredit με await
    const { userId} = JSON.parse(msg.content.toString());
    const result = await UserRemoval.deleteUser({ body: { userId}});
    
    if (result && result.success) { 
        await sendToQueue('transaction-service-delete-user-transactions', { userId});
        //await sendToQueue('problem-service-delete-user-problems', { userId});
        //await sendToQueue('stats-service-delete-user-stats', { userId});

    }
});
exports.deleteUserandAssosiatedData = async (req, res) => {
    try {
        const { userId} = req.body;
        await sendToQueue('user-service-remove-user', { userId});
        return res.status(200).json({ message: "User and user's data removed successfully" });
    } catch (error) {
        console.error('Error adding credit:', error);
        res.status(500).json({ error: 'Error adding credit' });
    }
};