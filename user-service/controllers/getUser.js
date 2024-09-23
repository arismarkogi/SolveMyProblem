const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

exports.getUser = async (message) => {
    const { correlationId, token } = message;

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id, role } = decoded;
        const userId = id;

        console.log(`User-service: Fetching profile for user ${userId}`);
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            console.log(`User-service: User ${userId} not found`);
            await sendToQueue('user-service-queue-res', {
                type: 'get_user_profile',
                correlationId,
                status: 404,
                message: 'User not found'
            });
            return;
        }

        console.log(`User-service: Profile fetched successfully for user ${userId}`);
        await sendToQueue('user-service-queue-res', {
            type: 'get_user_profile',
            correlationId,
            status: 200,
            message: 'Profile fetched successfully',
            user: {
                id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                creditAmount: user.creditAmount
            }
        });

    } catch (error) {
        console.error('User-service: Error fetching user profile:', error);
        await sendToQueue('user-service-queue-res', {
            type: 'get_user_profile',
            correlationId,
            status: 500,
            message: 'Internal server error'
        });
    }
};