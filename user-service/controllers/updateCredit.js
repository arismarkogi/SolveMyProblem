const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.updateCredit = async (message) => {
    const { correlationId, userId, creditAmount, form} = message;
    //console.log(correlationId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            await sendToQueue('user-service-queue-res', { correlationId : correlationId, message: 'User not found', success: false });
            return;
        }

        if (user.creditAmount + creditAmount < 0) {
            await sendToQueue('user-service-queue-res', { correlationId : correlationId, message: 'Insufficient credits', success: false });
            return;
        }

        user.creditAmount += creditAmount;
        await user.save();

        await sendToQueue('user-service-queue-res', {
            correlationId: correlationId,
            userId : user._id,
            creditAmount: creditAmount, 
            form : form,
            success: true
        });

    } catch (error) {
        console.error('Error updating credit:', error);
        await sendToQueue('user-service-queue-res', {correlationId : correlationId, message: 'Internal server error', success: false });
    }
};