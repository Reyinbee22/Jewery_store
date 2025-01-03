import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import Logo from '../assets/Edi_logo.png';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const token = localStorage.getItem('token');
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id, apiBaseUrl]);

  const handleAddToCart = async () => {
    if (!token) {
      setShowOverlay(true);
      return;
    }

    try {
      const quantity = 1;
      const productId = product._id;

      await axios.post(
        `${apiBaseUrl}/cart/add`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message on the product image
      setShowCartMessage(true);
      setTimeout(() => {
        setShowCartMessage(false); // Hide the message after 3 seconds
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error.response || error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="product-detail min-h-screen p-8 relative"
      style={{ backgroundColor: 'rgba(108, 122, 137, 0.8)' }}
    >
      {/* Back Button */}
      <Button
        icon={<LeftOutlined />}
        onClick={handleBack}
        type="link"
        className="absolute top-4 left-4 text-white text-xl font-bold bg-blue-600 rounded-full p-2 shadow-lg hover:bg-blue-700"
      >
        Back
      </Button>

      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="object-contain absolute top-4 right-4"
        style={{
          width: '100px',
          height: '100px',
        }}
      />

      {/* Product Details */}
      {product ? (
        <div className="bg-blue-100 bg-opacity-90 p-8 rounded shadow-md mt-16 relative">
          <h1 className="text-3xl mb-4 text-slate-700">{product.name}</h1>
          <div className="relative w-[300px] mx-auto">
            {/* Product image */}
            <img src={product.image} alt={product.name} className="mb-4 w-full" />

            {/* Cart success message */}
            {showCartMessage && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded"
                style={{ zIndex: 10 }}
              >
                <div className="bg-white rounded-md p-4 max-w-xs text-center shadow-lg">
                  <p className="text-green-600 font-bold">Product added to cart!</p>
                </div>
              </div>
            )}

            {/* Login overlay */}
            {showOverlay && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded"
                style={{ zIndex: 10 }}
              >
                <div className="bg-white rounded-md p-6 max-w-xs w-full text-center shadow-lg">
                  <p className="mb-4 text-black font-semibold">
                    You must be logged in to add items to the cart!
                  </p>
                  <Link to="/login">
                    <Button type="primary" className="w-full mb-3">
                      Login
                    </Button>
                  </Link>
                  <Button
                    type="link"
                    onClick={() => setShowOverlay(false)}
                    className="text-red-600 font-semibold"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
          <p className="text-slate-700">{product.description}</p>
          <p className="text-slate-700">₦{product.price}</p>
          <Button
            type="primary"
            className="bg-slate-700 text-blue-100 border-none hover:bg-slate-600"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      ) : (
        <p className="text-blue-100">Loading...</p>
      )}
    </div>
  );
};

export default ProductDetail;
