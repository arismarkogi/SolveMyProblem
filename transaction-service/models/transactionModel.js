const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
    type: {type:String, required: true} 
});

module.exports = mongoose.model('Transaction', TransactionSchema);

