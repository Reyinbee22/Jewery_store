const express = require('express');
const { getCart, addToCart } = require('../controllers/cartControler');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);

module.exports = router;
