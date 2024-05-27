// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: false},
    email: { type: String, required: true },
    creditAmount: { type: Number, required: true, default: 0 },
    role : { type: String, required: true, default: 'user' }
});

module.exports = mongoose.model('User', UserSchema);
