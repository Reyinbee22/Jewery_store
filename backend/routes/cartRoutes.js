const express = require('express');
const { getCart, addToCart, clearCart,checkout,removeItem} = require('../controllers/cartControler');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/clear/:userId', protect, clearCart);
router.post('/checkout', protect, checkout);
router.delete('/:productId',protect, removeItem);


module.exports = router;
