const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

const crypto = require('crypto');
const validator = require('validator');

const sendResponse = async (correlationId, message, status, userId = null) => {
    const response = {
        type: "new",
        correlationId,
        message,
        status,
        userId
    };
    await sendToQueue('user-service-queue-res', response);
};
exports.signUp = async (message) => {
    
    const {correlationId, username, password, email } = message;
    try {
        // checking necessary fields
        if (!username) {
            await sendResponse(correlationId, 'Username is a necessary field', 400);
            return;
        }
        if(!password) {
            await sendResponse(correlationId, 'Password is a necessary field', 400);
            return;
        }
        if(!email) {
            await sendResponse(correlationId, 'Email is a necessary field', 400);
            return;
        }
        // check email format
        if (!validator.isEmail(email)) {
            await sendResponse(correlationId, 'Invalid email format', 400);
            return;
        }
        // check password length
        if (password.length < 8) {
            await sendResponse(correlationId, 'Password must be at least 8 characters long', 400);
            return;
        }
        
        // Check if the user already exists
        const existingUser = await User.findOne( {$or: [
            { email: email },
            { username: username }
        ]});
        //check if email or username are taken
        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            await sendResponse(correlationId, `${field} is already taken`, 400);
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
        
        //send success response
        await sendResponse(correlationId, 'User created successfully', 200, user._id);

    } catch (error) { 
        //send error response
        console.error(error);
        await sendResponse(correlationId, 'Internal server error', 500);
    }
}