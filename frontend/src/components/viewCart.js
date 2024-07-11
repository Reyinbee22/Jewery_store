import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Button } from 'antd';

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

        const { data } = await axios.get('http://localhost:5000/api/cart', {
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
    <div className="view-cart bg-yellow-400 min-h-screen p-8">
      <h1 className="text-3xl mb-4">Your Cart</h1>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.productId.name}
              description={`Quantity: ${item.quantity} - Price: $${item.productId.price}`}
            />
          </List.Item>
        )}
      />
      <Button type="primary" className="mt-4" onClick={handleCheckout}>
        Checkout
      </Button>
    </div>
  );
};

export default ViewCart;
