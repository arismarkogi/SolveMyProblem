const cors = require('cors');  // Import the cors middleware
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dataRoutes = require('./routes/dataRoutes');
const { receiveSolution } = require('./controllers/receiveSolution');
const { submitData } = require('./controllers/problemIssue');
const { getProblems } = require('./controllers/getProblems');
const { getStats } = require('./controllers/stats');
const { connectRabbitMQ, consumeQueue } = require('./utils/rabbitmq');
require('dotenv').config();

const app = express();

app.use(cors());  // Enable CORS
app.use(bodyParser.json());
app.use('/', dataRoutes);

connectRabbitMQ();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

const processMessage = async (message) => {
    const { type } = message; // Get the type directly
    console.log('Received message:', message); // Log the raw message

    switch(type) {
        case "problemIssue": 
            console.log('Processing problem issue message...');
            await submitData(message); // Pass the entire message
            return;
        case "getProblems": 
            await getProblems(message); 
            return;
        case "getStats": 
            await getStats(); 
            return;
        default: 
            console.log('Unknown message type:', type);
    }
};



const main = async () => {
    try {
        // Establish the RabbitMQ connection and channel
        await connectRabbitMQ();
        await consumeQueue('solver-to-probMan-queue', receiveSolution);
        await consumeQueue('problem-service-issue', processMessage)
    } catch (error) {
        console.error('Error in main function:', error);
        process.exit(1);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    main().catch(console.error);
});
