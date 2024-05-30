const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.deleteUser = async (req, res) => {
    const { userId } = req.body;

    // Check for Google ID association
    const user = await User.findOne({ _id: userId   });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: userId });
    return res.status(200).json({ message: 'User deleted successfully' });
}