const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

// Reusable response function
const sendResponse = async (correlationId, message, status, channel, token = null, transactionId = null) => {
    const response = {
        type: "new",
        correlationId,
        message,
        status,
        token,
        transactionId
    };
    await sendToQueue('trans_response_queue', response, channel);
};

const createTransaction = async (msg, channel) => {
    console.log('Received message:', msg);

    if (!msg) {
        console.error('No message received');
        return;
    }

    const { correlationId, token, creditAmount, form } = msg;

    console.log('correlationId:', correlationId);

    // Check if token is provided
    if (!token) {
        console.log('User-service: Missing token');
        await sendResponse(correlationId, "JWT token must be provided", 400, channel);
        return;
    }

    try {
        // Verify the token and extract user details
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id, role } = decoded;
        const userId = id;

        // Validate other required fields
        if (!creditAmount) {
            await sendResponse(correlationId, 'Credit Amount is required', 400, channel);
            return;
        }

        if (!form) {
            await sendResponse(correlationId, 'Form is required', 400, channel);
            return;
        }

        // Create and save the new transaction
        const transaction = new Transaction({
            userId: userId,
            amount: creditAmount,
            createdAt: new Date(),
            type: form
        });

        await transaction.save();

        // Send success message
        await sendResponse(correlationId, 'Credit updated successfully', 200, channel, token, transaction._id);

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            console.error('Invalid JWT token:', error);
            await sendResponse(correlationId, 'Invalid JWT token', 401, channel);
        } else {
            console.error('Internal server error:', error);
            await sendResponse(correlationId, 'Internal server error', 500, channel);
        }
    }
};

module.exports = { createTransaction };
