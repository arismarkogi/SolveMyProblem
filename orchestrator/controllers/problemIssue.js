const multer = require('multer');
const upload = multer(); // For parsing multipart form data

const { sendToQueue, consumeQueue } = require('../utils/rabbitmq');
/*
exports.problemIssue = [
    upload.none(), // Use multer to parse form-data without handling file uploads directly here
    async (req, res) => {
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
                userId, // Ensure userId is part of the payload
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
                        
                        // Add the type field here when sending the message to problem-service-issue queue
                        await sendToQueue('problem-service-issue', {
                            type: 'problemIssue', // Add the type field
                            ...req.body, // Include all request body data
                            userId // Ensure userId is included
                        });

                        return res.status(200).json({ message: 'Problem issued successfully' });
                    }
                }
            });

        } catch (error) {
            console.error('Error in problem issue saga:', error);
            res.status(500).json({ error: 'Error in problem issue saga' });
        }
    }
];
*/




exports.problemIssue = [
    upload.none(),
    async (req, res) => {
        try {
            const correlationId = generateCorrelationId();

            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            console.log("Full request body:", JSON.stringify(req.body, null, 2));

            console.log("Sending message to user-service-credit-req with User ID:", userId);
            
            await sendToQueue('user-service-credit-req', {
                ...req.body,
                userId,
                correlationId
            });
            console.log('Sent message to user-service-credit-req queue');

            consumeQueue('user-service-credit-res', async (msg) => {
                if (msg.correlationId === correlationId) {
                    console.log('Received message from user-service-credit-res:', msg);
                    
                    if (!msg.success) {
                        console.log('User has insufficient credits');
                        return res.status(400).json({ error: 'Insufficient credits' });
                    } else {
                        console.log('User has sufficient credits, sending problem to problem-service-issue queue');
                        
                        const problemMessage = {
                            type: 'problemIssue',
                            ...req.body,
                            userId
                        };
                        console.log("Sending to problem-service-issue:", JSON.stringify(problemMessage, null, 2));
                        await sendToQueue('problem-service-issue', problemMessage);

                        return res.status(200).json({ message: 'Problem issued successfully' });
                    }
                }
            });

        } catch (error) {
            console.error('Error in problem issue saga:', error);
            res.status(500).json({ error: 'Error in problem issue saga' });
        }
    }
];

/*
exports.problemIssue = [
    upload.none(),
    async (req, res) => {
        try {
            const correlationId = generateCorrelationId();

            const userId = req.body.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            console.log("Full request body:", JSON.stringify(req.body, null, 2));

            // Check credit first
            await sendToQueue('user-service-credit-req', {
                userId,
                correlationId
            });

            // Wait for credit check response
            const creditCheckResult = await new Promise((resolve) => {
                consumeQueue('user-service-credit-res', (msg) => {
                    if (msg.correlationId === correlationId) {
                        resolve(msg);
                    }
                });
            });

            if (!creditCheckResult.success) {
                return res.status(400).json({ error: 'Insufficient credits' });
            }

            // If credit check passed, send problem to problem-service-issue queue
            const problemMessage = {
                type: 'problemIssue',
                userId,
                numVehicles: parseInt(req.body.numVehicles),
                depot: parseInt(req.body.depot),
                maxDistance: parseInt(req.body.maxDistance),
                locationFileContent: req.body.locationFileContent, // Remove JSON.parse here
                pythonFileContent: req.body.pythonFileContent
            };

            console.log("Sending to problem-service-issue:", JSON.stringify(problemMessage, null, 2));
            await sendToQueue('problem-service-issue', problemMessage);

            return res.status(200).json({ message: 'Problem issued successfully' });

        } catch (error) {
            console.error('Error in problem issue saga:', error);
            res.status(500).json({ error: 'Error in problem issue saga' });
        }
    }
];
*/
const generateCorrelationId = () => {
    return Math.random().toString(36).substring(7);
};
