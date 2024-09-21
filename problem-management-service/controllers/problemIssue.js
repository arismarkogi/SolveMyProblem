const express = require('express');
const bodyParser = require('body-parser');
const { sendToQueue } = require('../utils/rabbitmq');
const Problem = require('../models/problemModel'); // Assuming you have a Problem model

const router = express.Router();
router.use(bodyParser.json()); // Parse JSON bodies
/*
const submitData = async (req, res) => {
    try {
        // Extract fields from the JSON payload
        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = req.body;

        // Validate that all required fields are present
        if (!userId || !numVehicles || !depot || !maxDistance || !locationFileContent || !pythonFileContent) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new Problem document
        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFileContent, // Storing the location data directly
            pythonFileContent, // Storing the Python code directly
            status: 'pending',
        });

        // Save the problem to the database
        const savedProblem = await newProblem.save();

        // Prepare the message to be sent to the queue
        const message = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent, // Sending location data as part of the message
            pythonFileContent,   // Sending Python code as part of the message
        };


        console.log('Message sent to solver-service:', message);

        // Send the problem data to the queue for further processing
        await sendToQueue('probMan-to-solver-queue', message);

        // Respond with success
        res.status(200).json({ message: 'Problem submitted successfully' });
    } catch (error) {
        console.error('Error submitting data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
*/
const submitData = async (message) => {
    try {
        // Log the message to verify structure
        console.log('Raw message received:', message);

        // Extract fields directly from the message
        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = message;

        // Validate that all required fields are present
        if (!userId || !numVehicles || !depot || !maxDistance || !locationFileContent || !pythonFileContent) {
            console.error('Missing required fields');
            return;
        }

        // Create a new Problem document
        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFileContent, // Storing the location data directly
            pythonFileContent, // Storing the Python code directly
            status: 'pending',
        });

        // Save the problem to the database
        const savedProblem = await newProblem.save();

        // Prepare the message to be sent to the queue
        const messageToQueue = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent, // Sending location data as part of the message
            pythonFileContent,   // Sending Python code as part of the message
        };

        // Send the problem data to the queue for further processing
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Problem submitted successfully:', savedProblem);
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};


module.exports = { submitData };
