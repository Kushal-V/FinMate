// backend/models/Transactions.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'Others'
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['income', 'expense'], // ✅
    default: 'expense'
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
