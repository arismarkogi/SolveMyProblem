const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const crypto = require('crypto');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const sendResponse = async (correlationId, message, status, token = null,role = "user", userId = null) => {
    const response = {
        headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },
        type: "google_signup",
        correlationId : correlationId,
        status : status,
        message : { 
            token : token,
            role : role
        }
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
            const existingUser = await User.findOne( {$or: [
                { email: email },
            ]});
            if (existingUser) {
                await sendResponse(correlationId, `Email is already taken`, 400);
                return;
            }
            user = new User({
                googleId: id,
                username: username,
                email: email
            });
            await user.save();
        }
        const token = generateToken(user);
        await sendResponse(correlationId, 'Google sign up successful', 200, token,user.role, user._id);

    } catch (error) {
        console.error('Error in googleSignUp:', error);
        await sendResponse(correlationId, 'Internal server error', 500);
}}