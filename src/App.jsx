import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './Component/Home';
import LoginRegister from './Component/Login';
import Cart from './Component/Cart';
import AdminPage from './Component/Admin/AdminPage'; // keep as AdminPage
import ProductManager from './Component/Admin/ProductManager';
import OrderList from './Component/Admin/OrderList';
import CustomerList from './Component/Admin/CustomerList';
import AdminLogin from './Component/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin layout with nested routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Navigate to="products" />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="customers" element={<CustomerList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
