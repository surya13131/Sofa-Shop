// src/components/AdminPage.jsx

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

  const orderNameRef = useRef(null);
  const customerNameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dummyOrders = [
      {
        id: 1,
        user: { name: 'Alice', email: 'alice@example.com', phone: '1234567890', address: 'Chennai' },
        items: [
          { name: 'Amber Sofa', price: 48999 },
          { name: 'Velvet Loveseat', price: 52000 },
        ],
        total: 100999,
        location: 'Chennai',
        date: '2025-08-01',
      },
      {
        id: 2,
        user: { name: 'Bob', email: 'bob@example.com', phone: '9876543210', address: 'Bangalore' },
        items: [{ name: 'Leather Sofa', price: 75000 }],
        total: 75000,
        location: 'Bangalore',
        date: '2025-08-02',
      },
    ];

    const dummyCustomers = [
      { name: 'Alice', email: 'alice@example.com', phone: '1234567890', address: 'Chennai' },
      { name: 'Bob', email: 'bob@example.com', phone: '9876543210', address: 'Bangalore' },
      { name: 'Carol', email: 'carol@example.com', phone: '5555555555', address: 'Delhi' },
    ];

    setOrders(dummyOrders);
    setCustomers(dummyCustomers);
  }, []);

  const handleLogout = () => {
    navigate('/'); // Redirect to Home
  };

  return (
    <Container fluid className="admin-container">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="sidebar shadow-sm">
          <div className="sidebar-header">
            <h4 className="text-Dark"style={{fontFamily:"-moz-initial",fontWeight:"bolder"}}>Admin Panel</h4>
          </div>
          <Nav className="flex-column nav-links">
            <Nav.Link
              onClick={() => setActiveSection('products')}
              className={activeSection === 'products' ? 'active' : ''}
            >
              🛠️ Product Manager
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveSection('orders')}
              className={activeSection === 'orders' ? 'active' : ''}
            >
              📦 Order List
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveSection('customers')}
              className={activeSection === 'customers' ? 'active' : ''}
            >
              👥 Customer List
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="main-content px-4 py-3">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="outline-danger" onClick={handleLogout}>
              🔙 Logout
            </Button>
          </div>

          {activeSection === 'products' && (
            <ProductManager products={products} setProducts={setProducts} />
          )}
          {activeSection === 'orders' && (
            <OrderList
              orders={orders}
              setOrders={setOrders}
              customers={customers}
              orderNameRef={orderNameRef}
            />
          )}
          {activeSection === 'customers' && (
            <CustomerList
              customers={customers}
              setCustomers={setCustomers}
              orders={orders}
              setOrders={setOrders}
              customerNameRef={customerNameRef}
            />
          )}

      
        </Col>
      </Row>

      {/* Custom Styling */}
      <style jsx>{`
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
