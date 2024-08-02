const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.updateCredit = async (message) => {
    const { userId, creditAmount } = message;
    try {
        const user = await User.findById(userId);
        if (!user) {
            await sendToQueue('user-service-queue-res', { message: 'User not found', success: false });
            return;
        }

        if (user.creditAmount + creditAmount < 0) {
            await sendToQueue('user-service-queue-res', { message: 'Insufficient credits', success: false });
            return;
        }

        user.creditAmount += creditAmount;
        await user.save();

        await sendToQueue('user-service-queue-res', {
            userId,
            creditAmount: user.creditAmount,
            success: true
        });

    } catch (error) {
        console.error('Error updating credit:', error);
        await sendToQueue('user-service-queue-res', { message: 'Internal server error', success: false });
    }
};