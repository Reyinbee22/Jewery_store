import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // const userId = 'YOUR_USER_ID';
      const quantity = 1;

      await axios.post('http://localhost:5000/api/cart/add', { productId: product._id, quantity }, {
        headers: {
          Authorization: `Bearer YOUR_TOKEN`
        }
      });
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-detail bg-yellow-400 min-h-screen p-8">
      {product ? (
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-3xl mb-4">{product.name}</h1>
          <img src={product.imageUrl} alt={product.name} className="mb-4"/>
          <p>{product.description}</p>
          <p>${product.price}</p>
          <Button type="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetail;