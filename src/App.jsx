import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Component/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LoginRegister from './Component/Login';
import Cart from './Component/Cart';
import AdminPage from './Component/AdminPage';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
  <Route path="/login" element={<LoginRegister />} />
  <Route path="/cart" element={<Cart/>} /> {/* ✅ Cart Route */}
<Route path="/Adminpage" element={<AdminPage />} />

      </Routes>
    </Router>
  );
}

export default App;
