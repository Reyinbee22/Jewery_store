import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import Logo from '../assets/Edi_logo.png';

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
    <div className="login-page bg-slate-700 min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded shadow-md w-full max-w-md text-slate-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl mb-4 text-blue-300 text-center">Login</h1>

        {/* Login Form */}
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label={<span className="text-blue-200">Email</span>}
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              className="border-slate-500 text-slate-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span className="text-blue-200">Password</span>}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="border-slate-500 text-slate-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-400 text-slate-800 border-none hover:bg-blue-500"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-blue-300">
            Don't have an account?
            <Link to="/register" className="text-blue-400 underline ml-1">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Login;
