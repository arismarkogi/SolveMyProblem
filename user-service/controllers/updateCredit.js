/*const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.updateCredit = async (message) => {
    const { correlationId, userId, creditAmount, form} = message;
    //console.log(correlationId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            await sendToQueue('user-service-queue-res', {type:"credit", correlationId : correlationId, message: 'User not found', status: 400 });
            return;
        }

        if (user.creditAmount + creditAmount < 0) {
            await sendToQueue('user-service-queue-res', {type:"credit", correlationId : correlationId, message: 'Insufficient credits', status: 400 });
            return;
        }

        user.creditAmount += creditAmount;
        await user.save();

        await sendToQueue('user-service-queue-res', {
            type:"credit",
            correlationId: correlationId,
            userId : user._id,
            creditAmount: creditAmount, 
            form : form,
            status:200
        });

    } catch (error) {
        console.error('Error updating credit:', error);
        await sendToQueue('user-service-queue-res', {type:"credit",correlationId : correlationId, message: 'Internal server error', status: 500 });
    }
};
*/
/*
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
*/
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