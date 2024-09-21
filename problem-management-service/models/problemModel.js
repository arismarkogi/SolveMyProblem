// models/dataModel.js
/*
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    locationFile: { type: String, required: true },
    numVehicles: {type: Number, required: true},
    depot: {type: Number, required: true},
    maxDistance: {type: Number, required: true},
    submissionDate: {type: Date, default: Date.now, required: true},
    status: { 
        type: String, 
        enum: ['pending', 'finished'], 
        default: 'pending', 
        required: true 
    },
    hasSolution: {type: Boolean, default: false},
    solution: {type: String, default: ""},
    maxRouteDistance: {type: Number, default: 0, required: true },
    totalDistTravel: {type: Number, default: 0, required: true},
    executionDuration: {type: Number, default: 0, required: true}
});

module.exports = mongoose.model('Problem', DataSchema);
*/
/*
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    locationFile: { type: String, required: true },
    pythonFile: { type: String, required: true }, // Add this line
    numVehicles: {type: Number, required: true},
    depot: {type: Number, required: true},
    maxDistance: {type: Number, required: true},
    submissionDate: {type: Date, default: Date.now, required: true},
    status: { 
        type: String, 
        enum: ['pending', 'finished'], 
        default: 'pending', 
        required: true 
    },
    hasSolution: {type: Boolean, default: false},
    solution: {type: String, default: ""},
    maxRouteDistance: {type: Number, default: 0, required: true },
    totalDistTravel: {type: Number, default: 0, required: true},
    executionDuration: {type: Number, default: 0, required: true}
});

module.exports = mongoose.model('Problem', DataSchema);
*/
/*
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    locationFile: { type: Object, required: true },  // Changed to Object
    pythonFile: { type: String, required: true },
    numVehicles: {type: Number, required: true},
    depot: {type: Number, required: true},
    maxDistance: {type: Number, required: true},
    submissionDate: {type: Date, default: Date.now, required: true},
    status: { 
        type: String, 
        enum: ['pending', 'finished'], 
        default: 'pending', 
        required: true 
    },
    hasSolution: {type: Boolean, default: false},
    solution: {type: String, default: ""},
    maxRouteDistance: {type: Number, default: 0, required: true },
    totalDistTravel: {type: Number, default: 0, required: true},
    executionDuration: {type: Number, default: 0, required: true}
});

module.exports = mongoose.model('Problem', DataSchema);*/
const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    locationFile: { type: mongoose.Schema.Types.Mixed, required: true },
    pythonFile: { type: String, required: true },
    numVehicles: {type: Number, required: true},
    depot: {type: Number, required: true},
    maxDistance: {type: Number, required: true},
    submissionDate: {type: Date, default: Date.now, required: true},
    status: { 
        type: String, 
        enum: ['pending', 'finished'], 
        default: 'pending', 
        required: true 
    },
    hasSolution: {type: Boolean, default: false},
    solution: {type: String, default: ""},
    maxRouteDistance: {type: Number, default: 0, required: true },
    totalDistTravel: {type: Number, default: 0, required: true},
    executionDuration: {type: Number, default: 0, required: true}
});

module.exports = mongoose.model('Problem', DataSchema);