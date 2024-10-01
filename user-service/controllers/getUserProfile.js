const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (message, res=null) => {
    const { userId } = message.params;

    try {
        console.log(`User-service: Fetching profile for user ${userId}`);
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            console.log(`User-service: User ${userId} not found`);
            return res.status(404).json({
                headers: {
                    authorization: message.headers.authorization,
                    origin: message.headers.origin
                },  
                error: 'User not found' 
            });
        }

        console.log(`User-service: Profile fetched successfully for user ${userId}`);
        return res.status(200).json( {
            headers: {
                authorization: message.headers.authorization,
                origin: message.headers.origin
            },
            type: 'get_user_profile',
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
        return res.status(500).json({
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'get_user_profile',
            message: 'Internal server error'
        });
    }
};