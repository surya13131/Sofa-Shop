import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductManager from './ProductManager';
import OrderList from './OrderList';
import CustomerList from './CustomerList';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('products');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderNameRef = useRef(null);
  const customerNameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const prodRes = await fetch('http://localhost:8080/api/sofas');
      const prodData = await prodRes.json();
      setProducts(prodData);

      const orderRes = await fetch('http://localhost:8080/api/orders');
      const orderData = await orderRes.json();
      setOrders(orderData);

      const userRes = await fetch('http://localhost:8080/api/users');
      const userData = await userRes.json();
      setCustomers(userData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      alert('Failed to fetch admin data. Please check your backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="p-4">Loading admin data...</div>;
  }

  return (
    <Container fluid className="admin-container">
      <Row className="g-0">
        <Col md={3} lg={2} className="sidebar shadow-sm">
          <div className="sidebar-header">
            <h4 className="text-dark" style={{ fontFamily: 'initial', fontWeight: 'bolder' }}>
              Admin Panel
            </h4>
          </div>
          <Nav className="flex-column nav-links">
            <Nav.Link onClick={() => setActiveSection('products')} className={activeSection === 'products' ? 'active' : ''}>
              🛠️ Product Manager
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('orders')} className={activeSection === 'orders' ? 'active' : ''}>
              📦 Order List
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection('customers')} className={activeSection === 'customers' ? 'active' : ''}>
              👥 Customer List
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={9} lg={10} className="main-content px-4 py-3">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="outline-danger" onClick={handleLogout}>🔙 Logout</Button>
          </div>

          {activeSection === 'products' && (
            <ProductManager products={products} setProducts={setProducts} />
          )}
          {activeSection === 'orders' && (
            <OrderList orders={orders} setOrders={setOrders} customers={customers} orderNameRef={orderNameRef} />
          )}
          {activeSection === 'customers' && (
            <CustomerList customers={customers} setCustomers={setCustomers} orders={orders} setOrders={setOrders} customerNameRef={customerNameRef} />
          )}
        </Col>
      </Row>

      <style>{`
        .admin-container {
          width: 100vw;
          height: 100vh;
          padding: 0;
          margin: 0;
          background-color: #f8f9fa;
          overflow-x: hidden;
        }
        .sidebar {
          height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #b3e5fc, #e1f5fe);
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          transition: all 0.3s ease;
        }
        .sidebar-header {
          margin-bottom: 30px;
        }
        .nav-link {
          color: #0a355f;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 500;
          margin-bottom: 10px;
          transition: background 0.3s, color 0.3s;
        }
        .nav-link:hover {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }
        .nav-link.active {
          background-color: #0d6efd;
          color: white !important;
        }
        .main-content {
          height: 100vh;
          background-color: #ffffff;
          overflow-y: auto;
        }
        button.btn-outline-danger {
          border-radius: 10px;
        }
      `}</style>
    </Container>
  );
}
