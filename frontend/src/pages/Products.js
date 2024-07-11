import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button } from 'antd';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Navigate to the home page or login page
    navigate('/');
  };

  return (
    <div className="products bg-yellow-400 min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Our Products</h1>
        <Button 
          onClick={handleLogout} 
          type="primary" 
          danger 
          
        >
          Exit
        </Button>
      </div>
      <Row gutter={16}>
        {products.map(product => (
          <Col span={8} key={product._id}>
            <Card
              title={product.name}
              cover={<img alt={product.name} src={product.imageUrl} />}
              className="shadow-md"
            >
              <p>{product.description}</p>
              <p>${product.price}</p>
              <Link to={`/products/${product._id}`}>
                <Button type="primary" className="bg-teal-500 text-white p-2 rounded">View Details</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
