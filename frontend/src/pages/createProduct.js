import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, notification } from 'antd';

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products/create', product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notification.success({ message: 'Product created successfully!' });
    } catch (error) {
      console.error('Error creating product:', error);
      notification.error({ message: 'Error creating product', description: error.message });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="create-product-form">
      <Form.Item label="Name" required>
        <Input name="name" value={product.name} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Description" required>
        <Input name="description" value={product.description} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Price" required>
        <Input name="price" type="number" value={product.price} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Category" required>
        <Input name="category" value={product.category} onChange={handleChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProduct;
