const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { stringify } = require('flatted'); 

exports.searchUsers = async (message, res=null) => {
    const {correlationId, username, email} = message.headers;
    console.log('User-service: Searching users with username:', username, 'email:', email);
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
            return res.status(200).json( {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: 'search',
                correlationId,
                message: 'No users found matching the criteria ',
                users: []
            });
        }
        res.status(200).json( {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'search',
            correlationId,
            message: 'Users found successfully',
            users: users
        });

    } catch (error) {
        console.error('User-service: Error in search users:', error);
        res.status(500).json({
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: 'search',
            correlationId,
            message: 'Internal server error: ' + error.message
        });
    }
};
