const jwt = require('jsonwebtoken');
const axios = require('axios');

const getProblems = async (req, res) => {
    try {
        console.log('Received request:', req.query);

        let { userId, token } = req.query;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        if (!userId) {
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

        message = {
            headers: {
                authorization: `Bearer ${token}`,
                origin: `Bearer ${jwt.sign({ origin: process.env.ORIGIN }, process.env.JWT_SECRET_ORIGIN_KEY) }`,
            },
            type: 'getProblems',
        };

        const apiResponse = await axios.get(`http://problem-management-service:5000/getProblems?userId=${userId}&token=${token}`, message);
        res.status(apiResponse.status).json(apiResponse.data);
    } catch (error) {
        console.error('Error finding problems:', error);
        res.status(500).json({ error: 'An error occurred while fetching problems', details: error.message });
    }
};

module.exports = { getProblems };
