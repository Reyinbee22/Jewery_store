import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentForm = () => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [cartTotal, setCartTotal] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state && location.state.total) {
            const total = location.state.total;
            setAmount(total.toFixed(2));
            setCartTotal(total);
        } else {
            navigate('/checkout');
        }
    }, [location.state, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/paystack/transaction', {
                email,
                amount: parseFloat(amount),
                name: fullName,
                phone,
            });

            const { authorization_url } = response.data;
            if (authorization_url) {
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
            
            {/* Display Total Amount */}
            <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-4 text-center">
                <p className="text-lg font-bold">Total Amount to Pay</p>
                <p className="text-2xl">₦{cartTotal.toFixed(2)}</p>
            </div>

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
                        readOnly
                        className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
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