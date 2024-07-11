const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/create', createProduct);

module.exports = router;
