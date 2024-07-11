import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, message } from "antd";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/users/login", values);

      localStorage.setItem("token", values.token);
      localStorage.setItem("userId", values.userId);
      message.success("Login successful");

      navigate("/products");
    } catch (error) {
      message.error("Login failed");
    }
  };

  return (
    <div className="login-page bg-teal-500 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <Form onFinish={handleLogin} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
