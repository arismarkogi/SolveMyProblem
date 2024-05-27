const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    if(!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }
    const username = req.body.username;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    const email = req.body.email;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne( {$or: [
            { email: email },
            { username: username }
        ]});
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Create a new user
        const user = new User({
            username: username,
            password: password,
            email: email
        });
        await user.save();
        return res.json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}