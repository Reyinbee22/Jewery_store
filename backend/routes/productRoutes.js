const express = require('express');
const { getAllProducts, createProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const upload = require('../config/upload.js');


router.get('/', getAllProducts);
router.post('/create', upload.single('image'), createProduct);
router.delete('/delete/:productId', deleteProduct);

module.exports = router;
