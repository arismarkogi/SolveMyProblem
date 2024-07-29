const { json } = require('express');
const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');

//Add credit
receiveFromQueue('user-service-add-credit-res', async (msg) => {//μπορει να πρεπει να παει μεσα στο addCredit με await
    const { userId, creditAmount } = JSON.parse(msg.content.toString());
    const result = await UserCredit.updateCredit({ body: { userId, credit: creditAmount }});
    
    if (result && result.success) { 
        sendToQueue('transaction-service-log', { userId, amount: creditAmount, type: 'Purchase' });
    }
});

receiveFromQueue('transaction-service-log-res', async (msg) => {//μπορει να πρεπει να παει μεσα στο addCredit με await
    const { userId, amount, type } = JSON.parse(msg.content.toString());
    await TransactionController.createTransaction({ body: { userId, amount, type }});
});

exports.addCredit = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (amount <= 0) return res.status(400).json({ error: 'Invalid credit amount' });

        await sendToQueue('user-service-add-credit', { userId, amount });
        return res.status(200).json({ message: 'Credit add request sent successfully' });
    } catch (error) {
        console.error('Error adding credit:', error);
        res.status(500).json({ error: 'Error adding credit' });
    }
};

