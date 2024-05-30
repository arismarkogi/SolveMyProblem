const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateUser = async (req, res) => {
    const { userId, username, email, password } = req.body;
    try{
    // Check for Google ID association
    const user = await User.findOne({_id:userId});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (user.googleId) {
        return res.status(403).json({ message: 'Update not allowed for Google authenticated users' });
    }

    const updates = {};
    const conditions = [];

    if (username) {
        conditions.push({ username: username });
        updates.username = username;
    }
    if (email) {
        conditions.push({ email: email });
        updates.email = email;
    }
    if (password) {
        updates.password = crypto.createHash('sha256').update(password).digest('hex');
    }

    if (conditions.length > 0) {
        const existingUser = await User.findOne({ $or: conditions, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
    }

    await User.updateOne({ _id: userId }, { $set: updates });

    return res.status(200).json({ message: 'User data updated successfully' });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
}
};
