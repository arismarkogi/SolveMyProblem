const ObjectId = require('mongoose').Types.ObjectId;
const Problem = require('../models/problemModel');
const jwt = require('jsonwebtoken');

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

        // Don't exclude _id to ensure you get the problem IDs
        const problems = await Problem.find({ userId: new ObjectId(userId) }).select('-__v').exec();

        console.log('Problems Found:', problems);

        res.json({ problems });
    } catch (error) {
        console.error('Error finding problems:', error);
        res.status(500).json({ error: 'An error occurred while fetching problems', details: error.message });
    }
};

module.exports = { getProblems };
