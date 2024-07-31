const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq'); // Corrected import

const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateCredit = async (message) => {
    const { userId, creditAmount } = message;
    try {
        // Check for Google ID association
        const user = await User.findById(userId);
        if (!user) {
            const errorResponse = { message: 'User not found', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        
        const currentCredit = user.creditAmount;
        if (currentCredit + creditAmount < 0) {
            const errorResponse = { message: 'Insufficient credits', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        
        user.creditAmount += creditAmount;
        await user.save();
        
        const finalMessage = {
            userId,
            creditAmount: user.creditAmount,
            success: true
        };
        await sendToQueue('user-service-queue-res', finalMessage);
    } catch (error) {
        console.error(error);
        const errorResponse = { message: 'Internal server error', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
    }
};
