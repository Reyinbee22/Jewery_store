/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, List, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCart = async () => {
      try {
        await axios
        .get(`http://localhost:5000/api/cart/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          console.log(response.data.products);
          setCart(response.data.products);
        });
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, [token]);

  return (
    <div className="cart">
      <h1>Your Cart</h1>
      <List
        itemLayout="horizontal"
        dataSource={cart}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.productId.name}
              description={`Quantity: ${item.quantity} - Price: $${item.productId.price * item.quantity} `}
            />
          </List.Item>
        )}
      />
      <Button type="primary" className="btn-primary">Checkout</Button>
    </div>
  );
};

export default Cart;
