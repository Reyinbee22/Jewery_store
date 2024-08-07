import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo_icon.png.JPG';

const Home = () => {
  return (
    <div className="home bg-slate-700 min-h-screen flex flex-col items-center justify-center text-blue-100 text-center p-8">
      <img src={Logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain absolute top-0 right-0 m-4" />
      <h1 className="text-5xl mb-4">Welcome to E-Shop</h1>
      <p className="text-xl mb-6">Your one-stop shop for all Jeweries!</p>
      <div className="space-y-4">
        <Link to="/products">
          <button className="btn-primary bg-blue-100 text-slate-700 p-4 rounded">Shop Now</button>
        </Link>
        <Link to="/register">
          <button className="btn-primary bg-blue-100 text-slate-700 p-4 rounded">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="btn-primary bg-blue-100 text-slate-700 p-4 rounded">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
