import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Nav, Button, Spinner } from 'react-bootstrap';
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
    setLoading(true);
    try {
      const [prodRes, orderRes, userRes] = await Promise.all([
        fetch('http://localhost:8080/api/sofas'),
        fetch('http://localhost:8080/api/orders'),
        fetch('http://localhost:8080/api/users'),
      ]);

      const [prodData, orderData, userData] = await Promise.all([
        prodRes.json(),
        orderRes.json(),
        userRes.json(),
      ]);

      setProducts(prodData);
      setOrders(orderData);
      setCustomers(userData);
    } catch (err) {
      console.error('Admin Data Fetch Error:', err);
     
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Container fluid className="admin-page">
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={3} lg={2} className="sidebar d-flex flex-column align-items-start p-4 shadow-sm">
          <div className="mb-4 w-100 text-center">
            <h4 className="fw-bold" style={{ fontFamily: 'cursive', color: '#0a3d62' }}>
              🛠️ Admin Panel
            </h4>
          </div>
          <Nav className="flex-column w-100">
            <Nav.Link
              className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              🪑 Product Manager
            </Nav.Link>
            <Nav.Link
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              📦 Order List
            </Nav.Link>
            <Nav.Link
              className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveSection('customers')}
            >
              👥 Customer List
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={9} lg={10} className="main-content p-4">
          <div className="d-flex justify-content-end mb-3">
            <Button variant="outline-danger" onClick={handleLogout} className="rounded-3">
              🔙 Logout
            </Button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
              <Spinner animation="border" variant="primary" />
              <span className="ms-3 fs-5">Loading admin data...</span>
            </div>
          ) : (
            <div className="fade-in">
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
            </div>
          )}
        </Col>
      </Row>


      <style>{`
        .admin-page {
          width: 100vw;
          height: 100vh;
          background-color: #f5f7fa;
          overflow: hidden;
        }

        .sidebar {
          background: linear-gradient(to bottom right, #dff9fb, #c7ecee);
          height: 100vh;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
        }

        .nav-item {
          padding: 12px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #34495e;
          margin-bottom: 10px;
          border-radius: px;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background-color: rgba(33, 150, 243, 0.1);
          color: #218cfa;
        }

        .nav-item.active {
          background-color: #218cfa;
          color: white;
        }

        .main-content {
          height: 100vh;
          background-color: #ffffff;
          overflow-y: auto;
          border-top-left-radius: 25px;
          border-bottom-left-radius: 25px;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.05);
        }

        .fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            border-radius: 0;
            height: auto;
            padding: 1rem;
          }
          .main-content {
            border-radius: 0;
          }
        }
      `}</style>
    </Container>
  );
}
