const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendToQueue } = require('../utils/rabbitmq');

// Reusable response function
const sendResponse = async (correlationId, message, status, token = null, role = null) => {
    const response = {
        headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },
        type: "login",
        correlationId,
        status,
        message: {
            message,
            token,
            role
        }
    };
    await sendToQueue('user-service-queue-res', response);
};

exports.logIn = async (message) => {
    console.log('User-service: Received login request');
    const { correlationId, email, password, isAdmin } = message;

    try {
        // Validate required fields
        if (!email) {
            console.log('User-service: Missing email');
            await sendResponse(correlationId, 'Email is a necessary field', 400);
            return;
        }
        if (!password) {
            console.log('User-service: Missing password');
            await sendResponse(correlationId, 'Password is a necessary field', 400);
            return;
        }

        console.log(`User-service: Attempting to find user with email: ${email}`);
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const role = isAdmin ? 'admin' : 'user';

        // Find the user with the provided credentials
        const user = await User.findOne({ email, password: hashedPassword, role });

        if (!user) {
            console.log('User-service: Invalid email or password');
            await sendResponse(correlationId, 'Invalid email or password', 401);
            return;
        }

        console.log('User-service: User found, generating token');
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not set');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );

        console.log('User-service: Sending successful login response');
        await sendResponse(correlationId, 'Login successful', 200, token, user.role);

    } catch (error) {
        console.error('User-service: Error in login:', error);
        await sendResponse(correlationId, `Internal server error: ${error.message}`, 500);
    }
};
