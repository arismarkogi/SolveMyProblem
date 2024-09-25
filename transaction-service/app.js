const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const { connectRabbitMQ } = require('./utils/rabbitmq');
const Transaction = require('./models/transactionModel');
const createTransactionController = require('./controllers/createTransaction');
const deleteUserTransactionsController = require('./controllers/deleteUserTransactions');
const getUserTransactionsController = require('./controllers/getUserTransactions');
const healthCheckController = require('./controllers/healthCheck');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



const processMessage = async (msg, channel) => {
    const message = JSON.parse(msg.content.toString());
    const {type, mes} = message;
    if(type === "new"){
        await createTransactionController.createTransaction(mes,channel);
    }
    else if(type === "return"){
        await getUserTransactionsController.getUserTransactions(mes,channel);
        
    }
    else if(type === "delete"){
        await deleteUserTransactionsController.deleteUserTransactions(mes,channel);
    }
    else if(type === "health"){
        await healthCheckController.healthCheck(mes,channel);
    }

    console.log('Received message:', message);
};

const main = async () => {
    try {
        const channel = await connectRabbitMQ();

        console.log('Waiting for messages in trans_queue');

        await channel.consume('trans_queue', async (msg) => {
            console.log('Received message from user-service:', msg.content.toString());
            if (msg !== null) {
                await processMessage(msg, channel);
                channel.ack(msg);
            }
        });
    }catch (error) {
        console.error('Error in main function:', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main().catch(console.error);
});
