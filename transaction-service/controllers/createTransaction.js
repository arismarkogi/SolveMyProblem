const Transaction = require('../models/transactionModel');
const {sendToQueue } = require('../utils/rabbitmq');


const sendResponse = async (correlationId, message, status, userId =null,transactionId = null) => {
    const response = {
        type: "new",
        correlationId,
        message,
        status,
        userId,
        transactionId
    };
    await sendToQueue('trans_response_queue', response);
};
const createTransaction = async (msg) => {
    console.log('Received message:', msg);
    if (!msg) {
        console.error('No message received');
        return;
    }
    const { correlationId, userId, creditAmount, form } = msg;
    console.log('correlationId', correlationId);

    if (!userId) {
        await sendResponse(correlationId, "User's ID is required", 400);
        return;
    }
    if(!creditAmount) {
        await sendResponse(correlationId, 'Credit Amount is required', 400);
        return;
    }
    if(!form) {
        await sendResponse(correlationId, 'Form is required', 400);
        return;
    }

    /*if (!userId || !creditAmount || !form) {
        console.error('Missing required fields');
        const errorMessage = {
            correlationId,
            userId,
            creditAmount,
            form,
            success: false,
            message: 'Missing required fields'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
        return;
    }*/

    
    try {

        // create and save new transaction
        const transaction = new Transaction({
            userId: userId,
            amount: creditAmount,
            createdAt: new Date(),
            type: form
        });

        await transaction.save();

        //send success message
        await sendResponse(correlationId, 'Credit added and transaction created successfully', 200,userId,transaction._id);

    } catch (error) {
        console.error(error);
        await sendResponse(correlationId, 'Internal server error', 500);
    }
};

module.exports = { createTransaction };
