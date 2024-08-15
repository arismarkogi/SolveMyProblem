const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const sendResponse = async (correlationId, message, status, userId = null) => {
    const response = {
        type: "delete",
        correlationId,
        message,
        status,
        userId
    };
    await sendToQueue('user-service-queue-res', response);
};

exports.deleteUser = async (message) => {
    const { correlationId, userId } = message;
    try{

    // Check for Google ID association
    const user = await User.findOne({ _id: userId },{ role: 'user' });
    if (!user) {
        await sendResponse(correlationId, 'User not found', 404);
        return;
    }


    await User.deleteOne({ _id: userId });

    await sendResponse(correlationId, 'User deleted successfully', 200, userId);

    } catch (error) {
    console.error('Error in deleteUser:', error);
    await sendResponse(correlationId, 'Internal server error', 500);
}
}