// backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));

const receiptRoutes = require('./routes/receiptRoutes');
app.use('/api/receipts', receiptRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// ✅ Add this: Transaction Route
const transactionRoutes = require('./routes/transactionRoutes'); // ✅ Make sure the path matches your file
app.use('/api/transactions', transactionRoutes); // Now available at: /api/transactions/:userId

// Start server
const PORT = process.env.PORT || 5000;
app.listen(5000, '0.0.0.0', () => console.log('Server running on port 5000'));
