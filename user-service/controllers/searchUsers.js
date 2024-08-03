const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');

exports.searchUsers = async (message) => {
    const { username, email} = message

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
            const noResultsResponse = {
                message: 'No users found matching the criteria',
                success: true,
                users: [],
            };
            await sendToQueue('user-service-queue-res', noResultsResponse);
            return;
        }
        //users found case
        const successResponse = {
            message: 'Users found successfully',
            success: true,
            users: users,
        };
        await sendToQueue('user-service-queue-res', successResponse);
    } catch (error) {
        // error case
        console.error(error);
        const errorResponse = { message: 'Internal server error', success: false };
        await sendToQueue('user-service-queue-res', errorResponse);
    }
};
