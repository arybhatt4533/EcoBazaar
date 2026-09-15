import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/brand.png';
import './CheckoutCart.css';

export const CheckoutCart = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Address, 3: Payment, 4: Orders

  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Payment method selection (Default online rakha hai taaki options dikhe)
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [paymentError, setPaymentError] = useState('');

  // Coupon code states
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [discount, setDiscount] = useState(0);

  // Large & prominent slider cards data
  const sliderCards = [
    { title: "Big Fashion Festival", desc: "50% - 80% Off | Top Brands", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80", tag: "MEGA SALE" },
    { title: "Easy 7-Day Returns", desc: "Hassle-free pick-up & refund", img: "https://images.unsplash.com/photo-1556742049-0a67d5538255?w=400&auto=format&fit=crop&q=80", tag: "TRUSTED" },
    { title: "100% Secure Checkout", desc: "Safe payment processing", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&auto=format&fit=crop&q=80", tag: "PROTECTED" },
    { title: "Express Home Delivery", desc: "Get orders within 48 hours", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&auto=format&fit=crop&q=80", tag: "FAST" },
    { title: "Exclusive Festive Deals", desc: "Extra discounts with codes", img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&auto=format&fit=crop&q=80", tag: "SPECIAL" }
  ];

  const validCoupons = ["WELCOME10", "SAVE20", "FREESHIP", "FESTIVE50"];

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
      const localAddr = JSON.parse(localStorage.getItem(`address_${userData?.id}`));
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
      if (ord.id === orderId) return { ...ord, status: 'Cancelled', timelineStep: 0 };
      return ord;
    });
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${userData.id}`, JSON.stringify(updatedOrders));
  };

  const handleRemoveOrderHistory = (orderId) => {
    const updatedOrders = orders.filter(ord => ord.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${userData.id}`, JSON.stringify(updatedOrders));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (validCoupons.includes(couponCode.toUpperCase())) {
      setDiscount(50);
      setCouponMessage('🎉 Coupon applied! ₹50 OFF saved.');
    } else {
      setCouponMessage('❌ Coupon code not available or expired!');
      setDiscount(0);
    }
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
    setCurrentStep(3);
  };

  const handleConfirmOrder = () => {
    if (!address) {
      alert('Please add a delivery address first!');
      setCurrentStep(2);
      return;
    }

    if (cartItems.length === 0) {
      alert('Your bag is empty!');
      setCurrentStep(1);
      return;
    }

    // Yahan check hoga: agar user ne online payment select kiya hai, toh place order karte waqt error/not available aayega
    if (paymentMethod === 'online') {
      setPaymentError('⚠️ Online payment gateway is currently Not Available / Failed! Please select Cash on Delivery (COD) to place your order.');
      return;
    }

    setPaymentError('');
    const subtotal = cartItems.reduce((acc, item) => acc + Number(item.offer_price || item.price), 0);
    const totalAmount = Math.max(0, subtotal - discount);

    const newOrderData = {
      id: 'ORD' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      totalAmount: totalAmount,
      paymentMethod: 'Cash on Delivery (COD)',
      status: 'Order Placed',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      timelineStep: 1,
      estimatedDelivery: '12 Sept 2026'
    };

    const updatedOrders = [newOrderData, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${userData.id}`, JSON.stringify(updatedOrders));
    
    setCartItems([]);
    localStorage.removeItem('cartItems');
    setCurrentStep(4);
  };

  if (!userData) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.offer_price || item.price), 0);
  const totalAmount = Math.max(0, subtotal - discount);

  return (
    <div className="modern-checkout-wrapper">
      {/* Top Header Navigation */}
      <header className="checkout-header">
        <div className="brand-logo" onClick={() => navigate('/')}>
          <img src={logoImg} alt="EcoStore Logo" />
        </div>
        <div className="header-actions">
          <button className="nav-btn" onClick={() => setCurrentStep(4)}>
            📦 My Orders ({orders.length})
          </button>
          <button className="nav-btn logout" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </header>

      {/* Large Banner Slider */}
      <div className="large-banner-slider-wrapper">
        <div className="large-slider-track">
          {[...sliderCards, ...sliderCards].map((card, idx) => (
            <div key={idx} className="large-slide-card">
              <div className="slide-content-left">
                <span className="slide-badge">{card.tag}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <button className="slide-action-btn" onClick={() => navigate('/')}>EXPLORE NOW</button>
              </div>
              <div className="slide-image-right">
                <img src={card.img} alt={card.title} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Coupon & Offers Bar */}
      <div className="coupon-ticker-bar">
        <div className="ticker-inner">
          <span>🔥 Use code <strong>WELCOME10</strong> for instant savings</span>
          <span>💁 Use code <strong>NEW25</strong> for instant discount</span>
          <span>⚡ Free delivery on all prepaid & COD orders above ₹499</span>
          <span>🎁 Special Festive Deal: Code <strong>SAVE20</strong></span>
          <span>💎 Extra 15% cashback on HDFC credit cards</span>
          <span>🚀 Express 24-hour delivery available in select cities</span>
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="checkout-progress-bar">
        <div className="stepper-flex">
          <button className={`step-tab ${currentStep === 1 ? 'active' : ''}`} onClick={() => setCurrentStep(1)}>
            1. My Bag ({cartItems.length})
          </button>
          <span className="step-sep">➔</span>
          <button className={`step-tab ${currentStep === 2 ? 'active' : ''}`} onClick={() => { if(cartItems.length===0){alert("Bag is empty"); return;} setCurrentStep(2); }}>
            2. Delivery Address
          </button>
          <span className="step-sep">➔</span>
          <button className={`step-tab ${currentStep === 3 ? 'active' : ''}`} onClick={() => { if(!address){alert("Add address first"); setCurrentStep(2); return;} setCurrentStep(3); }}>
            3. Payment Options
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="checkout-main-body">
        
        {/* STEP 1: CART */}
        {currentStep === 1 && (
          <div className="cart-grid-container">
            <div className="cart-items-column">
              <h3>Review Your Bag ({cartItems.length} items)</h3>
              {cartItems.length === 0 ? (
                <div className="empty-state-card">
                  <p>Your bag is empty!</p>
                  <button className="btn-primary" onClick={() => navigate('/')}>Shop Now</button>
                </div>
              ) : (
                <div className="items-list">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="cart-item-card">
                      <img src={item.image} alt={item.title} />
                      <div className="item-details">
                        <span className="item-brand">{item.brand || 'Store Brand'}</span>
                        <h4>{item.title}</h4>
                        <span className="item-price">₹{item.offer_price || item.price}</span>
                      </div>
                      <button className="item-remove-btn" onClick={() => handleRemoveFromCart(idx)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-summary-sidebar">
                <h4>Price Details & Coupons</h4>
                
                <form onSubmit={handleApplyCoupon} className="coupon-box">
                  <div className="coupon-row">
                    <input 
                      type="text" 
                      placeholder="Enter Coupon Code" 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                    />
                    <button type="submit" className="coupon-btn">Apply</button>
                  </div>
                  {couponMessage && <p className={`coupon-text ${discount > 0 ? 'success' : 'error'}`}>{couponMessage}</p>}
                </form>

                <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                {discount > 0 && <div className="summary-row discount"><span>Discount</span><span>-₹{discount}</span></div>}
                <div className="summary-row"><span>Delivery Fee</span><span className="free">FREE</span></div>
                <hr />
                <div className="summary-row total"><span>Total Payable</span><span>₹{totalAmount}</span></div>
                
                <button className="btn-primary full-width" onClick={() => setCurrentStep(2)}>
                  Proceed to Address ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: ADDRESS */}
        {currentStep === 2 && (
          <div className="form-card-container">
            <h3>Select Delivery Address</h3>
            {address && !showAddressForm ? (
              <div className="address-display-box">
                <p><strong>Deliver to:</strong> {address.address}, {address.city} - {address.pincode}</p>
                <p><strong>Phone:</strong> {address.phone}</p>
                <div className="action-row">
                  <button className="btn-primary" onClick={() => setCurrentStep(3)}>Deliver Here & Continue</button>
                  <button className="btn-secondary" onClick={() => setShowAddressForm(true)}>Edit Address</button>
                </div>
              </div>
            ) : (
              <form className="modern-form" onSubmit={handleSaveAddress}>
                <div className="input-group">
                  <label>Street Address</label>
                  <input type="text" required placeholder="House no, Street, Area" value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} />
                </div>
                <div className="input-row-2">
                  <div className="input-group">
                    <label>City</label>
                    <input type="text" required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label>Pincode</label>
                    <input type="text" required placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="text" required placeholder="Phone number" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                </div>
                <div className="action-row space-btwn">
                  {address && <button type="button" className="btn-secondary" onClick={() => setShowAddressForm(false)}>Cancel</button>}
                  <button type="submit" className="btn-primary full-width">Save & Proceed to Review</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* STEP 3: PAYMENT (Online payment options dikhenge, par place karte waqt error dega agar select kiya toh) */}
        {currentStep === 3 && (
          <div className="form-card-container">
            <h3>Select Payment Method</h3>
            {address && (
              <div className="address-pill-mini">
                📍 Delivering to: <strong>{address.address}, {address.city}</strong>
              </div>
            )}
            
            <div className="payment-options-stack">
              <label className={`pay-option-card ${paymentMethod === 'online' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'online'} 
                  onChange={() => { setPaymentMethod('online'); setPaymentError(''); }} 
                />
                <div>
                  <strong>Online Payment (UPI / Credit / Debit Card) 💳</strong>
                  <p>Pay securely via Google Pay, PhonePe, Cards or NetBanking.</p>
                </div>
              </label>

              <label className={`pay-option-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => { setPaymentMethod('cod'); setPaymentError(''); }} 
                />
                <div>
                  <strong>Cash on Delivery (COD) 💵</strong>
                  <p>Pay with cash when your order arrives at your doorstep.</p>
                </div>
              </label>
            </div>

            {paymentError && (
              <div className="payment-error-banner">
                {paymentError}
              </div>
            )}

            {/* Coupon Option inside payment step */}
            <div className="payment-coupon-section">
              <form onSubmit={handleApplyCoupon} className="coupon-row">
                <input 
                  type="text" 
                  placeholder="Enter coupon code (e.g. SAVE20)" 
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value)} 
                />
                <button type="submit" className="coupon-btn">Apply</button>
              </form>
              {couponMessage && <p className={`coupon-text ${discount > 0 ? 'success' : 'error'}`}>{couponMessage}</p>}
            </div>

            <div className="action-row space-btwn" style={{ marginTop: '1.5rem' }}>
              <button className="btn-secondary" onClick={() => setCurrentStep(2)}>Back</button>
              <button className="btn-primary" onClick={handleConfirmOrder}>
                Place Order Now (₹{totalAmount})
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MY ORDERS & DETAILED TIMELINE TRACKER */}
        {currentStep === 4 && (
          <div className="orders-container">
            <h3>My Orders & Live Tracking</h3>
            {orders.length === 0 ? (
              <div className="empty-state-card">
                <p>No orders history found.</p>
                <button className="btn-primary" onClick={() => setCurrentStep(1)}>Start Shopping</button>
              </div>
            ) : (
              orders.map((ord, idx) => (
                <div key={idx} className="order-card-item">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">ID: {ord.id}</span>
                      <p className="order-subinfo">Placed on: {ord.date} | Payment: {ord.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <span className="order-price-tag">₹{ord.totalAmount}</span>
                      <span className={`status-badge ${ord.status.toLowerCase().replace(/\s+/g, '')}`}>{ord.status}</span>
                    </div>
                  </div>
                  <div className="order-products-preview">
                    <strong>Items:</strong> {ord.items.map(i => i.title).join(', ')}
                  </div>

                  {/* Delivery Timeline Tracker */}
                  {ord.status !== 'Cancelled' && (
                    <div className="order-timeline-tracker">
                      <div className="timeline-header-info">
                        <span>Expected Delivery By: <strong>{ord.estimatedDelivery}</strong></span>
                      </div>
                      <div className="tracker-steps-row">
                        <div className="track-step completed">
                          <div className="bullet">✓</div>
                          <span>Order Placed</span>
                        </div>
                        <div className="track-line active"></div>
                        <div className="track-step active">
                          <div className="bullet">📦</div>
                          <span>Packed</span>
                        </div>
                        <div className="track-line"></div>
                        <div className="track-step">
                          <div className="bullet">🚚</div>
                          <span>Shipped</span>
                        </div>
                        <div className="track-line"></div>
                        <div className="track-step">
                          <div className="bullet">🏠</div>
                          <span>Delivered</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="order-card-actions">
                    {ord.status === 'Order Placed' && (
                      <button className="btn-action cancel" onClick={() => handleCancelOrder(ord.id)}>Cancel Order ❌</button>
                    )}
                    <button className="btn-action remove" onClick={() => handleRemoveOrderHistory(ord.id)}>Remove from History 🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
};