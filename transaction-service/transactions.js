const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { connectRabbitMQ, sendToQueue } = require('./utils/rabbitmq');
const { transQueue, transResponseQueue } = require('./config');
const Transaction = require('./models/transactionModel');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

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
        if (msg !== null) {
            await processMessage(msg, channel);
            channel.ack(msg);
        } else if (msg !== null) {
            // Requeue the message
            setTimeout(() => channel.nack(msg), 1000);
        }
    });
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main().catch(console.error);
});
