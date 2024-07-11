const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const {name, description, price, category } = req.body;
  try {
    const product = new Product({name, description, price, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "failed to add products, try again"});
  }
};

module.exports = { getAllProducts, createProduct };
