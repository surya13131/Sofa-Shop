import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(location.state?.cart || []);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [user, setUser] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      setUser(userObj);

      // Fetch previous orders for this user
      fetch(`http://localhost:8080/api/orders?email=${userObj.email}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch previous orders');
          return res.json();
        })
        .then(data => setPreviousOrders(data))
        .catch(err => console.error(err));
    }
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.toString().replace(/[₹,]/g, '')) || 0;
    return sum + price;
  }, 0);

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to place an order.');
      return;
    }

    const orderData = {
      total,
      location: user.address || "Unknown",
      date: new Date().toISOString().split('T')[0],
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      },
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        price: parseInt(item.price.toString().replace(/[₹,]/g, '')) || 0,
        quantity: item.quantity || 1
      }))
    };

    try {
      const res = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Order failed.');

      setOrderPlaced(true);
      setCartItems([]);
      localStorage.removeItem('cartItems');

      // Refetch previous orders to update list
      const ordersRes = await fetch(`http://localhost:8080/api/orders?email=${user.email}`);
      const ordersData = await ordersRes.json();
      setPreviousOrders(ordersData);

    } catch (err) {
      console.error(err);
      alert('Something went wrong while placing the order.');
    }
  };

  if (orderPlaced) {
    return (
      <div style={styles.fullPage}>
        <div style={styles.card}>
          <h2 style={{ color: 'green', textAlign: 'center' }}>🎉 Order Placed!</h2>
          <p style={{ textAlign: 'center' }}>Thank you for your order. We’ll get in touch with you soon!</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={styles.primaryButton} onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.fullPage}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <div style={styles.warning}>Your cart is empty.</div>
        ) : (
          <>
            <div style={styles.section}>
              <h4>Customer Info</h4>
              <ul style={styles.detailList}>
                <li><strong>Name:</strong> {user?.name || 'N/A'}</li>
                <li><strong>Email:</strong> {user?.email || 'N/A'}</li>
                <li><strong>Phone:</strong> {user?.phone || 'N/A'}</li>
                <li><strong>Address:</strong> {user?.address || 'N/A'}</li>
              </ul>
            </div>

            <div style={styles.section}>
              <h4>Items</h4>
              {cartItems.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <img
                    src={item.image || item.img || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    style={styles.itemImage}
                  />
                  <div>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemPrice}>₹{item.price}</div>
                    {item.quantity && <div style={styles.itemQuantity}>Qty: {item.quantity}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.section}>
              <div style={styles.totalRow}>
                <span>Total:</span>
                <strong>₹{total.toLocaleString()}</strong>
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button style={styles.secondaryButton} onClick={() => navigate('/')}>← Back</button>
              <button style={styles.primaryButton} onClick={handleBuyNow}>💳 Buy Now</button>
            </div>
          </>
        )}

        {/* Previous Orders Section */}
        <div style={{ marginTop: 40 }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 20 }}>
            📦 Previous Orders
          </h3>
          {previousOrders.length === 0 ? (
            <div style={styles.warning}>No previous orders found.</div>
          ) : (
            <div style={styles.ordersWrapper}>
              {previousOrders.map((order, idx) => (
                <div key={idx} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <span><strong>Order Date:</strong> {order.date}</span>
                    <span><strong>Total:</strong> ₹{order.total.toLocaleString()}</span>
                  </div>
                  <div>
                    <strong>Items:</strong>
                    {order.items.map((item, i) => (
                      <div key={i} style={styles.itemRow}>
                        <div style={{ flex: 1 }}>{item.name}</div>
                        <div>Qty: {item.quantity}</div>
                        <div>₹{item.price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  fullPage: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    zIndex: 9999,
    overflowY: 'auto',
  },
  card: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '95vh',
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflowY: 'auto',
  },
  heading: {
    textAlign: 'center',
    fontSize: '26px',
    marginBottom: '25px',
    color: '#333'
  },
  section: {
    marginBottom: '20px'
  },
  detailList: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '1.8',
    fontSize: '16px'
  },
  itemRow: {
    display: 'flex',
    gap: '15px',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '5px'
  },
  itemName: {
    fontWeight: 600,
    fontSize: '16px',
    flex: 3
  },
  itemPrice: {
    fontSize: '14px',
    color: '#777',
    flex: 1,
    textAlign: 'right'
  },
  itemQuantity: {
    fontSize: '14px',
    color: '#555',
    marginLeft: 10
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '18px',
    paddingTop: '12px',
    borderTop: '2px solid #ccc'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px'
  },
  primaryButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  warning: {
    background: '#fff3cd',
    color: '#856404',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '14px'
  },
  orderCard: {
    border: '1px solid #ddd',
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
    backgroundColor: '#fafafa'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  ordersWrapper: {
    maxHeight: '300px',      // Fix height to control overflow
    overflowY: 'auto',
    paddingRight: '10px'     // Space for scrollbar
  }
};

export default Cart;
