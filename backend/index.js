const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`);
});
