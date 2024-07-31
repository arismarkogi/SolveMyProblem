const { json } = require('express');
const User = require('../models/userModel');
const { sendToQueue } = require('../utils/rabbitmq'); // Corrected import

const crypto = require('crypto');
const jwt = require('jsonwebtoken');


exports.updateCredit = async (req, res) => {//form : "refund","purchase","consumption" etc
    const { userId, credit, form} = req.body;
    try{
    // Check for Google ID association
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    currentcredit = user.creditAmount;
    if (currentcredit + credit < 0) {
        return res.status(400).json({ message: 'Insufficient credits' });
    }
    user.creditAmount += credit;
    await user.save();
    //await User.updateOne({ _id: userId }, { $set: { credit: currentcredit + credit }});
    const message = {
        userId,
        credit,
        date : new Date().toISOString(),
        form
    }
    final_message ={
        type: "new",
        message
    }
    await sendToQueue('trans_queue', final_message);
    return res.status(200).json({ message: 'User credit update and transaction send to queue' });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
}
};
