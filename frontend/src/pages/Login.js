import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import Logo from '../assets/Logo_icon.png.JPG';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (event) => {
    try {
      const credentials = {
        email,
        password,
      };
      await axios
        .post(`${apiBaseUrl}/users/login`, credentials)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          message.success("Login successful");

          navigate("/products");
        });
    } catch (error) {
      console.log(error);
      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className='login-page bg-slate-700 min-h-screen flex items-center justify-center'>
      <div className='bg-blue-100 p-8 rounded shadow-md w-full max-w-md text-slate-700'>
        <img src={Logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"/>
        <h1 className='text-2xl mb-4  text-blue-600'>Login</h1>
        <Form onFinish={handleLogin} layout='vertical'>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input 
              className="text-slate-700" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password 
              className="text-slate-700" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='bg-slate-700 text-blue-100 w-full'>
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-slate-700">
            Don't have an account? 
            <Link to="/register" className="text-blue-600 underline ml-1">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
