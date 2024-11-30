import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import Logo from '../assets/Edi_logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const apiBaseUrl = process.env.REACT_APP_API_URL;

  const handleFinish = async (values) => {
    try {
      await axios.post(`${apiBaseUrl}/users/register`, {
        username: values.name,
        email: values.email,
        password: values.password,
      });
      message.success('Registration successful');
      navigate('/login'); 
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      message.error('Registration failed');
    }
  };

  return (
    <div className="register-page bg-slate-700 min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="Logo"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl mb-4 text-blue-300 text-center">Sign Up</h1>

        {/* Signup Form */}
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="name"
            label={<span className="text-blue-200">Username</span>}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input className="border-slate-500" />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span className="text-blue-200">Email</span>}
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input className="border-slate-500" />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span className="text-blue-200">Password</span>}
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password className="border-slate-500" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-400 text-slate-800 border-none hover:bg-blue-500"
            >
              Signup
            </Button>
          </Form.Item>
        </Form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-blue-300">
            Already have an account?
            <Link to="/login" className="text-blue-400 underline ml-1">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
