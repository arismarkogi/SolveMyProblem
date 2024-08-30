const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.getUserProfile = async (message) => {
    const { correlationId, userId } = message;

    try {
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