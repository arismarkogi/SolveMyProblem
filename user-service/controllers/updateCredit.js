const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.updateCredit = async (message) => {
    const { correlationId, userId, creditAmount, form } = message;

    try {
        console.log(`User-service: Attempting to update credit for user ${userId}`);
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User-service: User ${userId} not found`);
            await sendToQueue('user-service-queue-res', {
                type: 'credit_update',
                correlationId,
                status: 404,
                message: 'User not found'
            });
            return;
        }

        user.creditAmount += parseInt(creditAmount);
        await user.save();

        console.log(`User-service: Credit updated successfully for user ${userId}`);
        await sendToQueue('user-service-queue-res', {
            type: 'credit_update',
            correlationId,
            status: 200,
            message: 'Credit updated successfully',
            newCreditAmount: user.creditAmount
        });

    } catch (error) {
        console.error('User-service: Error updating credit:', error);
        await sendToQueue('user-service-queue-res', {
            type: 'credit_update',
            correlationId,
            status: 500,
            message: 'Internal server error'
        });
    }
};