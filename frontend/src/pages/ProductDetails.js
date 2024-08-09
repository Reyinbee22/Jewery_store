import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import Logo from '../assets/Logo_icon.png.JPG';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const token = localStorage.getItem('token');
  const apiBaseUrl = process.env.REACT_APP_API_URL;

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
    try {
      const quantity = 1;
      const productId = product._id;

      await axios.post(`${apiBaseUrl}/cart/add`, { productId, quantity }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-detail bg-slate-700 min-h-screen p-8">
      <img src={Logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain absolute top-0 right-0 m-4" />
      {product ? (
        <div className="bg-blue-100 p-8 rounded shadow-md">
          <h1 className="text-3xl mb-4 text-slate-700">{product.name}</h1>
          <img src={product.image} alt={product.name} className="mb-4 w-[300px]" />
          <p className="text-slate-700">{product.description}</p>
          <p className="text-slate-700">${product.price}</p>
          <Button type="primary" className="bg-slate-700 text-blue-100 border-none hover:bg-slate-600" onClick={handleAddToCart}>
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
