import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button } from "antd";
import { BsCart4 } from "react-icons/bs";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/products`);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [apiBaseUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="products bg-slate-700 min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="overflow-hidden whitespace-nowrap bg-blue-900 p-4 rounded-lg shadow-lg w-full">
          <h1 className="text-xl md:text-3xl text-blue-100 animate-scroll-left">
            Welcome Back to your best online store for all kinds of Jeweries!... Free delivery within the State!!!!
          </h1>
        </div>
        <div className="flex mt-4 md:mt-0">
          <NavLink to={`/cart/${userId}`}>
            <BsCart4 className="text-2xl md:text-3xl hover:text-blue-200 text-blue-100 mr-4" />
          </NavLink>
          <Button onClick={handleLogout} type="primary" danger className="bg-blue-100 text-slate-700">
            LogOut
          </Button>
        </div>
      </div>
      <h2 className="text-xl md:text-2xl text-blue-100 mb-4">Jeweries Available</h2>
      <Row gutter={16} className="flex flex-wrap">
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              title={product.name}
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  className="w-full object-cover h-60"
                />
              }
              className="shadow-md mt-4 bg-blue-50"
            >
              <p className="text-slate-700">{product.description}</p>
              <p className="text-slate-700">${product.price}</p>
              <Link to={`/products/${product._id}`}>
                <Button
                  type="primary"
                  className="bg-blue-100 text-slate-700 border-none hover:bg-blue-200"
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
