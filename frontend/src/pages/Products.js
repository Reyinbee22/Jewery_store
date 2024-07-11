import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "antd";
import { BsCart4 } from "react-icons/bs";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    // Navigate to the home page or login page
    navigate("/");
  };

  return (
    <div className='products bg-yellow-400 min-h-screen p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl'>Our Products</h1>

        <NavLink to={`/cart/${userId}`}>
          <BsCart4 className='text-3xl hover:text-red-500 text-gray-700' />
        </NavLink>
        <Button onClick={handleLogout} type='primary' danger>
          LogOut
        </Button>
      </div>
      <Row gutter={16} className='flex'>
        {products.map((product) => (
          <Col span={6} key={product._id}>
            <Card
              title={product.name}
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  className='w-5  object-cover h-60'
                />
              }
              className='shadow-md mt-4'
            >
              <p>{product.description}</p>
              <p>${product.price}</p>
              <Link to={`/products/${product._id}`}>
                <Button
                  type='primary'
                  className='bg-teal-500 text-white p-2 rounded'
                >
                  View Details
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Products;
