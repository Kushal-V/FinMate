// ./backend/controllers/receiptControllers.js

const Receipt = require('../models/receipt.js');

// POST /api/receipts - Create a new receipt
const createReceipt = async (req, res) => {
    try {
        const { imageUrl, extractedText, amount, vendor, date } = req.body;

        const newReceipt = new Receipt({
            user: req.user._id, // consistent usage of _id
            imageUrl,
            extractedText,
            amount,
            vendor,
            date
        });

        const savedReceipt = await newReceipt.save();
        res.status(201).json(savedReceipt);
    } catch (error) {
        res.status(500).json({ message: "Failed to save receipt", error: error.message });
    }
};

// GET /api/receipts - Get all receipts for the logged-in user
const getReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch receipts", error: error.message });
    }
};

// GET /api/receipts/myreceipts - Just an alias route for clarity
const getUserReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user receipts', error: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const receipts = await Receipt.find({ user: userId });

        let totalSpend = 0;
        const vendorSpend = {};
        const categorySpend = {};

        const categoryKeywords = {
            food: ['pizza', 'burger', 'sandwich', 'domino', 'zomato', 'swiggy', 'restaurant'],
            groceries: ['milk', 'rice', 'dal', 'vegetable', 'fruit', 'bigbasket', 'grofers'],
            electronics: ['laptop', 'mobile', 'charger', 'headphones', 'electronics'],
            clothing: ['shirt', 'jeans', 't-shirt', 'trouser', 'myntra', 'flipkart', 'zara'],
            travel: ['uber', 'ola', 'bus', 'train', 'flight'],
            entertainment: ['movie', 'netflix', 'hotstar', 'bookmyshow']
        };

        for (let receipt of receipts) {
            const amount = receipt.amount || 0;
            const vendor = receipt.vendor || 'Unknown';
            const text = (receipt.extractedText || '').toLowerCase();

            totalSpend += amount;

            // Count vendor
            vendorSpend[vendor] = (vendorSpend[vendor] || 0) + amount;

            // Categorize based on keywords
            for (let [category, keywords] of Object.entries(categoryKeywords)) {
                if (keywords.some(keyword => text.includes(keyword))) {
                    categorySpend[category] = (categorySpend[category] || 0) + amount;
                    break; // Stop at first match
                }
            }
        }

        const averageSpend = receipts.length ? (totalSpend / receipts.length).toFixed(2) : 0;

        // Top 3 vendors by spend
        const topVendors = Object.entries(vendorSpend)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        res.json({
            totalSpend,
            averageSpend,
            topVendors,
            categorySpend
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to get dashboard stats', error: error.message });
    }
};


module.exports = {
    createReceipt,
    getReceipts,
    getUserReceipts,
    getDashboardStats
};
