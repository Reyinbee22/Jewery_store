const express = require('express');
const { getAllProducts, createProduct, getProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();
const upload = require('../config/upload.js');


router.get('/', getAllProducts);
router.get('/:productId', getProduct);
router.post('/create', upload.single('image'), createProduct);
router.delete('/delete/:productId', deleteProduct);

module.exports = router;
