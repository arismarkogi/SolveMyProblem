const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

exports.searchUsers = async (message) => {
    const {correlationId, username, email} = message

        // Build the query object
    try {
            // Build the query, case insensitive matching
        let query = { role: 'user' };
        if (username) {
            query.username = { $regex: username, $options: 'i' };
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        //return users sorted by username without password
        const users = await User.find(query).sort({ username: 1 }).select('-password');;
        
        // no users case
        if (users.length === 0) {
            console.log('No matching users found');
            await sendToQueue('user-service-queue-res', {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: 'search',
                correlationId,
                status: 200,
                message: 'No users found matching the criteria ',
                users: []
            });
            return;
        }
        await sendToQueue('user-service-queue-res', {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'search',
            correlationId,
            status: 200,
            message: 'Users found successfully',
            users: users
        });

    } catch (error) {
        console.error('User-service: Error in search users:', error);
        await sendToQueue('user-service-queue-res', {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'search',
            correlationId,
            status: 500,
            message: 'Internal server error: ' + error.message
        });
    }
};
