const { json } = require('express');
const Transaction = require('../models/transactionModel');
const {sendToQueue } = require('../utils/rabbitmq');



const createTransaction = async (msg,channel) => {
    console.log('Received message:', msg);
    const { userId, creditAmount, form } = msg;
    // Check if the required fields are present
    if (!userId || !creditAmount || !form) {
        console.error('Missing required fields');
        const errorMessage = {
            userId,
            form,
            success: false,
            message: 'Missing required fields'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
        return;
    }

    
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
        const successMessage = {
            userId,
            form,
            success: true,
            transactionId: transaction._id,
            message: 'Transaction created successfully'
        };
        await sendToQueue('trans_response_queue', successMessage, channel);

    } catch (error) {
        // Log the error and send an error message
        console.error('Error creating transaction:', error);
        const errorMessage = {
            userId,
            form,
            success: false,
            message: 'Failed to create transaction'
        };
        await sendToQueue('trans_response_queue', errorMessage, channel);
    }
};

module.exports = { createTransaction };
