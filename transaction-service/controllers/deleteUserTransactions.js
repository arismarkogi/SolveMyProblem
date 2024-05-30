const { json } = require('express');
const Transaction = require('../models/transactionModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.deleteUserTransactions = async (req, res) => {
    const { userId } = req.body;
    try{

    const transactions = await Transaction.find({ userId: userId });
    if (!transactions) {
        return res.status(404).json({ message: 'Transactions not found' });
    }
    await Transaction.deleteMany({ userId: userId });
    return res.status(200).json({ message: 'Transactions deleted successfully' });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
}

}