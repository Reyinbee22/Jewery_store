import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo_icon.png.JPG';
import { usePaystackPayment } from 'react-paystack';

const CartItem = ({ item }) => (
    <li className="flex py-4 border-b border-slate-300">
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-300">
            <img
                alt={item.productId.name}
                src={item.productId.image || ''}
                className="h-full w-full object-cover object-center"
            />
        </div>
        <div className="ml-6 flex flex-1 flex-col">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-slate-900">{item.productId.name}</h3>
                <p className="text-lg font-semibold text-slate-900">₦{(item.productId.price * item.quantity).toFixed(2)}</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">Quantity: {item.quantity}</p>
        </div>
    </li>
);

const Checkout = () => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId || !token) {
                alert('You must be logged in to view your cart.');
                return;
            }

            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (data && data.products) {
                    setCart(data.products);
                    const totalAmount = data.products.reduce(
                        (acc, item) => acc + item.productId.price * item.quantity,
                        0
                    );
                    setTotal(totalAmount);
                } else {
                    console.error('Cart data is invalid:', data);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
                alert('Failed to fetch cart data. Please try again later.');
            }
        };

        fetchCart();
    }, [userId, token]);

    const navigateToPaymentForm = () => {
        navigate('/payment-form', { 
            state: { 
                total: total + 25 + 47.6, 
                cart: cart 
            } 
        }); 
    };

    const config = {
        reference: new Date().getTime().toString(),
        email: localStorage.getItem('email'),
        amount: (total + 25 + 47.6) * 100,
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    };

    const onSuccess = async (reference) => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/cart/checkout`, {
                paymentReference: reference.reference,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Payment successful!');
            navigate('/order-history');
        } catch (error) {
            console.error('Error during checkout:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const onClose = () => {
        alert('Payment closed!');
    };

    const initializePayment = usePaystackPayment(config);

    return (
        <div className="checkout-page bg-gray-50 min-h-screen p-6 sm:p-12 lg:p-16 flex flex-col lg:flex-row">
            {/* Left Section - Form */}
            <div className="w-full lg:w-7/12 bg-white p-6 sm:p-10 rounded-lg shadow-lg lg:mr-6">
                <div className="flex justify-center mb-8">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                    />
                </div>
                <Form
                    layout="vertical"
                    onFinish={() => initializePayment(onSuccess, onClose)}
                >
                    <div className="flex justify-center mt-6">
                        <Button
                            type="primary"
                            className="bg-blue-500 border-none text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                            htmlType="submit"
                            disabled={!cart.length}
                            onClick={navigateToPaymentForm}
                        >
                            Pay ₦{(total + 25 + 47.6).toFixed(2)}
                        </Button>
                    </div>
                </Form>
            </div>

            {/* Right Section - Order Summary */}
            <div className="w-full lg:w-5/12 bg-blue-700 text-white p-6 sm:p-10 rounded-lg shadow-lg mt-8 lg:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-8">Order Summary</h2>
                {cart.length > 0 ? (
                    <ul role="list" className="space-y-4">
                        {cart.map((item) => (
                            <CartItem key={item.productId._id} item={item} />
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">Your cart is empty.</p>
                )}
                <div className="grand-total text-2xl sm:text-3xl font-bold mt-8 text-right">
                    Total: ₦{(total + 25 + 47.6).toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default Checkout;