import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message } from "antd";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    try {
      const credentials = {
        email,
        password,
      };
      await axios
        .post(`http://localhost:5000/api/users/login`, credentials)
        .then((response) => {
          
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          message.success("Login successful");

          navigate("/products");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='login-page bg-teal-500 min-h-screen flex items-center justify-center'>
      <div className='bg-white p-8 rounded shadow-md w-full max-w-md'>
        <h1 className='text-2xl mb-4'>Login</h1>
        <Form onFinish={handleLogin} layout='vertical'>
          <Form.Item
            name='email'
            label='Email'
            rules={[{ required: true, message: "Please input your email!" }]}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={[{ required: true, message: "Please input your password!" }]}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
