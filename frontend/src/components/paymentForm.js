import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            console.log('Sending payment request with data:', { email, amount, fullName, phone });

            const response = await axios.post('http://localhost:5000/paystack/transaction', {
                email,
                amount: parseFloat(amount),
                name: fullName,
                phone,
            });

            const { authorization_url } = response.data;
            if (authorization_url) {
                console.log('Redirecting to Paystack payment page:', authorization_url);
                window.location.href = authorization_url; 
            } else {
                alert('Failed to retrieve authorization URL. Please try again.');
            }
        } catch (error) {
            console.error('Error initiating payment:', error.response ? error.response.data : error.message);
            alert('Payment initiation failed. Please try again.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Pay with Paystack</h2>
            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Phone:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Amount (NGN):</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Pay Now
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;
