const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');

const getUserTransactions = async (msg, channel) => {
    console.log('Received message:', msg);
    const { userId} = msg;

    if (!userId) {
        console.error('Missing required field: userId');
        const errorMessage = {
            success: false,
            message: 'Missing required field: userId'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
        return;
    }

    try {
        // Calculate skip value for pagination

        // Fetch transactions
        const transactions = await Transaction.find({ userId: userId })
            .sort({ createdAt: -1 })


        const successMessage = {
            userId,
            success: true,
            transactions: transactions,
            message: 'User transactions fetched successfully'
        };
        await sendToQueue('trans_response_queue', successMessage, channel);

    } catch (error) {
        console.error('Error fetching user transactions:', error);
        const errorMessage = {
            userId,
            success: false,
            message: 'Failed to fetch user transactions'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
    }
};

module.exports = { getUserTransactions };