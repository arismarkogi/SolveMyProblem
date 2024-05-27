const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.logIn = async (req, res) => {
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    function generateToken(user) {
        const payload = {
            id: user._id, // Include user ID in the payload
            role: user.role // Include the role in the payload
        };
        // Sign the token with your secret key and set an expiration (e.g., 1 hour)
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    const email = req.body.email;
    const password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    try {
        // Find the user
        const user = await User.findOne({ email: email, password: password});

        if (!user) return res.status(401).json({ message: 'Invalid username or password' });

        // Generate token
        const token = generateToken(user);
        // Return the token
        return res.json({ token: token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}