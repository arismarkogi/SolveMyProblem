const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq'); // Corrected import

const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateUser = async (req, res) => {
    const { userId, username, email, password } = req.body;
    try{
    // Check for Google ID association
    const user = await User.findOne({_id:userId});
    if (!user) {
        const errorResponse = { message: 'User not found', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
    }

    if (user.googleId) {
        const errorResponse = { message: 'Update not allowed for Google authenticated users', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
    }

    const updates = {};
    const conditions = [];

    if (username) {
        conditions.push({ username: username });
        updates.username = username;
    }
    if (email) {
        conditions.push({ email: email });
        updates.email = email;
    }
    if (password) {
        updates.password = crypto.createHash('sha256').update(password).digest('hex');
    }

    if (conditions.length > 0) {
        const existingUser = await User.findOne({ $or: conditions, _id: { $ne: userId } });
        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            const errorResponse = { message: `${field} already exists`, success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
    }

    await User.updateOne({ _id: userId }, { $set: updates });
    
    const finalMessage = {
        userId,
        success: true
    };
    await sendToQueue('user-service-queue-res', finalMessage);
    } catch (error) {
    console.error(error);
    const errorResponse = { message: 'Internal server error', success: false };
    await sendToQueue('user-service-queue-res', errorResponse);
}
};
