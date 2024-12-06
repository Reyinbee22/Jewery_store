const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/OrderRoutes'); 
const paystackRoutes = require('./routes/paystackRoutes');
const axios = require('axios'); 


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
app.use('/api/order', orderRoutes); 
app.use('/api/paystack', paystackRoutes);


const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

app.post('/paystack/transaction', async (req, res) => {
    try {
        const { amount, email, name, phone } = req.body;

        console.log('Received payment request:', { amount, email, name, phone });

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Convert amount to kobo
                name,
                phone,
                currency: 'NGN',
                callback_url: 'https://jewery-ediblaire.vercel.app/', 
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { authorization_url, access_code, reference } = response.data.data;
        console.log('Transaction initialized successfully:', { authorization_url, reference });

        // Send the payment URL and other necessary details to the frontend
        res.json({ authorization_url, access_code, reference });
    } catch (error) {
        console.error('Error initializing transaction:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
