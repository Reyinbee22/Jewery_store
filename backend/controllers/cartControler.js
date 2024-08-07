// server/controllers/cartController.js
const Cart = require('../models/Cart');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    } else {
      cart = new Cart({ userId: req.user._id, products: [{ productId, quantity }] });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.products = [];
    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const checkout = async (req, res) => {
  const { address, paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Perform the necessary actions for checkout (e.g., save order to database, process payment)

    // Clear the cart after successful checkout
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Checkout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const removeItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;  // Get quantity from request body

  if (!quantity) {
    return res.status(400).json({ error: "Quantity is required" });
  }

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    // Reduce quantity
    cart.products[productIndex].quantity -= quantity;

    // Remove product if quantity is zero or less
    if (cart.products[productIndex].quantity <= 0) {
      cart.products.splice(productIndex, 1);
    }

    await cart.save();

    // Return the updated cart after removal
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ error: "Unable to remove Item" });
  }
};


module.exports = { getCart, addToCart, clearCart, checkout, removeItem };
