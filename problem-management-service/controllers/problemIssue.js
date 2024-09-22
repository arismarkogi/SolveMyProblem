
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
/*
const express = require('express');
const bodyParser = require('body-parser');
const { sendToQueue } = require('../utils/rabbitmq');
const Problem = require('../models/problemModel'); // Assuming you have a Problem model

const router = express.Router();
router.use(bodyParser.json()); // Parse JSON bodies
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
*/
const express = require('express');
const bodyParser = require('body-parser');
const Problem = require('../models/problemModel');
const { sendToQueue } = require('../utils/rabbitmq');
/*
const submitData = async (message) => {
    try {
        console.log('Raw message received:', JSON.stringify(message, null, 2));

        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = message;

        // Detailed validation
        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (numVehicles === undefined) missingFields.push('numVehicles');
        if (depot === undefined) missingFields.push('depot');
        if (maxDistance === undefined) missingFields.push('maxDistance');
        if (!locationFileContent) missingFields.push('locationFileContent');
        if (!pythonFileContent) missingFields.push('pythonFileContent');

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields.join(', '));
            return;
        }

        // Create a new Problem document
        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFile: JSON.stringify(locationFileContent),
            submissionDate: new Date(),
            status: 'pending',
            hasSolution: false,
            solution: "",
            maxRouteDistance: 0,
            totalDistTravel: 0,
            executionDuration: 0
        });

        // Save the problem to the database
        const savedProblem = await newProblem.save();
        console.log('Problem saved successfully:', savedProblem);

        // Prepare the message to be sent to the queue
        const messageToQueue = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent,
            pythonFileContent,
        };

        // Send the problem data to the queue for further processing
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Message sent to solver queue');
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};
*/
/*
const submitData = async (message) => {
    try {
        console.log('Raw message received:', JSON.stringify(message, null, 2));

        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = message;

        // Detailed validation
        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (numVehicles === undefined) missingFields.push('numVehicles');
        if (depot === undefined) missingFields.push('depot');
        if (maxDistance === undefined) missingFields.push('maxDistance');
        if (!locationFileContent) missingFields.push('locationFileContent');
        if (!pythonFileContent) missingFields.push('pythonFileContent');

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields.join(', '));
            return;
        }

        // Create a new Problem document
        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFile: JSON.stringify(locationFileContent), // Store the full locationFileContent
            pythonFile: pythonFileContent, // Store the pythonFileContent
            submissionDate: new Date(),
            status: 'pending',
            hasSolution: false,
            solution: "",
            maxRouteDistance: 0,
            totalDistTravel: 0,
            executionDuration: 0
        });

        // Save the problem to the database
        const savedProblem = await newProblem.save();
        console.log('Problem saved successfully:', savedProblem);

        // Prepare the message to be sent to the queue
        const messageToQueue = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent,
            pythonFileContent,
        };

        // Send the problem data to the queue for further processing
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Message sent to solver queue');
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};
*/



const submitData = async (message) => {
    try {
        console.log('Raw message received:', JSON.stringify(message, null, 2));

        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = message;
        console.log('locationFileContent:', JSON.stringify(locationFileContent, null, 2));
        console.log('pythonFileContent:', pythonFileContent);
        // Detailed validation
        const missingFields = [];
        if (!userId) missingFields.push('userId');
        if (numVehicles === undefined) missingFields.push('numVehicles');
        if (depot === undefined) missingFields.push('depot');
        if (maxDistance === undefined) missingFields.push('maxDistance');
        if (!locationFileContent) missingFields.push('locationFileContent');
        if (!pythonFileContent) missingFields.push('pythonFileContent');

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields.join(', '));
            return;
        }

        // Create a new Problem document
        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFile: locationFileContent,  // Store the full object
            pythonFile: pythonFileContent,  // Store the full Python code
            submissionDate: new Date(),
            status: 'pending',
            hasSolution: false,
            solution: "",
            maxRouteDistance: 0,
            totalDistTravel: 0,
            executionDuration: 0
        });
         console.log('Problem to be saved:', JSON.stringify(newProblem, null, 2));
        // Save the problem to the database
        const savedProblem = await newProblem.save();
        console.log('Problem saved successfully:', JSON.stringify(savedProblem, null, 2));

        // Prepare the message to be sent to the queue
        const messageToQueue = {
            problemId: savedProblem._id.toString(),
            numVehicles,
            depot,
            maxDistance,
            locationFileContent,
            pythonFileContent,
        };

        // Send the problem data to the queue for further processing
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Message sent to solver queue');
    } catch (error) {
        console.error('Error submitting data:', error);
    }
};

/*
const submitData = async (message) => {
    try {
        console.log('Raw message received in problem management service:', JSON.stringify(message, null, 2));

        const { userId, numVehicles, depot, maxDistance, locationFileContent, pythonFileContent } = message;
        
        console.log('Extracted locationFileContent:', JSON.stringify(locationFileContent, null, 2));
        console.log('Extracted pythonFileContent:', pythonFileContent);

        if (!userId || numVehicles === undefined || depot === undefined || maxDistance === undefined || !locationFileContent || !pythonFileContent) {
            console.error('Missing required fields');
            return;
        }

        const newProblem = new Problem({
            userId,
            numVehicles,
            depot,
            maxDistance,
            locationFile: JSON.stringify(locationFileContent),
            pythonFile: pythonFileContent,
            submissionDate: new Date(),
            status: 'pending',
            hasSolution: false,
            solution: "",
            maxRouteDistance: 0,
            totalDistTravel: 0,
            executionDuration: 0
        });

        console.log('Problem to be saved:', JSON.stringify(newProblem, null, 2));
        
        const savedProblem = await newProblem.save();
        console.log('Problem saved successfully:', JSON.stringify(savedProblem, null, 2));

        const messageToQueue = {
            problemId: savedProblem._id.toString(),
            numVehicles: savedProblem.numVehicles,
            depot: savedProblem.depot,
            maxDistance: savedProblem.maxDistance,
            locationFileContent: JSON.parse(savedProblem.locationFile),
            pythonFileContent: savedProblem.pythonFile,
        };

        console.log('Sending to solver queue:', JSON.stringify(messageToQueue, null, 2));
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Message sent to solver queue');
    } catch (error) {
        console.error('Error submitting data:', error.stack);
    }
};*/
module.exports = { submitData };
