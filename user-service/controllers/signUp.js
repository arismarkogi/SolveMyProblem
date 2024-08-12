const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.signUp = async (message) => {
    
    const { username, password, email } = message;
    try {// checking necessary fields
        if (!username || !password || !email) {
            const errorResponse = { message: 'Username, password, and email are required', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        
        // Check if the user already exists
        const existingUser = await User.findOne( {$or: [
            { email: email },
            { username: username }
        ]});

        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            const errorResponse = { message: `${field} already exists`, success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        // hash password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        //create the new user
        const user = new User({
            username: username,
            password: hashedPassword,
            email: email
        });

        await user.save();
        
        //send succesf response
        const successResponse = { 
            message: 'User created successfully', 
            success: true,
            userId: user._id
        };
        await sendToQueue('user-service-queue-res', successResponse);
    } catch (error) { 
        //send error response
        console.error(error);
        const errorResponse = { message: 'Internal server error', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
    }
}