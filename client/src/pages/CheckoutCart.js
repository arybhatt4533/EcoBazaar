import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutCart.css';

export const CheckoutCart = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  
  // Cart & Orders State
  const [cartItems, setCartItems] = useState([
    { id: 1, title: 'Men Relaxed Casual Shirt', brand: 'XL Wear', price: 1155, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80' }
  ]);
  
  const [orders, setOrders] = useState([
    { id: 'ORD1029', title: 'Eco Cotton Oversized T-Shirt', price: 899, status: 'Delivered', date: '2026-06-12' }
  ]);

  const [address, setAddress] = useState({
    street: '123 Green Avenue, Sector 4',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301'
  });

  const [userData, setUserData] = useState(null);

  // Check Auth on Component Load -> Agar logged in nahi hai toh seedha Login page par redirect karo
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login'); // Yahan apne login route ka path de dena (e.g., '/login' ya '/auth')
    } else {
      setUserData(JSON.parse(user));
    }
  }, [navigate]);

  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Order placed successfully!');
    setOrders([...orders, { id: 'ORD' + Math.floor(Math.random()*10000), title: cartItems[0].title, price: cartItems[0].price, status: 'Processing', date: 'Today' }]);
    setCartItems([]);
    setActiveTab('orders');
  };

  if (!userData) return null; // Jab tak check ho raha hai, blank render karega

  return (
    <div className="profile-dashboard-container">
      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="user-profile-brief">
          <h3>🌱 My Account</h3>
          <p>{userData.email}</p>
        </div>
        <div className="sidebar-menu">
          <button className={activeTab === 'cart' ? 'active' : ''} onClick={() => setActiveTab('cart')}>
            <i className="fa-solid fa-cart-shopping"></i> My Cart ({cartItems.length})
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <i className="fa-solid fa-bag-shopping"></i> My Orders
          </button>
          <button className={activeTab === 'address' ? 'active' : ''} onClick={() => setActiveTab('address')}>
            <i className="fa-solid fa-location-dot"></i> Saved Addresses
          </button>
          <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {activeTab === 'cart' && (
          <div className="tab-pane">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
              <p className="empty-text">Your cart is currently empty.</p>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="cart-item-card">
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <span className="brand">{item.brand}</span>
                      <h4>{item.title}</h4>
                      <span className="price">₹{item.price}</span>
                    </div>
                  </div>
                ))}
                <button className="checkout-btn" onClick={placeOrder}>
                  Proceed to Checkout & Buy Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="tab-pane">
            <h2>My Orders History</h2>
            {orders.length === 0 ? (
              <p className="empty-text">No orders placed yet.</p>
            ) : (
              <div className="orders-list">
                {orders.map((ord, idx) => (
                  <div key={idx} className="order-card">
                    <div>
                      <h4>{ord.title}</h4>
                      <small>Order ID: {ord.id} | Date: {ord.date}</small>
                    </div>
                    <div className="order-status-box">
                      <span className="price">₹{ord.price}</span>
                      <span className={`status-badge ${ord.status.toLowerCase()}`}>{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && (
          <div className="tab-pane">
            <h2>Saved Delivery Address</h2>
            <div className="address-card">
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>State:</strong> {address.state}</p>
              <p><strong>Pincode:</strong> {address.pincode}</p>
              <button className="edit-addr-btn" onClick={() => alert('Address update feature coming soon!')}>
                Edit Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};