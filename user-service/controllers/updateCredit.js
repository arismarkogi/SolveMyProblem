const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

exports.updateCredit = async (message) => {
    const { correlationId, token, creditAmount, form } = message;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
        // Extract id and role from the decoded token
        const { id, role } = decoded;
        const userId = id;
        console.log(`User-service: Attempting to update credit for user ${userId}`);
        const user = await User.findById(userId);

        if (form == "purchase"){
            tp = "credit_update";
        }else if (form == "spend"){
            tp = "send_problem";
        }

        if (!user) {
            console.log(`User-service: User ${userId} not found`);
            await sendToQueue('user-service-queue-res', {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: tp,
                correlationId,
                status: 404,
                message: 'User not found'
            });
            return;
        }
        if(user.creditAmount+parseInt(creditAmount)<0){
            console.log(`User-service: User ${userId} does not have enough credit`);
            await sendToQueue('user-service-queue-res', {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: tp,
                correlationId,
                status: 404,
                message: 'User does not have enough credit'
            });
            return;
        }

        user.creditAmount += parseInt(creditAmount);
        await user.save();

        console.log(`User-service: Credit updated successfully for user ${userId}`);
        await sendToQueue('user-service-queue-res', {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: tp,
            ...message,
            status: 200,
            message: 'Credit updated successfully',
            newCreditAmount: user.creditAmount
        });

    } catch (error) {
        console.error('User-service: Error updating credit:', error);
        await sendToQueue('user-service-queue-res', {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'credit_update',
            correlationId,
            status: 500,
            message: 'Internal server error'
        });
    }
}; 