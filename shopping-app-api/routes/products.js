const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch distinct categories
router.get('/categories', authMiddleware, async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a product
router.post('/', authMiddleware, async (req, res) => {
  const { id, title, price, description, image, category, stockCount } = req.body;
  try {
    const product = new Product({ id, title, price, description, image, category, stockCount });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a product
router.put('/:id', authMiddleware, async (req, res) => {
  console.log(req.body);
  const { title, price, description, image, category, stockCount } = req.body;
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const result = await Product.findOneAndUpdate({ id: req.params.id }, {title, price, description, image, category, stockCount})
    res.json(await Product.findOne({ id: req.params.id }));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a product
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await Product.deleteOne({ id: req.params.id });
    res.json({ message: 'Product removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
