const express = require('express');
const router = express.Router();

// Import the protect middleware for authentication
const { protect } = require('../middleware/authMiddleware'); // Ensure braces around protect

// Import the controller functions for receipts
const { 
    createReceipt, 
    getReceipts, 
    getUserReceipts, 
    getDashboardStats 
} = require('../controllers/receiptControllers'); // ✅ Import first

// Route to get all user receipts - only authenticated users can access this
router.get('/myreceipts', protect, getUserReceipts);

// Route to get dashboard stats (e.g., total spend, category stats, etc.) - requires authentication
router.get('/dashboard', protect, getDashboardStats);

// Route to create a new receipt - requires authentication
// Route to get all receipts - requires authentication
router.route('/')
    .post(protect, createReceipt)  // Create a receipt
    .get(protect, getReceipts);    // Get all receipts

module.exports = router;
