import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home bg-teal-500 min-h-screen flex flex-col items-center justify-center text-white text-center p-8">
      <h1 className="text-5xl mb-4">Welcome to E-Shop</h1>
      <p className="text-xl mb-6">Your one-stop shop for all Jeweries!</p>
      <div className="space-y-4">
        <Link to="/products">
          <button className="btn-primary bg-yellow-400 text-black p-4 rounded">Shop Now</button>
        </Link>
        <Link to="/register">
          <button className="btn-primary bg-yellow-400 text-black p-4 rounded">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="btn-primary bg-yellow-400 text-black p-4 rounded">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
