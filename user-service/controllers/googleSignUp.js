const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const sendResponse = async (correlationId, message, status, token = null, userId = null) => {
    const response = {
        type: "google_signup",
        correlationId,
        message,
        status,
        token,
        userId
    };
    await sendToQueue('user-service-queue-res', response);
};
function generateToken(user) {
    const payload = {
        id: user._id, // Include user ID in the payload
        role: user.role // Include the role in the payload
    };
    // Sign the token with your secret key and set an expiration (e.g., 1 hour)
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
}
exports.googleSignUp = async (message) => {
    const { correlationId, id, username, email } = message;

    
    try {
        if(!id) {
            await sendResponse(correlationId, 'No Google ID provided', 400);
            return;
        }
        if (!username) {
            await sendResponse(correlationId, 'Username is a necessary field', 400);
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


        let user = await User.findOne({ googleId: id });
        if (user) {
            // Update existing user
            user = await User.findOneAndUpdate(
                { googleId: id },
                { $set: { username: username, email: email }},
                { new: true }
            );
        }
        else {
            // Create a new user
            user = new User({
                googleId: id,
                username: username,
                email: email
            });
            await user.save();
        }
        const token = generateToken(user);
        await sendResponse(correlationId, 'Google sign up successful', 200, token, user._id);

    } catch (error) {
        console.error('Error in googleSignUp:', error);
        await sendResponse(correlationId, 'Internal server error', 500);
}}