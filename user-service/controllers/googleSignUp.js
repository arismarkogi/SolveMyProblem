const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.googleSignUp = async (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const email = req.body.email;
    if(!id || !username || !email) {
        return res.status(400).json({ message: 'Something missing' });
    }
    function generateToken(user) {
        const payload = {
            id: user._id, // Include user ID in the payload
            role: user.role // Include the role in the payload
        };
        // Sign the token with your secret key and set an expiration (e.g., 1 hour)
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    }
    try {
        const existingmailUser = await User.findOne({ email: email });
        if (existingmailUser) return res.status(400).json({ message: 'Email already used' });


        const existingUser = await User.findOne({ googleId: id });
        if (existingUser) { 
            await User.updateOne(
                    { googleId: id },
                    { $set: { username: username, email: email }}
            );
        }
        else {
            // Create a new user
            const user = new User({
                googleId: id,
                username: username,
                email: email
            });
            await user.save();
        }
        return res.json({ token: generateToken(user) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}