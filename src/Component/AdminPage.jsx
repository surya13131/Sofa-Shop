import React, { useState, useEffect, useRef } from 'react';

export default function AdminPage() {
  
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ name: '', minPrice: '', location: '' });

  
  const [orderForm, setOrderForm] = useState({
    id: null,
    user: { name: '', email: '', phone: '', address: '' },
    items: [{ name: '', price: '' }],
    total: 0,
    location: '',
    date: '',
  });
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingCustomerEmail, setEditingCustomerEmail] = useState(null);

  const orderNameRef = useRef(null);
  const customerNameRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    emi: '',
    discount: '',
    description: '',
    image: null,
  });
  const [editingProductIndex, setEditingProductIndex] = useState(null);

  useEffect(() => {
    // Initialize with dummy data
    const dummyOrders = [
      {
        id: 1,
        user: { name: 'Alice', email: 'alice@example.com', phone: '1234567890', address: 'Chennai' },
        items: [
          { name: 'Amber Three Seater Fabric Sofa', price: 48999 },
          { name: 'Tufted Velvet Loveseat', price: 52000 },
        ],
        total: 100999,
        location: 'Chennai',
        date: '2025-08-01',
      },
      {
        id: 2,
        user: { name: 'Bob', email: 'bob@example.com', phone: '9876543210', address: 'Bangalore' },
        items: [{ name: 'Classic Leather Sofa', price: 75000 }],
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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesName =
      filters.name === '' ||
      order.items.some((item) => item.name.toLowerCase().includes(filters.name.toLowerCase()));
    const matchesLocation =
      filters.location === '' || order.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice =
      filters.minPrice === '' || order.total >= parseInt(filters.minPrice);
    return matchesName && matchesLocation && matchesPrice;
  });

  // Order form handlers
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
    newItems[index] = { ...newItems[index], [field]: field === 'price' ? Number(value) : value };
    setOrderForm((prev) => ({ ...prev, items: newItems }));
  };

  const addOrderItem = () => {
    setOrderForm((prev) => ({ ...prev, items: [...prev.items, { name: '', price: '' }] }));
  };

  const removeOrderItem = (index) => {
    if (orderForm.items.length === 1) return;
    const newItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotal = () => {
    return orderForm.items.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  };

  const saveOrder = () => {
    if (
      !orderForm.user.name.trim() ||
      !orderForm.user.email.trim() ||
      !orderForm.location.trim() ||
      !orderForm.date.trim() ||
      orderForm.items.some((item) => !item.name.trim() || !item.price)
    ) {
      alert('Please fill all fields and ensure items have valid name and price.');
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
      setOrders((prev) => [...prev, { ...orderForm, total, id: newId }]);
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

  // Customer handlers
  const resetCustomerForm = () => {
    setCustomerForm({ name: '', email: '', phone: '', address: '' });
    setEditingCustomerEmail(null);
  };

  const handleCustomerChange = (field, value) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveCustomer = () => {
    if (
      !customerForm.name.trim() ||
      !customerForm.email.trim() ||
      !customerForm.phone.trim() ||
      !customerForm.address.trim()
    ) {
      alert('Please fill all customer fields.');
      return;
    }
    if (editingCustomerEmail) {
      setCustomers((prev) =>
        prev.map((c) => (c.email === editingCustomerEmail ? customerForm : c))
      );
    } else {
      if (customers.some((c) => c.email === customerForm.email)) {
        alert('Email already exists for a customer.');
        return;
      }
      setCustomers((prev) => [...prev, customerForm]);
    }
    resetCustomerForm();
  };

  const editCustomer = (customer) => {
    setCustomerForm(customer);
    setEditingCustomerEmail(customer.email);
    setTimeout(() => customerNameRef.current?.focus(), 0);
  };

  const deleteCustomer = (email) => {
    if (window.confirm('Delete this customer?')) {
      setCustomers((prev) => prev.filter((c) => c.email !== email));
      setOrders((prev) => prev.filter((o) => o.user.email !== email));
      if (editingCustomerEmail === email) resetCustomerForm();
    }
  };

  // Keyboard accessible button handler
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
  const handleProductImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
};
const exportToCSV = (data, filename) => {
  const csvRows = [];

  // Headers
  const headers = Object.keys(data[0] || {});
  csvRows.push(headers.join(','));

  // Rows
  data.forEach(row => {
    const values = headers.map(header => {
      let val = row[header];
      if (typeof val === 'object') val = JSON.stringify(val);
      return `"${(val ?? '').toString().replace(/"/g, '""')}"`; // Escape double quotes
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};



  return (
    <>
    <>
  <style>{`
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: rgba(156, 180, 210, 0.08);
      color: #eee;
      margin: 0;
      padding: 0;
    }
    .container-fluid {
      max-width: 1400px;
      margin: auto;
      padding: 2rem 1rem 4rem;
    }
    .navbar {
      background: linear-gradient(90deg,rgb(3, 97, 137), #203a43, #2c5364);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 1.3rem;
      user-select: none;
      margin-bottom: 2rem;
      color: #f1f1f1;
      letter-spacing: 0.03em;
      animation: fadeInDown 0.8s ease forwards;
    }
    h2 {
      font-size: 2.5rem;
      border-bottom: 3px solid #444;
      padding-bottom: 3rem;
      margin-bottom: 2rem;
      color: DarkSlateGray;
      text-shadow: 0 0 12px rgba(185, 198, 198, 0.089), 0 0 25px #0ff88;
      animation: fadeInDown 1s ease forwards;
    }
    .summary-cards {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
      animation: fadeInUp 0.8s ease forwards;
    }
    .summary-card {
      flex: 1 1 280px;
      background: linear-gradient(135deg, #00c6ff, #0072ff);
      border-radius: 20px;
      padding: 2rem 2.5rem;
      color: white;
      box-shadow: 0 6px 20px rgba(75, 117, 169, 0.6);
      cursor: default;
      transition: transform 0.35s ease, box-shadow 0.35s ease;
      user-select: none;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .summary-card:nth-child(2) {
      background: linear-gradient(135deg, #00ff6a, #007a36);
      box-shadow: 0 6px 20px rgba(0, 122, 54, 0.6);
    }
    .summary-card:nth-child(3) {
      background: linear-gradient(135deg, #ffd500, #ff7a00);
      box-shadow: 0 6px 20px rgba(255, 122, 0, 0.6);
      color: #222;
    }
    .summary-card:hover {
      transform: scale(1.07);
      box-shadow: 0 10px 30px rgba(255, 255, 255, 0.25);
    }
    .summary-card h5 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      text-shadow: 0 0 6px rgba(0,0,0,0.2);
    }
    .summary-card h3 {
      font-size: 2.8rem;
      font-weight: 900;
      line-height: 1;
      text-shadow: 0 0 12px rgba(0,0,0,0.25);
    }
    .card {
      background: linear-gradient(145deg,rgb(126, 72, 81), #292929);
      border-radius: 16px;
      padding: 1.8rem 2rem;
      box-shadow: 0 3px 24px rgba(97, 119, 155, 0);
      margin-bottom: 3rem;
      color: #ddd;
      animation: fadeInUp 1s ease forwards;
    }
    .card h4 {
      color: #0ff;
      margin-bottom: 1rem;
    }
    input[type="text"],
    input[type="email"],
    input[type="number"],
    input[type="date"] {
      width: 100%;
      padding: 0.6rem 1rem;
      margin: 0.3rem 0 1rem;
      border-radius: 12px;
      border: none;
      background: #333;
      color: #eee;
      font-size: 1rem;
      transition: background 0.3s ease;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.7);
      outline-offset: 2px;
    }
    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="number"]:focus,
    input[type="date"]:focus {
      background: rgba(61, 101, 154, 0.17);
      color: white;
      outline: none;
      box-shadow: 0 0 8px rgb(78, 103, 137), inset 0 2px 5px rgba(0,0,0,0.9);
    }
    label {
      font-weight: 600;
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.3rem;
      user-select: none;
    }
    button {
      background: linear-gradient(135deg, #0ff, #06c);
      border: none;
      padding: 0.65rem 1.5rem;
      font-weight: 700;
      font-size: 1rem;
      color: #fff;
      border-radius: 16px;
      cursor: pointer;
      transition: background 0.35s ease, transform 0.2s ease;
      box-shadow: 0 4px 10px rgba(98, 137, 156, 0.7);
      user-select: none;
      margin-top: 0.4rem;
    }
    button:hover,
    button:focus {
      background: linear-gradient(135deg, #06f, rgb(67, 108, 170));
      transform: scale(1.05);
      outline: none;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      user-select: none;
    }
    th, td {
      text-align: left;
      padding: 0.7rem 1rem;
      border-bottom: 1px solid #444;
    }
    th {
      background: #222;
      font-weight: 700;
      color: #0ff;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-size: 0.85rem;
    }
    tr:hover {
      background: rgba(0, 255, 255, 0);
      cursor: pointer;
    }
    .actions button {
      background: #d9534f;
      box-shadow: 0 3px 10px rgba(217, 83, 79, 0.7);
      margin-right: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .actions button:hover {
      background: #c9302c;
      box-shadow: 0 4px 15px rgba(201, 48, 44, 0.9);
    }
    .flex-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
    }
    .flex-row > * {
      flex: 1 1 220px;
    }
    .order-items-list {
      margin-bottom: 1rem;
    }
    .order-item {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.6rem;
      align-items: center;
    }
    .order-item input {
      flex: 1;
    }
    .order-item button {
      background: #d9534f;
      padding: 0.35rem 0.9rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.85rem;
      margin: 0;
      box-shadow: 0 3px 10px rgba(217, 83, 79, 0.7);
      cursor: pointer;
      transition: background 0.3s ease;
      user-select: none;
    }
    .order-item button:hover {
      background: #c9302c;
      box-shadow: 0 4px 15px rgba(201, 48, 44, 0.9);
    }
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .table-wrapper {
      overflow-x: auto;
      max-width: 100%;
      margin-top: 1rem;
    }
  `}</style>

  
</>

        <div className="admin-page" style={{width:"145%", marginLeft:"-22%"}}>
      <nav className="navbar" role="banner" aria-label="Primary Navigation">
        <div>GOODWILL LINING</div>
        <div>Admin Panel</div>
      </nav>

      <div className="container-fluid" role="main" tabIndex={-1}>
        <h2>Orders and Customers Dashboard</h2>

   
        <section aria-label="Summary Statistics" className="summary-cards">
          <article className="summary-card" tabIndex={0} aria-describedby="total-orders-desc">
            <h5>Total Orders</h5>
            <h3>{orders.length}</h3>
            <p id="total-orders-desc" className="sr-only">
              Total number of orders placed
            </p>
          </article>
          <article className="summary-card" tabIndex={0} aria-describedby="total-customers-desc">
            <h5>Total Customers</h5>
            <h3>{customers.length}</h3>
            <p id="total-customers-desc" className="sr-only">
              Total number of customers registered
            </p>
          </article>
          <article className="summary-card" tabIndex={0} aria-describedby="total-revenue-desc">
            <h5>Total Revenue</h5>
            <h3>₹{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</h3>
            <p id="total-revenue-desc" className="sr-only">
              Total revenue from all orders
            </p>
          </article>
        </section>
<section className="card mb-5" aria-label="Products Manager" style={{ maxWidth: '2000px', margin: 'auto' }}>
  <h4>Manage Products</h4>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      saveProduct();
    }}
    aria-label="Add or Edit Product Form"
    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
  >
    <label htmlFor="productName">Product Name</label>
    <input
      id="productName"
      type="text"
      value={productForm.name}
      onChange={(e) => handleProductChange('name', e.target.value)}
      required
      style={{ padding: '0.5rem' }}
    />

    <label htmlFor="productPrice">Price (₹)</label>
    <input
      id="productPrice"
      type="number"
      min="0"
      value={productForm.price}
      onChange={(e) => handleProductChange('price', e.target.value)}
      required
      style={{ padding: '0.5rem' }}
    />

    <label htmlFor="productEMI">EMI</label>
    <input
      id="productEMI"
      type="text"
      value={productForm.emi}
      onChange={(e) => handleProductChange('emi', e.target.value)}
      style={{ padding: '0.5rem' }}
    />

    <label htmlFor="productDiscount">Discount (%)</label>
    <input
      id="productDiscount"
      type="number"
      min="0"
      max="100"
      value={productForm.discount}
      onChange={(e) => handleProductChange('discount', e.target.value)}
      style={{ padding: '0.5rem' }}
    />

    <label htmlFor="productDescription">Description</label>
    <textarea
      id="productDescription"
      value={productForm.description}
      onChange={(e) => handleProductChange('description', e.target.value)}
      style={{ padding: '0.5rem' }}
    />

    <label htmlFor="productImage">Product Image</label>
    <input
      id="productImage"
      type="file"
      accept="image/*"
      
      onChange={handleProductImageChange}
    />

    {/* Instead of image preview, show a simple text */}
    {productForm.image && (
      <div style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#4caf50', justifyContent:"center" }}>
        Image uploaded ✓
      </div>
    )}

    <div style={{ marginTop: '1rem' }}>
      <button
        type="submit"
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        {editingProductIndex !== null ? 'Update Product' : 'Add Product'}
      </button>

      {editingProductIndex !== null && (
        <button
          type="button"
          onClick={resetProductForm}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            background: '#777',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      )}
    </div>
  </form>

  {/* Products List */}
  <div
    className="table-wrapper"
    role="table"
    aria-label="Products Table"
    style={{ marginTop: '2rem', overflowX: 'auto' }}
  >
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '600px',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th style={{ padding: '8px', textAlign: 'left' }}>Image</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
          <th style={{ padding: '8px', textAlign: 'right' }}>Price (₹)</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>EMI</th>
          <th style={{ padding: '8px', textAlign: 'right' }}>Discount (%)</th>
          <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
          <th aria-label="Actions" style={{ padding: '8px', textAlign: 'center' }}></th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td
              colSpan="7"
              style={{ textAlign: 'center', color: '#bbb', padding: '12px' }}
            >
              No products found.
            </td>
          </tr>
        ) : (
          products.map((product, index) => (
            <tr
              key={index}
              tabIndex={0}
              aria-label={`Product ${product.name}`}
              style={{ borderBottom: '1px solid #ddd' }}
            >
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ maxWidth: '75px', borderRadius: '4px' }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>{product.name}</td>
              <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'middle' }}>
                ₹{Number(product.price).toLocaleString()}
              </td>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>{product.emi}</td>
              <td style={{ padding: '8px', textAlign: 'right', verticalAlign: 'middle' }}>
                {product.discount}
              </td>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>{product.description}</td>
              <td
                className="actions"
                style={{
                  padding: '8px',
                  verticalAlign: 'middle',
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <button
                  aria-label={`Edit product ${product.name}`}
                  onClick={() => editProduct(index)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: '1px solid #007bff',
                    backgroundColor: '#fff',
                    color: '#007bff',
                  }}
                >
                  Edit
                </button>
                <button
                  aria-label={`Delete product ${product.name}`}
                  onClick={() => deleteProduct(index)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: '1px solid #dc3545',
                    backgroundColor: '#fff',
                    color: '#dc3545',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  <button
  type="button"
  onClick={() =>
    exportToCSV(
      products.map((p) => ({
        name: p.name,
        price: p.price,
        emi: p.emi,
        discount: p.discount,
        description: p.description,
        image: p.image,
      })),
      'products'
    )
  }
  style={{ marginTop: '1rem' }}
>
  Export Products to CSV
</button>

      </section>
        {/* Filters */}
        <section className="card mt-5" aria-label="Filter Orders">
          <h4>Filter Orders</h4>
          <div className="flex-row">
            <label htmlFor="filterName">Item Name Contains:</label>
            <input
              type="text"
              id="filterName"
              value={filters.name}
              onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
              placeholder="E.g., sofa"
              aria-describedby="filterNameHelp"
            />
            <label htmlFor="filterMinPrice">Min Total Price (₹):</label>
            <input
              type="number"
              id="filterMinPrice"
              min="0"
              value={filters.minPrice}
              onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
              placeholder="0"
              aria-describedby="filterMinPriceHelp"
            />
            <label htmlFor="filterLocation">Location:</label>
            <input
              type="text"
              id="filterLocation"
              value={filters.location}
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              placeholder="E.g., Chennai"
              aria-describedby="filterLocationHelp"
            />
          </div>
          
        </section>

        {/* Orders List */}
        <section className="card" aria-label="Orders List">
          <h4>Orders</h4>
          <div className="table-wrapper" role="table" aria-label="Orders Table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Customer</th>
                  <th scope="col">Items</th>
                  <th scope="col">Total (₹)</th>
                  <th scope="col">Location</th>
                  <th scope="col">Date</th>
                  <th scope="col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#bbb' }}>
                      No orders found.
                    </td>
                  </tr>
                )}
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    tabIndex={0}
                    aria-label={`Order by ${order.user.name}, total ₹${order.total}`}
                    onKeyDown={(e) =>
                      handleKeyDown(e, () => editOrder(order))
                    }
                  >
                    <td>{order.user.name}</td>
                    <td>
                      <ul>
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} (₹{item.price.toLocaleString()})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>₹{order.total.toLocaleString()}</td>
                    <td>{order.location}</td>
                    <td>{order.date}</td>
                    <td className="actions">
                      <button
                        aria-label={`Edit order by ${order.user.name}`}
                        onClick={() => editOrder(order)}
                      >
                        Edit
                      </button>
                      <button
                        aria-label={`Delete order by ${order.user.name}`}
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveOrder();
            }}
            aria-label="Add or Edit Order Form"
            className="order-form"
          >
            <h4>{editingOrderId ? 'Edit Order' : 'Add New Order'}</h4>
            <fieldset>
              <legend>Customer Details</legend>
              <label htmlFor="orderUserName">Name</label>
              <input
                id="orderUserName"
                type="text"
                value={orderForm.user.name}
                onChange={(e) => handleOrderUserChange('name', e.target.value)}
                required
                ref={orderNameRef}
              />

              <label htmlFor="orderUserEmail">Email</label>
              <input
                id="orderUserEmail"
                type="email"
                value={orderForm.user.email}
                onChange={(e) => handleOrderUserChange('email', e.target.value)}
                required
              />

              <label htmlFor="orderUserPhone">Phone</label>
              <input
                id="orderUserPhone"
                type="tel"
                value={orderForm.user.phone}
                onChange={(e) => handleOrderUserChange('phone', e.target.value)}
              />

              <label htmlFor="orderUserAddress">Address</label>
              <input
                id="orderUserAddress"
                type="text"
                value={orderForm.user.address}
                onChange={(e) => handleOrderUserChange('address', e.target.value)}
              />
            </fieldset>

            <fieldset>
              <legend>Ordered Items</legend>
              {orderForm.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleOrderItemChange(idx, 'name', e.target.value)}
                    required
                    aria-label={`Item ${idx + 1} Name`}
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleOrderItemChange(idx, 'price', e.target.value)}
                    required
                    aria-label={`Item ${idx + 1} Price`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOrderItem(idx)}
                    aria-label={`Remove item ${idx + 1}`}
                    disabled={orderForm.items.length === 1}
                    className="m-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOrderItem} className='m-3'>
                Add Item
              </button>
            </fieldset>

            <label htmlFor="orderLocation">Location</label>
            <input
              id="orderLocation"
              type="text"
              value={orderForm.location}
              onChange={(e) => handleOrderInputChange('location', e.target.value)}
              required
            />

            <label htmlFor="orderDate">Date</label>
            <input
              id="orderDate"
              type="date"
              value={orderForm.date}
              onChange={(e) => handleOrderInputChange('date', e.target.value)}
              required
            />

            <div>Total: ₹{calculateTotal().toLocaleString()}</div>

            <button type="submit">{editingOrderId ? 'Update Order' : 'Add Order'}</button>
            {editingOrderId && (
              <button type="button" onClick={resetOrderForm} style={{ marginLeft: '1rem', background: '#777' }}>
                Cancel
              </button>
            )}

          </form>
       
              <button
  type="button"
  onClick={() =>
    exportToCSV(
      orders.map((o) => ({
        customer: o.user.name,
        email: o.user.email,
        phone: o.user.phone,
        items: o.items.map(i => `${i.name} (₹${i.price})`).join('; '),
        total: o.total,
        location: o.location,
        date: o.date,
      })),
      'orders'
    )
  }
  style={{ marginTop: '1rem' }}
>
  Export Orders to CSV
</button>

        </section>

        {/* Customers List */}
        <section className="card" aria-label="Customers List">
          <h4>Customers</h4>
          <div className="table-wrapper" role="table" aria-label="Customers Table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col" aria-label="Actions"></th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#bbb' }}>
                      No customers found.
                    </td>
                  </tr>
                )}
                {customers.map((customer) => (
                  <tr
                    key={customer.email}
                    tabIndex={0}
                    aria-label={`Customer ${customer.name}`}
                    onKeyDown={(e) => handleKeyDown(e, () => editCustomer(customer))}
                  >
                    <td>{customer.name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.address}</td>
                    <td className="actions">
                      <button
                        aria-label={`Edit customer ${customer.name}`}
                        onClick={() => editCustomer(customer)}
                      >
                        Edit
                      </button>
                      <button
                        aria-label={`Delete customer ${customer.name}`}
                        onClick={() => deleteCustomer(customer.email)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveCustomer();
            }}
            aria-label="Add or Edit Customer Form"
            className="customer-form"
          >
            <h4>{editingCustomerEmail ? 'Edit Customer' : 'Add New Customer'}</h4>

            <label htmlFor="customerName">Name</label>
            <input
              id="customerName"
              type="text"
              value={customerForm.name}
              onChange={(e) => handleCustomerChange('name', e.target.value)}
              required
              ref={customerNameRef}
            />

            <label htmlFor="customerEmail">Email</label>
            <input
              id="customerEmail"
              type="email"
              value={customerForm.email}
              onChange={(e) => handleCustomerChange('email', e.target.value)}
              required
              disabled={!!editingCustomerEmail}
            />

            <label htmlFor="customerPhone">Phone</label>
            <input
              id="customerPhone"
              type="tel"
              value={customerForm.phone}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
            />

            <label htmlFor="customerAddress">Address</label>
            <input
              id="customerAddress"
              type="text"
              value={customerForm.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
            />

            <button type="submit">{editingCustomerEmail ? 'Update Customer' : 'Add Customer'}</button>
            {editingCustomerEmail && (
              <button
                type="button"
                onClick={resetCustomerForm}
                style={{ marginLeft: '1rem', background: '#777' }}
              >
                Cancel
              </button>
              
            )}
          </form>
          <button
        
  type="button"
  onClick={() =>
    exportToCSV(
      customers.map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
      })),
      'customers'
    )
  }
  className='px-3'
  style={{ marginTop: '1rem' }}
>
  Export Customers to CSV
</button>

        </section>
        

    </div>
    
    </div>
    <footer className="bg-dark text-white py-1 fixed-bottom w-100" style={{ zIndex: 1030 }}>
            <div className="container text-center small ">
             &copy; 2025 Goodwill Lining. All rights reserved.
         
            
            </div>
                </footer>
  </>
  );
}


