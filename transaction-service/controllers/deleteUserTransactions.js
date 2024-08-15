const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');

const sendResponse = async (correlationId, message, status, userId = null, deletedCount = null) => {
    const response = {
        type: "delete",
        correlationId,
        message,
        status,
        userId,
        deletedCount
    };
    await sendToQueue('trans_response_queue', response);
};

const deleteUserTransactions = async (msg, channel) => {
    const { correlationId, userId } = message;

    try {
        // Validation
        if (!userId) {
            await sendResponse(correlationId, "User ID is required", 400);
            return;
        }
        // Delete all transactions associated with the user
        const result = await Transaction.deleteMany({ userId: userId });

        const successMessage = `Successfully deleted ${result.deletedCount} transaction(s) for the user`;
        await sendResponse(correlationId, successMessage, 200, userId, result.deletedCount);

    } catch (error) {
        console.error('Error in deleteUserTransactions:', error);
        await sendResponse(correlationId, 'Internal server error', 500, userId);
    }
};

module.exports = { deleteUserTransactions };