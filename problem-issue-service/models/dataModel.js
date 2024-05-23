// models/dataModel.js
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    command: { type: String, required: true },
    locationFile: { type: String, required: true },
    pythonFile: { type: String, required: true }
});

module.exports = mongoose.model('Data', DataSchema);
