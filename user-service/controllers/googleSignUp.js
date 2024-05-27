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
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ googleId: id });
        if (existingUser) { 
            await User.updateOne(
                    { googleId: id },
                    { $set: { username: username, email: email }}
            );
            return res.json({ message: 'User already exists' });
        }
        else {
            // Create a new user
            const user = new User({
                googleId: id,
                username: username,
                email: email
            });
            await user.save();
            return res.json({ message: 'User created successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}