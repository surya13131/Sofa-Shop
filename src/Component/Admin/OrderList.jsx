// src/components/OrderList.jsx

import React, { useState } from 'react';


export default function OrderList({ orders, setOrders, customers, orderNameRef }) {
  const [filters, setFilters] = useState({ name: '', minPrice: '', location: '' });

  const [orderForm, setOrderForm] = useState({
    id: null,
    user: { name: '', email: '', phone: '', address: '' },
    items: [{ name: '', price: '' }],
    total: 0,
    location: '',
    date: '',
  });
  const [editingOrderId, setEditingOrderId] = useState(null);

  const handleOrderInputChange = (field, value) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOrderUserChange = (field, value) => {
    setOrderForm((prev) => ({
      ...prev,
      user: { ...prev.user, [field]: value },
    }));
  };

  const handleOrderItemChange = (index, field, value) => {
    const newItems = [...orderForm.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'price' ? Number(value) : value,
    };
    setOrderForm((prev) => ({ ...prev, items: newItems }));
  };

  const addOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', price: '' }],
    }));
  };

  const removeOrderItem = (index) => {
    if (orderForm.items.length === 1) return;
    const newItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () => {
    return orderForm.items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  };

  const resetOrderForm = () => {
    setOrderForm({
      id: null,
      user: { name: '', email: '', phone: '', address: '' },
      items: [{ name: '', price: '' }],
      total: 0,
      location: '',
      date: '',
    });
    setEditingOrderId(null);
  };

  const saveOrder = () => {
    if (
      !orderForm.user.name ||
      !orderForm.user.email ||
      !orderForm.location ||
      !orderForm.date ||
      orderForm.items.some((item) => !item.name || !item.price)
    ) {
      alert('Please complete all required fields.');
      return;
    }

    const total = calculateTotal();

    if (editingOrderId) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrderId ? { ...orderForm, total, id: editingOrderId } : o
        )
      );
    } else {
      const newId = orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1;
      setOrders([...orders, { ...orderForm, total, id: newId }]);
    }
    resetOrderForm();
  };

  const editOrder = (order) => {
    setOrderForm(order);
    setEditingOrderId(order.id);
    setTimeout(() => orderNameRef.current?.focus(), 0);
  };

  const deleteOrder = (id) => {
    if (window.confirm('Delete this order?')) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  const exportToCSV = () => {
    if (!orders.length) return;
    const data = orders.map((o) => ({
      customer: o.user.name,
      email: o.user.email,
      phone: o.user.phone,
      items: o.items.map((i) => `${i.name} (₹${i.price})`).join('; '),
      total: o.total,
      location: o.location,
      date: o.date,
    }));

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((field) => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'orders.csv';
    link.click();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesName =
      !filters.name ||
      order.items.some((item) => item.name.toLowerCase().includes(filters.name.toLowerCase()));
    const matchesLocation =
      !filters.location || order.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice =
      !filters.minPrice || order.total >= parseInt(filters.minPrice);
    return matchesName && matchesLocation && matchesPrice;
  });

  return (
    <div style={{width:"95%", marginLeft:"14px"}}>
      <h3 className="mb-4 ">Orders</h3>
      {/* Summary Cards (Inline CSS) */}
<section
  style={{
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    animation: 'fadeInUp 0.8s ease forwards',
  }}
>
  {[
    {
      label: 'Total Orders',
      value: orders.length,
      background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
      boxShadow: '0 6px 20px rgba(75, 117, 169, 0.6)',
      color: 'white',
    },
    {
      label: 'Total Customers',
      value: customers.length,
      background: 'linear-gradient(135deg, #00ff6a, #007a36)',
      boxShadow: '0 6px 20px rgba(0, 122, 54, 0.6)',
      color: 'white',
    },
    {
      label: 'Total Revenue',
      value: `₹${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}`,
      background: 'linear-gradient(135deg, #ffd500, #ff7a00)',
      boxShadow: '0 6px 20px rgba(255, 122, 0, 0.6)',
      color: '#222',
    },
  ].map((item, i) => (
    <div
      key={i}
      style={{
        flex: '1 1 280px',
       
        borderRadius: '20px',
        padding: '2rem 2.5rem',
        background: item.background,
        color: item.color,
        boxShadow: item.boxShadow,
        cursor: 'default',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.07)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = item.boxShadow;
      }}
    >
      <h5
        style={{
          fontSize: '1.3rem',
          marginBottom: '0.5rem',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          textShadow: '0 0 6px rgba(0,0,0,0.2)',
        }}
      >
        {item.label}
      </h5>
     
      <h3
        style={{
          fontSize: '2.8rem',
          fontWeight: '900',
          lineHeight: 1,
          textShadow: '0 0 12px rgba(0,0,0,0.25)',
        }}
      >
        {item.value}
      </h3>
    </div>
  ))}
</section>


      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input className="form-control" placeholder="Item Name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="col-md-4">
          <input className="form-control" type="number" placeholder="Min Total ₹" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Location" value={filters.location} onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))} />
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Total (₹)</th>
              <th>Location</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted">No matching orders</td></tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.user.name}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {order.items.map((item, i) => (
                        <li key={i}>{item.name} (₹{item.price})</li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.total.toLocaleString()}</td>
                  <td>{order.location}</td>
                  <td>{order.date}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editOrder(order)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteOrder(order.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Form */}
      <form onSubmit={(e) => { e.preventDefault(); saveOrder(); }}>
        <h5 className="mt-4">{editingOrderId ? 'Edit Order' : 'Add New Order'}</h5>

        {/* Customer Fields */}
        <div className="row">
          <div className="col-md-6">
            <label>Name</label>
            <input ref={orderNameRef} className="form-control" value={orderForm.user.name} onChange={(e) => handleOrderUserChange('name', e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label>Email</label>
            <input className="form-control" type="email" value={orderForm.user.email} onChange={(e) => handleOrderUserChange('email', e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label>Phone</label>
            <input className="form-control" value={orderForm.user.phone} onChange={(e) => handleOrderUserChange('phone', e.target.value)} />
          </div>
          <div className="col-md-6">
            <label>Address</label>
            <input className="form-control" value={orderForm.user.address} onChange={(e) => handleOrderUserChange('address', e.target.value)} />
          </div>
        </div>

        {/* Items */}
        <div className="mt-3">
          <label>Items</label>
          {orderForm.items.map((item, idx) => (
            <div className="d-flex mb-2" key={idx}>
              <input className="form-control me-2" placeholder="Name" value={item.name} onChange={(e) => handleOrderItemChange(idx, 'name', e.target.value)} required />
              <input className="form-control me-2" type="number" placeholder="Price" value={item.price} onChange={(e) => handleOrderItemChange(idx, 'price', e.target.value)} required />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOrderItem(idx)} disabled={orderForm.items.length === 1}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={addOrderItem}>+ Add Item</button>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <label>Location</label>
            <input className="form-control" value={orderForm.location} onChange={(e) => handleOrderInputChange('location', e.target.value)} required />
          </div>
          <div className="col-md-6">
            <label>Date</label>
            <input className="form-control" type="date" value={orderForm.date} onChange={(e) => handleOrderInputChange('date', e.target.value)} required />
          </div>
        </div>

        <div className="mt-3">
          <strong>Total: ₹{calculateTotal().toLocaleString()}</strong>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">{editingOrderId ? 'Update' : 'Add'} Order</button>
          {editingOrderId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={resetOrderForm}>Cancel</button>
          )}
        </div>
      </form>

      <button className="btn btn-success mt-4" onClick={exportToCSV}>
        Export Orders to CSV
      </button>
    </div>
  );
}
