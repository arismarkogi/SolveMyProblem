const jwt = require('jsonwebtoken');
const axios = require('axios');

const getTransactions = async (req, res) => {
    try {
        console.log('Received request:', req.query);

        let token = req.token;
        let userId;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        else {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                // Extract id from the decoded token
                userId = decoded.id;
            } catch (error) {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const message = {
            headers: {
                authorization: `Bearer ${req.token}`,
                origin : `Bearer ${jwt.sign({origin : process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY)}`,
            },
            
        };

        console.log(`Sending request to transaction-service, userId: ${userId}`);
        const apiResponse = await axios.get(`http://transaction-service:4275/get-transactions`, message);

        // Return the API response to the client
        res.status(apiResponse.status).json(apiResponse.data);
    } catch (error) {
        console.error('Error finding transactions:', error);       
        res.status(500).json({ error: 'An error occurred while fetching transactions', details: error.message });
    }
};

module.exports = { getTransactions };