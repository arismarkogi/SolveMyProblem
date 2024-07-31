const { connectRabbitMQ, sendToQueue } = require('./utils/rabbitmq');
const { exec } = require('child_process');
const { transQueue, transResponseQueue } = require('./config');
const Transaction = require('../models/transactionModel');

const fs = require('fs');
const path = require('path');
require('dotenv').config();

let isSolverBusy = false;

const createTransaction = async (msg,channel) => {
    const message = JSON.parse(msg.content.toString());
    const { userId, amount,date, form } = message;
    if(!userId ||!amount || !date || !form) {
        return res.status(400).json({ message: 'User, amount, and tyoe are required' });
    }
    
    console.log('Received message:', message);
    try {
        const transaction = new Transaction({
            userId: userId,
            amount: amount,
            createdAt: new Date(date),
            type: form
        });
        await transaction.save();
        resp = 'Transaction created successfully'
    } catch (error) {
        console.error(error);
        resp =  'Internal server error';
    }
    const resultMessage = {
        userId,
        result: resp
    };
    sendToQueue(transResponseQueue, resultMessage, channel);
};

const processMessage = async (msg, channel) => {
    const message = JSON.parse(msg.content.toString());
    const {type, mes} = message;
    if(type === "new"){
        await createTransaction(mes,channel);
    }

    console.log('Received message:', message);
};

const main = async () => {
    const channel = await connectRabbitMQ();

    console.log('Waiting for messages in', transQueue);

    channel.consume(transQueue, async (msg) => {
        if (msg !== null && !isSolverBusy) {
            isSolverBusy = true;
            await processMessage(msg, channel);
            channel.ack(msg);
            isSolverBusy = false;
        } else if (msg !== null) {
            // Requeue the message
            setTimeout(() => channel.nack(msg), 1000);
        }
    });
};

main().catch(console.error);
