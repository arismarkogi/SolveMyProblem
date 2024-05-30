const { json } = require('express');
const Transaction = require('../models/transactionModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.createTransaction = async (req, res) => {
    if(!req.body.userId || !req.body.amount || !req.body.type) {
        return res.status(400).json({ message: 'User, amount, and tyoe are required' });
    }
    const userId = req.body.userId;
    const amount = req.body.amount;
    const type = req.body.type;
    try {

        const transaction = new Transaction({
            userId: userId,
            amount: amount,
            type: type
        });

        await transaction.save();
        return res.json({ message: 'Transaction created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}