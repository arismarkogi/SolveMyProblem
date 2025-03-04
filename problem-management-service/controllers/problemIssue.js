
const express = require('express');
const bodyParser = require('body-parser');
const Problem = require('../models/problemModel');
const { sendToQueue } = require('../utils/rabbitmq');
const jwt = require('jsonwebtoken');

const deleteProblem = async (req, res) => {
    const { id } = req.params;

    try {
        const problem = await Problem.findById(id);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        if (problem.status !== 'finished') {
            return res.status(400).json({ message: 'Cannot delete problem. The problem is not finished.' });
        }

        await Problem.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        return res.status(500).json({ message: 'Server error while deleting problem' });
    }
};



const submitData = async (message) => {
    try {
        console.log('Raw message received:', JSON.stringify(message, null, 2));

        const {
            token,
            correlationId,
            numVehicles,
            depot,
            maxDistance,
            locationFileContent,
            pythonFileContent
        } = message;
        console.log('locationFileContent:', JSON.stringify(locationFileContent, null, 2));
        console.log('pythonFileContent:', pythonFileContent);
        // Detailed validation

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
        // Extract id and role from the decoded token
        const { id, role } = decoded;
        const userId = id;

        const missingFields = [];
        if (!token) missingFields.push('token');
        if (numVehicles === undefined) missingFields.push('numVehicles');
        if (depot === undefined) missingFields.push('depot');
        if (maxDistance === undefined) missingFields.push('maxDistance');
        if (!locationFileContent) missingFields.push('locationFileContent');
        if (!pythonFileContent) missingFields.push('pythonFileContent');

        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields.join(', '));
            await sendToQueue('probMan-to-orch-queue', {
                headers: {
                    origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
                },
                type: "problem_submission",
                status: 400,
                correlationId,
                token,
                message: 'Missing required fields',
            });
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
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            problemId: savedProblem._id.toString(),
            correlationId,
            token,
            numVehicles,
            depot,
            maxDistance,
            locationFileContent,
            pythonFileContent,
        };

        // Send the problem data to the queue for further processing
       /* await sendToQueue('probMan-to-orch-queue', {
            type: "problem_submission",
            status: 200,
            correlationId,
            token,
            message: 'Problem submitted successfully',
        });*/
        await sendToQueue('probMan-to-solver-queue', messageToQueue);

        console.log('Message sent to solver queue');
    } catch (error) {
        await sendToQueue('probMan-to-orch-queue', {
            headers: {
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            type: "problem_submission",
            status: 500,
            correlationId,
            token,
            message: 'internal server error',
        });
        console.error('Error submitting data:', error);
    }
};

module.exports = { submitData, deleteProblem };
