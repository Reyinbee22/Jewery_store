import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button, Form, Input, Checkbox } from 'antd';
import Logo from '../assets/Logo_icon.png.JPG';
import { useNavigate } from 'react-router-dom';

const CartItem = ({ item }) => {
  return (
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
          <p className="text-lg font-semibold text-slate-900">${item.productId.price * item.quantity}</p>
        </div>
        <p className="mt-2 text-sm text-slate-500">Quantity: {item.quantity}</p>
      </div>
    </li>
  );
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId || !token) {
          alert('You must be logged in to view your cart.');
          return;
        }

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCart(data.products);
        const totalAmount = data.products.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);
        setTotal(totalAmount);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId, token]);

  const handleCheckout = async (values) => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/cart/checkout`,
        {
          address: values.address,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          email: values.email,
          nameOnCard: values.nameOnCard,
          cardNumber: values.cardNumber,
          expirationDate: values.expirationDate,
          cvc: values.cvc,
          billingAddressSameAsShipping: values.billingAddressSameAsShipping,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Checkout successful!');
      navigate('/order-history');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <Form layout="vertical" onFinish={handleCheckout}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, message: 'Please input your email address!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="Name on Card"
            name="nameOnCard"
            rules={[{ required: true, message: 'Please input the name on the card!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: 'Please input your card number!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="Expiration Date (MM/YY)"
            name="expirationDate"
            rules={[{ required: true, message: 'Please input the expiration date!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="CVC"
            name="cvc"
            rules={[{ required: true, message: 'Please input your CVC!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="Shipping Address"
            name="address"
            rules={[{ required: true, message: 'Please input your shipping address!' }]}
          >
            <Input.TextArea rows={4} className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please input your city!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="State / Province"
            name="state"
            rules={[{ required: true, message: 'Please input your state or province!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item
            label="Postal Code"
            name="postalCode"
            rules={[{ required: true, message: 'Please input your postal code!' }]}
          >
            <Input className="border-slate-400" />
          </Form.Item>
          <Form.Item name="billingAddressSameAsShipping" valuePropName="checked">
            <Checkbox className="text-slate-700">Billing address is the same as shipping address</Checkbox>
          </Form.Item>
          <div className="flex justify-center mt-6">
            <Button 
              type="primary" 
              className="bg-blue-500 border-none text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600" 
              htmlType="submit"
              loading={loading}
            >
              Pay ${total.toFixed(2)}
            </Button>
          </div>
        </Form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="w-full lg:w-5/12 bg-blue-700 text-white p-6 sm:p-10 rounded-lg shadow-lg mt-8 lg:mt-0">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Order Summary</h2>
        <ul role="list" className="space-y-4">
          {cart.map(item => (
            <CartItem key={item.productId._id} item={item} />
          ))}
        </ul>
        <div className="total-amount text-xl sm:text-2xl font-bold mt-8 text-right">
          Subtotal: ${total.toFixed(2)}
        </div>
        <div className="shipping text-xl sm:text-2xl font-bold mt-2 text-right">
          Shipping: $25.00
        </div>
        <div className="taxes text-xl sm:text-2xl font-bold mt-2 text-right">
          Taxes: $47.60
        </div>
        <div className="grand-total text-2xl sm:text-3xl font-bold mt-8 text-right">
          Total: ${(total + 25 + 47.60).toFixed(2)}
        </div>
        <div className="flex justify-center mt-6">
          <Button 
            type="default" 
            className="bg-gray-500 border-none text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600" 
            onClick={() => navigate('/history')}
          >
            View Order History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
