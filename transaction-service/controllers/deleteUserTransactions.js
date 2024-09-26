const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

const sendResponse = async (correlationId, message, status, channel, userId = null, deletedCount = null) => {
    const response = {
        headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },
        type: "delete",
        correlationId,
        message,
        status,
        userId,
        deletedCount
    };
    await sendToQueue('trans_response_queue', response, channel);
};

const deleteUserTransactions = async (msg, channel) => {
    const { correlationId, userId } = msg;

    try {
        // Validation
        if (!userId) {
            await sendResponse(correlationId, "User ID is required", 400, channel);
            return;
        }
        // Delete all transactions associated with the user
        const result = await Transaction.deleteMany({ userId: userId });

        const successMessage = `Successfully deleted ${result.deletedCount} transaction(s) for the user`;
        await sendResponse(correlationId, successMessage, 200, channel, userId, result.deletedCount);

    } catch (error) {
        console.error('Error in deleteUserTransactions:', error);
        await sendResponse(correlationId, 'Internal server error', 500, channel, userId);
    }
};

module.exports = { deleteUserTransactions };