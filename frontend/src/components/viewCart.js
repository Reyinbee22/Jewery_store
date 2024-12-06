import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button } from 'antd';
import Logo from '../assets/Logo_icon.png.JPG';

const ViewCart = () => {
  const [cart, setCart] = useState([]);
  const userId = localStorage.getItem('userId'); 
  const token = localStorage.getItem('token'); 

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
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [userId, token]);

  const handleCheckout = () => {
    // Handle checkout logic
    alert('Checkout functionality to be implemented.');
  };

  return (
    <div className="view-cart bg-slate-700 min-h-screen p-4 sm:p-8 relative">
      <img 
        src={Logo} 
        alt="Logo" 
        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain absolute top-0 right-0 m-2 sm:m-4" 
      />
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl text-blue-100 font-bold tracking-wide uppercase">
          <span className="bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
            Your Cart
          </span>
        </h1>
        <div className="w-24 h-1 bg-blue-100 mx-auto mt-2 rounded"></div>
      </div>
      <List
        itemLayout="vertical"
        dataSource={cart}
        renderItem={item => (
          <List.Item className="bg-slate-800 p-2 sm:p-4 rounded-lg shadow-lg mb-2 sm:mb-4">
            <List.Item.Meta
              title={<span className="text-base sm:text-lg font-semibold text-blue-100">{item.productId.name}</span>}
              description={
                <div className="text-xs sm:text-sm text-slate-300">
                  <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                  <p>Price: <span className="font-medium">₦{item.productId.price}</span></p>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div className="flex justify-end mt-4">
        <Button 
          type="primary" 
          className="bg-blue-100 border-none text-slate-700 font-bold hover:bg-blue-200" 
          onClick={handleCheckout}
        >
          <a
            href="/checkout"
            className="ml-1 font-semibold leading-6 text-slate-700 hover:text-slate-500"
          >
            Checkout
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ViewCart;
