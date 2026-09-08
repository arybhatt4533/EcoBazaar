import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutCart.css';

export const CheckoutCart = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Orders

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      navigate('/login');
    } else {
      setUserData(user);
      fetchUserData(user.id);
      fetchUserOrders(user.id);
    }

    try {
      const savedCart = JSON.parse(localStorage.getItem('cartItems'));
      if (savedCart && Array.isArray(savedCart)) {
        setCartItems(savedCart);
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const addressRes = await axios.get(`http://localhost:5000/api/addresses/${userId}`);
      if (addressRes.data && addressRes.data.length > 0) {
        setAddress(addressRes.data[0]);
      } else {
        const localAddr = JSON.parse(localStorage.getItem(`address_${userId}`));
        if (localAddr) setAddress(localAddr);
      }
    } catch (err) {
      const localAddr = JSON.parse(localStorage.getItem(`address_${userId}`));
      if (localAddr) setAddress(localAddr);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${userId}`);
      if (res.data) setOrders(res.data);
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`));
      if (localOrders) setOrders(localOrders);
    }
  };

  const handleRemoveFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) return { ...ord, status: 'Cancelled' };
      return ord;
    });
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${userData.id}`, JSON.stringify(updatedOrders));
    alert(`Order ${orderId} cancelled successfully.`);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/addresses', {
        user_id: userData.id,
        ...newAddress
      });
    } catch (err) {
      console.warn('Backend offline, saving locally');
    }

    localStorage.setItem(`address_${userData.id}`, JSON.stringify(newAddress));
    setAddress(newAddress);
    setShowAddressForm(false);
    alert('Address saved successfully! 🎉');
    setCurrentStep(3); // Move to Payment
  };

  const handleConfirmOrder = () => {
    const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.offer_price || item.price), 0);
    const newOrderData = {
      id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      totalAmount: totalAmount,
      paymentMethod: 'cod',
      status: 'Order Placed',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updatedOrders = [newOrderData, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${userData.id}`, JSON.stringify(updatedOrders));
    
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setCurrentStep(4); // Move to My Orders view
    alert('Order placed successfully via COD! 🚀');
  };

  if (!userData) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + Number(item.offer_price || item.price), 0);

  return (
    <div className="new-checkout-wrapper">
      {/* Top Header Navigation */}
      <header className="checkout-top-nav">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <h2>🌿 MyStore</h2>
        </div>
        <div className="nav-tabs-center">
          <button className={currentStep <= 3 && currentStep > 0 ? 'active-tab' : ''} onClick={() => currentStep <= 3 && cartItems.length > 0 && setCurrentStep(1)}>
            Bag
          </button>
          <span>➔</span>
          <button className={currentStep === 2 ? 'active-tab' : ''} onClick={() => address && setCurrentStep(2)}>
            Address
          </button>
          <span>➔</span>
          <button className={currentStep === 3 ? 'active-tab' : ''} onClick={() => address && cartItems.length > 0 && setCurrentStep(3)}>
            Payment
          </button>
        </div>
        <div className="nav-right-actions">
          <button className="top-action-btn" onClick={() => setCurrentStep(4)}>
            📦 My Orders ({orders.length})
          </button>
          <button className="top-action-btn logout" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="checkout-main-content">
        
        {/* STEP 1: CART ITEMS */}
        {currentStep === 1 && (
          <div className="checkout-grid-layout">
            <div className="left-section">
              <h3>Review Items ({cartItems.length})</h3>
              {cartItems.length === 0 ? (
                <div className="empty-box">
                  <p>Your bag is empty!</p>
                  <button className="primary-btn" onClick={() => navigate('/')}>Shop Now</button>
                </div>
              ) : (
                <div className="items-stack">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="modern-item-card">
                      <img src={item.image} alt={item.title} />
                      <div className="item-info">
                        <span className="brand-tag">{item.brand || 'Brand'}</span>
                        <h4>{item.title}</h4>
                        <span className="price-tag">₹{item.offer_price || item.price}</span>
                      </div>
                      <button className="delete-btn" onClick={() => handleRemoveFromCart(idx)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="right-sidebar-summary">
                <h4>Price Details</h4>
                <div className="sum-row"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                <div className="sum-row"><span>Delivery Fee</span><span className="free">FREE</span></div>
                <hr />
                <div className="sum-row total"><span>Total Payable</span><span>₹{totalAmount}</span></div>
                <button className="primary-btn full-w" onClick={() => {
                  if (!address) setCurrentStep(2);
                  else setCurrentStep(2);
                }}>
                  Proceed to Address ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ADDRESS MANAGEMENT */}
        {currentStep === 2 && (
          <div className="single-card-container">
            <h3>Select Delivery Address</h3>
            {address && !showAddressForm ? (
              <div className="saved-addr-box">
                <p><strong>Deliver to:</strong> {address.address}, {address.city} - {address.pincode}</p>
                <p><strong>Phone:</strong> {address.phone}</p>
                <div className="btn-row">
                  <button className="primary-btn" onClick={() => setCurrentStep(3)}>Deliver Here & Continue</button>
                  <button className="secondary-btn" onClick={() => setShowAddressForm(true)}>Edit Address</button>
                </div>
              </div>
            ) : (
              <form className="clean-form" onSubmit={handleSaveAddress}>
                <div className="field-group">
                  <label>Street Address</label>
                  <input type="text" required placeholder="House no, Area, Street" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label>City</label>
                    <input type="text" required placeholder="City name" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  </div>
                  <div className="field-group">
                    <label>Pincode</label>
                    <input type="text" required placeholder="201301" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                  </div>
                </div>
                <div className="field-group">
                  <label>Phone Number</label>
                  <input type="text" required placeholder="9876543210" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                </div>
                <button type="submit" className="primary-btn full-w">Save & Proceed to Payment</button>
              </form>
            )}
          </div>
        )}

        {/* STEP 3: PAYMENT SCREEN */}
        {currentStep === 3 && (
          <div className="single-card-container">
            <h3>Choose Payment Method</h3>
            {address && (
              <div className="mini-address-pill">
                📍 Delivering to: <strong>{address.address}, {address.city}</strong>
              </div>
            )}
            <div className="payment-options-group">
              <label className="pay-card active">
                <input type="radio" checked readOnly />
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay safely with cash upon delivery.</p>
                </div>
              </label>
              <label className="pay-card disabled">
                <input type="radio" disabled />
                <div>
                  <strong>Online UPI / Cards <span className="badge-offline">Not Available</span></strong>
                  <p>Temporarily under maintenance.</p>
                </div>
              </label>
            </div>
            <div className="btn-row space-between">
              <button className="secondary-btn" onClick={() => setCurrentStep(2)}>Back</button>
              <button className="primary-btn" onClick={handleConfirmOrder}>Place Order (₹{totalAmount})</button>
            </div>
          </div>
        )}

        {/* STEP 4: MY ORDERS VIEW */}
        {currentStep === 4 && (
          <div className="orders-container-wide">
            <h3>My Orders & Tracking</h3>
            {orders.length === 0 ? (
              <div className="empty-box">
                <p>No orders found.</p>
                <button className="primary-btn" onClick={() => setCurrentStep(1)}>Start Shopping</button>
              </div>
            ) : (
              orders.map((ord, idx) => (
                <div key={idx} className="order-item-box">
                  <div className="order-header-info">
                    <div>
                      <span className="order-id">ID: {ord.id}</span>
                      <p className="order-date">Placed on: {ord.date}</p>
                    </div>
                    <div className="text-right">
                      <span className="order-amt">₹{ord.totalAmount}</span>
                      <span className={`status-pill ${ord.status.toLowerCase()}`}>{ord.status}</span>
                    </div>
                  </div>
                  <div className="order-products-list">
                    <strong>Items:</strong> {ord.items.map(i => i.title).join(', ')}
                  </div>
                  {ord.status === 'Order Placed' && (
                    <div className="order-actions-row">
                      <button className="cancel-action-btn" onClick={() => handleCancelOrder(ord.id)}>Cancel Order ❌</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};