import React from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({ onLogout }) => {
  const menuItems = [
    { key: "home", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    {
      key: "products",
      icon: <ShopOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart">Cart</Link>,
    },
    {
      key: "orders",
      icon: <ShopOutlined />,
      label: <Link to="/orders">Orders</Link>,
    },
    {
      key: "login",
      icon: <UserOutlined />,
      label: <Link to="/login">Login</Link>,
    },
    {
      key: "register",
      icon: <UserOutlined />,
      label: <Link to="/register">Register</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span onClick={onLogout}>Logout</span>,
    },
  ];

  return (
    <Header className="header">
      <div className="logo">
        <Link to="/">E-Shop</Link>
      </div>
      <Menu theme="dark" mode="horizontal" items={menuItems} />
    </Header>
  );
};

export default Navbar;
