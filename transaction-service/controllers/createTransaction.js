const Transaction = require('../models/transactionModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

// Reusable response function
const sendResponse = async (msg, message, status, channel, transactionId = null) => {
    let response = {
        type: "new",
        correlationId: msg.correlationId,
        form: msg.form,
        message,
        status,
        token: msg.token,
        transactionId
    };

    if (msg.form === "spend") {
        const { type, ...rest } = msg;

        response = {
            type: "problemIssue",
            ...rest,
            status,
            message,
            transactionId
        };
    }

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
        await sendResponse(msg, "JWT token must be provided", 400, channel, null);
        return;
    }

    try {
        // Verify the token and extract user details
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { id: userId } = decoded;

        // Validate other required fields
        if (creditAmount === undefined) {
            await sendResponse(msg, 'Credit Amount is required', 400, channel, null);
            return;
        }

        if (!form) {
            await sendResponse(msg, 'Form is required', 400, channel, null);
            return;
        }

        // Create and save the new transaction
        const transaction = new Transaction({
            userId,
            amount: creditAmount,
            createdAt: new Date(),
            type: form
        });

        await transaction.save();

        // Send success message
        await sendResponse(msg, 'Credit updated successfully', 200, channel, transaction._id);
    } catch (error) {
        console.error('Error in createTransaction:', error);
        if (error.name === 'JsonWebTokenError') {
            await sendResponse(msg, 'Invalid JWT token', 401, channel, null);
        } else {
            await sendResponse(msg, 'Internal server error', 500, channel, null);
        }
    }
};

module.exports = { createTransaction };