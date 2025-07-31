// backend/routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transactions');

// ✅ GET all transactions for a user
router.get('/:userId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(transactions); 
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST a new transaction (use type = 'expense' or 'income')
router.post('/', async (req, res) => {
  try {
    const { name, amount, category = 'Others', date, userId, type = 'expense' } = req.body;

    // Validate required fields
    if (!name || !amount || !userId || !date) {
      return res.status(400).json({ error: 'Missing name, amount, date, or userId' });
    }

    const newTransaction = new Transaction({
      name,
      amount: parseFloat(amount),
      category,
      date: new Date(date),
      userId,
      type,
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: 'Server error while adding transaction' });
  }
});

// ✅ DELETE a transaction by ID
router.delete('/:id', async (req, res) => {
  console.log('🧨 Received DELETE request for ID:', req.params.id);

  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    console.log('🔍 Mongo delete result:', deleted);

    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('🔥 Server error while deleting:', err);
    res.status(500).json({ error: 'Server error while deleting' });
  }
});

module.exports = router;
