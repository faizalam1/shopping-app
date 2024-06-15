const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create a new order
router.post('/', authMiddleware, async (req, res) => {
  const { products, totalAmount } = req.body;
  const userId = req.user.id;
  let productsArray = [];
  try {
    // Reduce stock count for each product
    for (const item of products) {
      const product = await Product.findOne({ id: item.productId });
      if (product.stockCount < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.title}` });
      }
      product.stockCount -= item.quantity;
      await product.save();
      productsArray.push({ productId: product._id, quantity: item.quantity });
    }

    const order = Order.create({ userId, totalAmount, products: productsArray})

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for a user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const orders = await Order.find({ userId }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
