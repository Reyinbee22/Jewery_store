import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, List, Typography } from 'antd';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Replace with your user ID
        const userId = 'YOUR_USER_ID';

        const { data } = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer YOUR_TOKEN`
          }
        });
        setCart(data.products);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

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
              description={`Quantity: ${item.quantity} - Price: $${item.productId.price}`}
            />
          </List.Item>
        )}
      />
      <Button type="primary" className="btn-primary">Checkout</Button>
    </div>
  );
};

export default Cart;
