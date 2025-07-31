const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    extractedText: {
        type: String
    },
    amount: {
        type: Number
    },
    vendor: {
        type: String
    },
    date: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Receipt', receiptSchema);