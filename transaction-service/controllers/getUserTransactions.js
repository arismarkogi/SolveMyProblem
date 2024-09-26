const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

const getUserTransactions = async (msg, channel) => {
    console.log('Received message:', msg);
    const { userId} = msg;

    if (!userId) {
        console.error('Missing required field: userId');
        const errorMessage = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
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
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            userId,
            success: true,
            transactions: transactions,
            message: 'User transactions fetched successfully'
        };
        await sendToQueue('trans_response_queue', successMessage, channel);

    } catch (error) {
        console.error('Error fetching user transactions:', error);
        const errorMessage = {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            userId,
            success: false,
            message: 'Failed to fetch user transactions'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
    }
};

module.exports = { getUserTransactions };