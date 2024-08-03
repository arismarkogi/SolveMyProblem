const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.deleteUser = async (message) => {
    const { userId } = message;
    try{

    // Check for Google ID association
    const user = await User.findOne({ _id: userId },{ role: 'user' });
    if (!user) {
        const errorResponse = { message: 'User not found', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
        }

    await User.deleteOne({ _id: userId });

    const successResponse = { 
        message: 'User deleted successfully',
        success: true,
        userId: userId
    };
    await sendToQueue('user-service-queue-res', successResponse);

    } catch (error) {
    console.error(error);
    const errorResponse = { message: 'Internal server error', success: false };
    await sendToQueue('user-service-queue-res', errorResponse);
}
}