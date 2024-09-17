const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendToQueue } = require('../utils/rabbitmq');

exports.logIn = async (message) => {
    console.log('User-service: Received login request');
    const { correlationId, email, password, isAdmin } = message;

    try {
        if (!email || !password) {
            console.log('User-service: Missing email or password');
            await sendToQueue('user-service-queue-res', {
                correlationId,
                status: 400,
                message: 'Email and password are required'
            });
            return;
        }

        console.log(`User-service: Attempting to find user with email: ${email}`);
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        const role = isAdmin ? 'admin' : 'user';


        const user = await User.findOne({ email, password: hashedPassword, role });

        if (!user) {
            console.log('User-service: Invalid email or password');
            await sendToQueue('user-service-queue-res', {
                correlationId,
                status: 401,
                message: 'Invalid email or password '
            });
            return;
        }

        console.log('User-service: User found, generating token');
        console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY); // Add this line for debugging

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('JWT_SECRET_KEY is not set');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        console.log('User-service: Sending successful login response');
        await sendToQueue('user-service-queue-res', {
            correlationId,
            status: 200,
            message: 'Login successful',
            token,  // Send the token as part of the response
            userId: user._id,
            role: user.role
        });

    } catch (error) {
        console.error('User-service: Error in login:', error);
        await sendToQueue('user-service-queue-res', {
            correlationId,
            status: 500,
            message: 'Internal server error: ' + error.message
        });
    }
};
