const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.logIn = async (req, res) => {
    const { email, password } = req.body;
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    function generateToken(user) {
        const payload = {
            id: user._id, // Include user ID in the payload
            role: user.role // Include the role in the payload
        };
        // Sign the token with your secret key and set an expiration (e.g., 1 hour)
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    
    try {
        if (!email || !password) {//checking necessary fields
            const errorResponse = { message: 'Email and password are required', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        // Find the user with the given email and password
        const user = await User.findOne({ email: email, password: hashedPassword});

        if (!user) {
            const errorResponse = { message: 'Invalid email or password', success: false };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        // Generate token
        const token = generateToken(user);
        // Send success response
        const successResponse = { 
            message: 'Login successful',
            success: true,
            token: token,
            userId: user._id
        };
        await sendToQueue('user-service-queue-res', successResponse)

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}