// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    creditAmount: { type: Number, required: true, default: 0 },
    googleToken: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
