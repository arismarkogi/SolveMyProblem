const ObjectId = require('mongoose').Types.ObjectId;
const Transaction = require('../models/transactionModel');
const jwt = require('jsonwebtoken');

const getTransactions = async (req, res) => {
    try {
        console.log('Received request', req.headers);
        let userId = req.user;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Don't exclude _id to ensure you get the transaction IDs
        const transactions = await Transaction.find({ userId: new ObjectId(userId) })
            .select('-__v')
            .sort({ createdAt: -1 })  // Sort by createdAt in descending order
            .exec();

        console.log('Transactions Found:', transactions);

        res.json({ transactions });
    } catch (error) {
        console.error('Error finding transactions:', error);       
        res.status(500).json({ error: 'An error occurred while fetching transactions', details: error.message });
    }
};

module.exports = { getTransactions };