const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.returnUsers = async (req, res) => {
    try {
        const { username, email } = req.body; 

        // Build the query object
        let query = { role: 'user' };
        if (username || email) {
            query.$or = [];
            if (username) {
                query.$or.push({ username: { $regex: username, $options: 'i' } }); // caseinsensitive- matching
            }
            if (email) {
                query.$or.push({ email: { $regex: email, $options: 'i' } }); // case-insensitive matching
            }
        }

        const users = await User.find(query);

        if (users.length > 0) {
            return res.status(200).json({
                message: "Users retrieved successfully",
                data: users
            });
        } else {
            return res.status(404).json({ message: "No users found" });
        }
    } catch (error) {
        console.error("Database query error", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
