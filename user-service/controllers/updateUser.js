const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq'); // Corrected import
const validator = require('validator');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateUser = async (message) => {
    let {correlationId, userId,token, username, email, password } = message;
    console.log('Received request token:', token);
    try{
    if (!userId) {
            try {
                let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                // Extract id from the decoded token
                userId = decoded.id;
            } catch (error) {
                console.error('Error verifying token:', error);
                const errorResponse = {headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },type:"update", correlationId : correlationId,message: 'Invalid Token', status: 401 };
                await sendToQueue('user-service-queue-res', errorResponse);
                return;
            }
        }
    if (!userId) {
            const errorResponse = {headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },type:"update", correlationId : correlationId, message: 'User ID is required', status: 400 };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
    
        const user = await User.findOne({_id:userId});

    if (!user) {
        const errorResponse = {headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },type:"update", correlationId : correlationId,message: 'User not found', status: 404 };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
    }

    if (user.googleId) {
        const errorResponse = {headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },type:"update", correlationId : correlationId, message: 'Update not allowed for Google authenticated users', status: 400 };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
    }

    const updates = {};
    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username, _id: { $ne: userId } });
        if (existingUser) {
            const errorResponse = {headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },type:"update", correlationId : correlationId, message: 'Username already exists', status: 400 };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        updates.username = username;
    }
    if (email && email !== user.email) {
        if (!validator.isEmail(email)) {
            const errorResponse = {headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },type:"update", correlationId : correlationId, message: 'Invalid email format', status: 400 };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        const existingUser = await User.findOne({ email, _id: { $ne: userId } });
        if (existingUser) {
            const errorResponse = {headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },type:"update", correlationId : correlationId, message: 'Email already exists', status: 400 };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        updates.email = email;
    }
    if (password) {
        if (password.length < 8) {
            const errorResponse = {headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },type:"update", correlationId : correlationId, message: 'Password must be at least 8 characters long', status: 400 };
            await sendToQueue('user-service-queue-res', errorResponse);
            return;
        }
        updates.password = crypto.createHash('sha256').update(password).digest('hex');
    }


    if (Object.keys(updates).length === 0) {
        const errorResponse = {headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },type:"update", correlationId : correlationId, message: 'No valid updates provided', status: 400 };
        await sendToQueue('user-service-queue-res', errorResponse);
        return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

    
    const finalMessage = {
        headers: {
            origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
        },
        type:"update", 
        correlationId : correlationId,
        //userId,
        status: 200,
        message: 'User updated successfully'
    };
    await sendToQueue('user-service-queue-res', finalMessage);
    } catch (error) {
    console.error(error);
    const errorResponse = {headers: {
        origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
    },type:"update", correlationId : correlationId, message: 'Internal server error', status: 500 };
    await sendToQueue('user-service-queue-res', errorResponse);
}
};
