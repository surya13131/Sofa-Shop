// src/components/CustomerList.jsx

import React, { useState } from 'react';

export default function CustomerList({ customers, setCustomers, orders, setOrders, customerNameRef }) {
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingEmail, setEditingEmail] = useState(null);

  const handleCustomerChange = (field, value) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetCustomerForm = () => {
    setCustomerForm({ name: '', email: '', phone: '', address: '' });
    setEditingEmail(null);
  };

  const saveCustomer = () => {
    if (!customerForm.name || !customerForm.email) {
      alert('Name and Email are required.');
      return;
    }

    if (editingEmail) {
      const updated = customers.map((cust) =>
        cust.email === editingEmail ? customerForm : cust
      );
      setCustomers(updated);
    } else {
      if (customers.some((cust) => cust.email === customerForm.email)) {
        alert('Customer with this email already exists.');
        return;
      }
      setCustomers([...customers, customerForm]);
    }

    resetCustomerForm();
  };

  const editCustomer = (cust) => {
    setCustomerForm(cust);
    setEditingEmail(cust.email);
    setTimeout(() => customerNameRef?.current?.focus(), 0);
  };

  const deleteCustomer = (email) => {
    if (orders.some((order) => order.user.email === email)) {
      alert('Cannot delete customer with existing orders.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter((c) => c.email !== email));
    }
  };

  const exportToCSV = () => {
    if (!customers.length) return;

    const headers = Object.keys(customers[0]);
    const csv = [
      headers.join(','),
      ...customers.map((cust) =>
        headers.map((h) => `"${(cust[h] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div>
      <h3 className="mb-4">Customer Management</h3>

      {/* Customer Form */}
      <form onSubmit={(e) => { e.preventDefault(); saveCustomer(); }}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name</label>
            <input
              ref={customerNameRef}
              className="form-control"
              value={customerForm.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              value={customerForm.email}
              onChange={(e) => handleCustomerChange('email', e.target.value)}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Phone</label>
            <input
              className="form-control"
              value={customerForm.phone}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Address</label>
            <input
              className="form-control"
              value={customerForm.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {editingEmail ? 'Update Customer' : 'Add Customer'}
        </button>
        {editingEmail && (
          <button type="button" className="btn btn-secondary ms-2" onClick={resetCustomerForm}>
            Cancel
          </button>
        )}
      </form>

      {/* Customer Table */}
      <div className="table-responsive mt-4">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th style={{ minWidth: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted">No customers found</td></tr>
            ) : (
              customers.map((cust, idx) => (
                <tr key={cust.email + idx}>
                  <td>{cust.name}</td>
                  <td>{cust.email}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.address}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editCustomer(cust)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteCustomer(cust.email)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="btn btn-success mt-3" onClick={exportToCSV}>
        Export Customers to CSV
      </button>
    </div>
  );
}
