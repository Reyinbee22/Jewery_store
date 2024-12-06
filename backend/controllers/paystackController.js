const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize Payment
exports.initializePayment = async (req, res) => {
    const { email, amount } = req.body;

    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: amount * 100, // Convert amount to kobo (smallest currency unit)
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        res.status(200).json({
            status: true,
            message: 'Payment initialization successful',
            data: response.data.data, // Contains the authorization URL and more
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Payment initialization failed',
            error: error.response ? error.response.data : error.message,
        });
    }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
    const { reference } = req.params;

    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.data.status === 'success') {
            res.status(200).json({
                status: true,
                message: 'Payment verified successfully',
                data: response.data.data,
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Payment verification failed',
                data: response.data.data,
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Payment verification failed',
            error: error.response ? error.response.data : error.message,
        });
    }
};
