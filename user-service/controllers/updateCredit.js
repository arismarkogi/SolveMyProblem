const { json } = require('express');
const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateCredit = async (req, res) => {
    const { userId, credit} = req.body;
    try{
    // Check for Google ID association
    const user = await User.findOne({_id:userId});
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    currentcredit = user.credit;
    if (currentcredit + credit < 0) {
        return res.status(400).json({ message: 'Insufficient credits' });
    }
    await User.updateOne({ _id: userId }, { $set: { credit: currentcredit + credit }});

    return res.status(200).json({ message: 'User data updated successfully' });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
}
};
