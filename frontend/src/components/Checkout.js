import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button, Form, Input, Checkbox } from 'antd';
import Logo from '../assets/Logo_icon.png.JPG';

const CartItem = ({ item }) => {
  return (
    <li className="flex py-6">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-300">
        <img
          alt={item.productId.name}
          src={item.productId.image || ''} 
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-slate-900">
            <h3>{item.productId.name}</h3>
            <p className="ml-4">${item.productId.price * item.quantity}</p>
          </div>
          <p className="mt-1 text-sm text-slate-500">Qty {item.quantity}</p>
        </div>
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

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId || !token) {
          alert('You must be logged in to view your cart.');
          return;
        }

        const { data } = await axios.get('http://localhost:5000/api/cart', {
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
        'http://localhost:5000/api/cart/checkout',
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
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page bg-slate-700 min-h-screen p-4 sm:p-8 relative">
      <img 
        src={Logo} 
        alt="Logo" 
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain absolute top-0 right-0 m-2 sm:m-4" 
      />
     
      {/* Display Cart Items */}
      <div className="cart-items mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl text-blue-100 font-bold tracking-wide">Your Cart Items</h2>
        <div className="mt-4">
          <ul role="list" className="-my-6 divide-y divide-slate-300">
            {cart.map(item => (
              <CartItem key={item.productId._id} item={item} />
            ))}
          </ul>
        </div>
        <div className="total-amount text-xl sm:text-2xl text-blue-100 font-bold text-right mt-4 mb-8">
          Total: ${total.toFixed(2)}
        </div>
      </div>
      {/* Checkout Form */}
      <Form layout="vertical" onFinish={handleCheckout} className="bg-white p-6 rounded-lg shadow-lg">
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
        <div className="flex justify-end mt-4">
          <Button 
            type="primary" 
            className="bg-blue-100 border-none text-slate-700 font-bold hover:bg-blue-200" 
            htmlType="submit"
            loading={loading}
          >
            Pay ${total.toFixed(2)}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Checkout;
