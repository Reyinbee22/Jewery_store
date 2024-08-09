import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Typography, Image, Space } from 'antd';

const { Title, Text } = Typography;

const OrderItem = ({ item }) => (
  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
    <Space direction="vertical" align="center" style={{ width: '100%' }}>
      <Image
        src={item.productId.image}
        alt={item.productId.name}
        width={200}
        height={200}
        style={{ objectFit: 'cover' }}
      />
      <Text strong>{item.productId.name}</Text>
      <Text type={getStatusType(item.status)}>{getStatusText(item.status)}</Text>
    </Space>
  </Col>
);

const getStatusType = (status) => {
  switch (status) {
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    case 'out_for_delivery': return 'warning';
    default: return 'secondary';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'delivered': return `Delivered on ${new Date().toLocaleDateString()}`;
    case 'cancelled': return 'Cancelled';
    case 'out_for_delivery': return 'Out for delivery';
    default: return status;
  }
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/order-history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [token]);

  return (
    <div className="order-history" style={{ padding: '20px' }}>
      <Title level={2}>Order history</Title>
      <Text type="secondary" style={{ marginBottom: '20px', display: 'block' }}>
        Check the status of recent orders, manage returns, and discover similar products.
      </Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Row gutter={[16, 16]}>
          {orders.flatMap(order => 
            order.items.map(item => (
              <OrderItem key={item.productId._id} item={item} />
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default OrderHistory;