/*
const { json } = require('express');
const jwt = require('jsonwebtoken');
const { sendToQueue, receiveFromQueue } = require('../utils/rabbitmq');


exports.problemIssue = async (req, res) => {
    try {
        await sendToQueue('user-service-credit-req', req.body);
        await receiveFromQueue('user-service-credit-res', async (msg) => {
            if (!msg.success) {
               res.status(400);
            }
            else {
                await sendToQueue('problem-service-issue', req.body);
                res.status(200);
            }
        });
        if (res.statusCode === 200) {
            return res.status(200).json({ message: 'Problem issued successfully' });
        }
        else {
            return res.status(500).json({ error: 'Internal Error' });
        }
    }
    catch (error) {
        // Not sure if this the one chief - Fix if necessary
        console.error('Error in problem issue saga:', error);
        res.status(500).json({ error: 'Error in problem issue saga' });
    }
}

exports.problemResult = async (req, res) => {
    try {
        data = {};
        await receiveFromQueue('problem-service-issue-res', async (msg) => {
            if (!msg.success) {
                res.status(400);
            }
            else {
                res.status(200);
                data = msg;
            }
        }
        );
        if (res.statusCode === 200) {
            return res.status(200).json({ message: 'Problem result received successfully', data: data });
        }
        else {
            return res.status(500).json({ error: 'Internal Error' });
        }
    }
    catch (error) {
        console.error('Error in problem result saga:', error);
        res.status(500).json({ error: 'Error in problem result saga' });
    }
}
*/
const { sendToQueue, consumeQueue } = require('../utils/rabbitmq');

exports.problemIssue = async (req, res) => {
    try {
        const correlationId = generateCorrelationId(); // Generate a unique correlation ID for this request

        const userId = req.body.userId; // Ensure userId is captured here
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        console.log("Sending message to user-service-credit-req with User ID:", userId);
        
        // Send the request to the user-service-credit-req queue
        await sendToQueue('user-service-credit-req', {
            ...req.body,
            userId,
            correlationId
        });
        console.log('Sent message to user-service-credit-req queue');

        // Wait for the response from the user-service-credit-res queue
        consumeQueue('user-service-credit-res', async (msg) => {
            if (msg.correlationId === correlationId) {
                console.log('Received message from user-service-credit-res:', msg);
                
                if (!msg.success) {
                    console.log('User has insufficient credits');
                    return res.status(400).json({ error: 'Insufficient credits' });
                } else {
                    console.log('User has sufficient credits, sending problem to problem-service-issue queue');
                    await sendToQueue('problem-service-issue', req.body);
                    return res.status(200).json({ message: 'Problem issued successfully' });
                }
            }
        });

    } catch (error) {
        console.error('Error in problem issue saga:', error);
        res.status(500).json({ error: 'Error in problem issue saga' });
    }
};

const generateCorrelationId = () => {
    return Math.random().toString(36).substring(7);
};
