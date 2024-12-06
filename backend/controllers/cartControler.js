// server/controllers/cartController.js
const Cart = require('../models/Cart');
const axios = require('axios');


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
  const { paymentReference } = req.body;
  const userId = req.user._id;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Verify payment with Paystack
    const paymentVerificationUrl = `https://api.paystack.co/transaction/verify/${paymentReference}`;
    const response = await axios.get(paymentVerificationUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.data.status !== 'success') {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Create an order record
    const orderDetails = {
      userId,
      products: cart.products,
      totalAmount: cart.products.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
      ),
      status: 'Pending',
      paymentReference,
    };
    const order = new Order(orderDetails);
    await order.save();

    // Clear the cart
    cart.products = [];
    await cart.save();

    // Send an email with the payment link (customize as needed)
    const paymentLink = `https://example.com/payment/${paymentReference}`;
    await sendPaymentLink(req.user.email, paymentLink);

    res.status(200).json({ message: "Checkout successful", order });
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
