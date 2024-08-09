const express = require('express');
const router = express.Router();
const { getOrderHistory } = require('../controllers/OrderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history', protect, getOrderHistory);

module.exports = router;