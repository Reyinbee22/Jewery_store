import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import Logo from '../assets/Logo_icon.png.JPG'

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/users/register', {
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
      <div className="bg-blue-50 p-8 rounded shadow-md w-full max-w-md">
        <img src={Logo} alt="Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" />
        <h1 className="text-2xl mb-4 text-blue-100">Register</h1>
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input className="border-slate-600" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input className="border-slate-600" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password className="border-slate-600" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-blue-100 text-slate-700 border-none hover:bg-blue-200">
              Signup
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
