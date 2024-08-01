const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.googleSignUp = async (req, res) => {
    const { id, username, email } = req.body;

    function generateToken(user) {
        const payload = {
            id: user._id, // Include user ID in the payload
            role: user.role // Include the role in the payload
        };
        // Sign the token with your secret key and set an expiration (e.g., 1 hour)
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    try {
        if (!id || !username || !email) {
            const errorResponse = { message: 'Google ID, username, and email are required', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        const existingEmailUser = await User.findOne({ email: email });
        if (existingEmailUser) {
            const errorResponse = { message: 'Email already used', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }


        let user = await User.findOne({ googleId: id });
        if (user) {
            // Update existing user
            await User.updateOne(
                { googleId: id },
                { $set: { username: username, email: email }}
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
        const successResponse = { 
            message: 'Google sign up successful',
            success: true,
            token: token,
            userId: user._id
        };
        await sendToQueue('user-service-queue-res', successResponse);
    } catch (error) {
        console.error(error);
        const errorResponse = { message: 'Internal server error', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
    }
}