const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/shoppingApp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
