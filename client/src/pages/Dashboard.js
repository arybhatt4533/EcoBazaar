import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from './brand-logo.png';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 1. User Greeting State ---
  const [userName, setUserName] = useState('Arybhatt');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // 3 seconds (3000 ms) ke baad popup hide ho jayega
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // --- 2. Wishlist State & Logic ---
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('userWishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // --- 3. Flash Deals Countdown Timer State ---
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 35 });

  // --- 4. Recently Viewed Products State ---
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('recentlyViewedProducts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // --- 5. Customer Reviews Data ---
  const reviewsData = [
    { id: 1, name: "Aarav Sharma", comment: "Amazing eco-friendly quality! Fast delivery too.", rating: 5 },
    { id: 2, name: "Priya Verma", comment: "Loved the sustainable packaging and fabric feel.", rating: 5 },
    { id: 3, name: "Rahul Singh", comment: "Great collection and genuine green products.", rating: 4 }
  ];

  // --- 6. Sorting State ---
  const [sortBy, setSortBy] = useState('default');

  // --- 7. Quick View Modal State ---
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Fashion slides data
  const slidesData = [
    {
      title: "BIG FASHION FESTIVAL",
      subtitle: "50% - 80% Off | Top Clothing Brands",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "TRENDY STREETWEAR",
      subtitle: "New Styles | Hoodies, Jackets & Denims",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "ETHNIC & PARTY WEAR",
      subtitle: "Flat 40% OFF | Elegant Kurtas & Dresses",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
    },
    {
      title: "CASUAL WEAR COLLECTION",
      subtitle: "Flat 30% OFF | Elegant Casual Outfits",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS8X38EO7TBcQ2bQn9kLJ5G0VkAH7G2f-l00gPFKNJTw&s=10"
    },
    {
      title: "OFFICIAL WEAR COLLECTION",
      subtitle: "Flat 30% OFF | Elegant Office Outfits",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVJxJwaGZVB3nkQ9olBTziRIcCsFmBgwIROvDFw1eotg&s=10"
    },
    {
      title: "HOT FASHION ",
      subtitle: "50% - 80% Off | Top Clothing Brands",
      image: "https://media.istockphoto.com/id/637230232/photo/girl-on-the-rooftop.jpg?s=612x612&w=0&k=20&c=eiCtSKFLJc5AG1rekQjk7XCMJ5irePGQJOkMNog5HZk="
    }
  ];

  // States for products, search, and category filtering
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch user name from LocalStorage (Feature 1)
  useEffect(() => {
    const storedUser = localStorage.getItem('userName') || localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name);
        } else if (typeof storedUser === 'string') {
          setUserName(storedUser);
        }
      } catch (e) {
        setUserName(storedUser);
      }
    }
  }, []);

  // Save wishlist to LocalStorage (Feature 2)
  useEffect(() => {
    localStorage.setItem('userWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toggle Wishlist Function (Feature 2)
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Flash Deals Countdown Timer Effect (Feature 3)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Save Recently Viewed to LocalStorage (Feature 4)
  useEffect(() => {
    localStorage.setItem('recentlyViewedProducts', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add to Recently Viewed Handler (Feature 4)
  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Keep max 5 items
    });
  };

  // Auto slide change every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slidesData.length]);

  // Fetch products from backend
  useEffect(() => {
    const fetchDashboardProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        if (res.data && res.data.length > 0) {
          const formattedProducts = res.data.map(item => ({
            id: item.id || item._id,
            brand: item.brand || 'FashionBrand',
            title: item.title || item.name || 'Stylish Outfit',
            description: item.description || '',
            category: item.category || 'Men Clothing',
            sizes: item.sizes || 'S, M, L, XL',
            price: item.price || 999,
            offer_price: item.offer_price || 499,
            rating: item.rating || '4.5',
            image: item.image ? (item.image.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`) : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
          }));
          setProducts(formattedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch products from server, loading fallback", err);
      }
    };

    fetchDashboardProducts();
  }, []);

  // Filter, Search & Sort Logic (Features 6)
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    const priceA = a.offer_price || a.price;
    const priceB = b.offer_price || b.price;
    if (sortBy === 'lowToHigh') return priceA - priceB;
    if (sortBy === 'highToLow') return priceB - priceA;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default
  });

  return (
    <div className="dashboard-wrapper" style={{ backgroundColor: '#d9c3b2' }}>

      {/* Navbar */}
      <header className="eco-header">
        <div className="nav-left">
          <div className="logo-container">
            <img src={logoImg} alt="EcoBazaar Logo" className="nav-logo-img" />
          </div>
          <ul className="nav-links">
            <li><Link to="/dashboard">Men</Link></li>
            <li><Link to="/dashboard">Women</Link></li>
            <li><Link to="/dashboard">Kids</Link></li>
            <li>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const user = JSON.parse(localStorage.getItem('user'));

                  if (!user || !user.id) {
                    alert('Please login first to access the Seller Portal!');
                    navigate('/login');
                    return;
                  }

                  const isSeller = localStorage.getItem('isSeller') === 'true' || user.role === 'seller';

                  if (isSeller) {
                    navigate('/seller');
                  } else {
                    alert('Please register/login as a Seller first!');
                    navigate('/Login'); // Ya jo bhi route tune seller registration ke liye banaya ho
                  }
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3f6c', fontWeight: 'bold', fontSize: '15px', padding: 0 }}
              >
                Seller Portal
              </button>
            </li>
          </ul>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" className="search-input" placeholder="Search for products, brands and more" />
          </div>
        </div>

        <div className="nav-right">
          <Link className="nav-action" to="/checkout">
            <i className="fa-solid fa-bag-shopping"></i>
            🤵🏼Profile
          </Link>
        </div>
      </header>
      {/* Feature 1: Auto-Hiding Welcome Popup Banner */}
      {showWelcome && (
        <div className="welcome-popup-banner">
          <div className="welcome-popup-text">
            <h1>Welcome back, {userName}! 🛒</h1>
            <p>Explore our latest eco-friendly collection.</p>
          </div>
          <div className="welcome-popup-badge">
            <span>🤵🏼 Member</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="container">

        {/* Banner Slider Section */}
        <div className="banner-slider">
          {slidesData.map((slide, index) => (
            <div className={`slide ${currentSlide === index ? 'active' : ''}`} key={index}>
              <div className="banner-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Link to="/checkout" className="explore-btn">EXPLORE NOW</Link>
              </div>
              <div className="banner-image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          ))}
        </div>
        <div className="weather-section">
          <h2 className="section-header-title">Shop By Weather & Season</h2>
          <div className="weather-grid">

            {/* Card 1: Summer */}
            <div className="weather-card" onClick={() => navigate('/category/summer')}>
              <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" alt="Summer Breeze" />
              <div className="weather-overlay">
                <span>☀️ Summer Breeze</span>
                <h3>Light Linen & Cotton</h3>
                <p>Breathable outfits for hot days</p>
              </div>
            </div>

            {/* Card 2: Monsoon */}
            <div className="weather-card" onClick={() => navigate('/category/monsoon')}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy9DAbeKzMwf7Ku7F7y1aFi7pXcWSJoDJa3Mqk-FoMfQ&s=10" alt="Monsoon Comfort" />
              <div className="weather-overlay">
                <span>🌧️ Monsoon Comfort</span>
                <h3>Quick-Dry Fabrics</h3>
                <p>Stay cozy and stylish in rains</p>
              </div>
            </div>

            {/* Card 3: Winter */}
            <div className="weather-card" onClick={() => navigate('/category/winter')}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdgW9qgHqUA_YMQoNViM57ryjMz7uLZ-7WiZOjuSgW-g&s=10" alt="Winter Earth" />
              <div className="weather-overlay">
                <span>❄️ Earth Knitwear</span>
                <h3>Recycled Wool & Knits</h3>
                <p>Warm layers made sustainably</p>
              </div>
            </div>

          </div>
        </div>

        {/* Myntra Style WOW Deals Slider Section */}
        <div className="promo-slider-section">
          <div className="promo-section-title">
            <span>🤩</span> WOW DEALS <span style={{ fontSize: '13px', fontWeight: '400', color: '#64748b' }}>| Big Brands, Even Bigger Savings</span>
          </div>

          <div className="promo-slider-track">

            {/* Card 1: Footwear */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Casual Sneakers" />
                <div className="promo-overlay-content">
                  <h3>Casual-Day Picks</h3>
                  <p>MIN. 50% OFF</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>KAKA RABBIT</span>
                <span className="brand-divider">&</span>
                <span>U.S. POLO</span>
              </div>
            </div>

            {/* Card 2: Watches */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" alt="Precision Watches" />
                <div className="promo-overlay-content">
                  <h3>Precision Crafted</h3>
                  <p>20-50% OFF</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>CASIO</span>
                <span className="brand-divider">&</span>
                <span>TITAN</span>
              </div>
            </div>

            {/* Card 3: Skincare / Beauty */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300" alt="Herbal Bliss" />
                <div className="promo-overlay-content">
                  <h3>Herbal Bliss</h3>
                  <p>MIN. 25% OFF</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>KAMA</span>
                <span className="brand-divider">&</span>
                <span>BIOTIQUE</span>
              </div>
            </div>

            {/* Card 4: Sportswear */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_J30XhvqiKRgmVYef9BPBhtqoozZXhlLTT11syiWSKQ&s" alt="Sportswear" />
                <div className="promo-overlay-content">
                  <h3>Active Wear</h3>
                  <p>MIN. 45% OFF</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>adidas</span>
                <span className="brand-divider">&</span>
                <span>PUMA</span>
              </div>
            </div>

            {/* Card 5: Home & Kitchen */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300" alt="Cookware" />
                <div className="promo-overlay-content">
                  <h3>Durable Cookware</h3>
                  <p>Under ₹1599</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>Pigeon</span>
                <span className="brand-divider">&</span>
                <span>Prestige</span>
              </div>
            </div>

            {/* Card 6: Luxury Fashion */}
            <div className="promo-banner-card">
              <div className="promo-card-top">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-QGNtUbQpftsXNW5tvyojEPd6G35EHSaQ4AXa4IrX6g&s=10" alt="Luxury Fashion" />
                <div className="promo-overlay-content">
                  <h3>Luxury Fashion</h3>
                  <p>MIN. 30% OFF</p>
                </div>
              </div>
              <div className="promo-brand-footer">
                <span>ZARA</span>
                <span className="brand-divider">&</span>
                <span>H&M</span>
              </div>
            </div>
          </div>
        </div>
        {/* Feature 3: Flash Deals / Countdown Timer Section */}
        <div className="flash-deals-section">
          <div className="flash-deals-header">
            <div className="flash-title-wrapper">
              <h2>⚡ Flash Deals</h2>
              <p>Limited-time sustainable offers, grab them before they expire!</p>
            </div>
            <div className="countdown-timer">
              <span className="time-box">{String(timeLeft.hours).padStart(2, '0')}</span> :
              <span className="time-box">{String(timeLeft.minutes).padStart(2, '0')}</span> :
              <span className="time-box">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="bento-banner-container">
          {/* Left Big Main Hero Banner */}
          <div className="bento-main-hero" onClick={() => navigate('/category/ethnic')}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNoBRet5XKltaEQIVdfumVF93inQ87zOj0YkJeRp5ZpA&s=10" alt="Sustainable Ethnic Wear" />
            <div className="bento-overlay">
              <span>✨ Exclusive Collection</span>
              <h2>Sustainably Crafted Ethnic Wear</h2>
              <p>Flat 40% OFF on Elegant Kurtas & Handcrafted Dresses</p>
            </div>
          </div>

          {/* Right Stacked Mini Banners */}
          <div className="bento-side-stack">
            <div className="bento-sub-banner" onClick={() => navigate('/category/denims')}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMvlvqkrDfijKqmMrIZGDBajcpQxcV47xuU5pDoSGHKA&s=10" alt="Casual Denims" />
              <div className="bento-overlay" style={{ padding: '16px' }}>
                <span style={{ background: '#2e7d32' }}>🌿 Eco Denims</span>
                <h3 style={{ fontSize: '16px', margin: '0 0 2px 0' }}>Casual Denims</h3>
                <p style={{ fontSize: '11px' }}>Min. 50% OFF</p>
              </div>
            </div>

            <div className="bento-sub-banner" onClick={() => navigate('/category/jackets')}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStavAM-28gGdSEexJ-hZAyr6IfkxcTVO-ZXd4UsfOg5g&s=10://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" alt="Winter Jackets" />
              <div className="bento-overlay" style={{ padding: '16px' }}>
                <span style={{ background: '#00acc1' }}>❄️ Earth Knit</span>
                <h3 style={{ fontSize: '16px', margin: '0 0 2px 0' }}>Stylish Jackets</h3>
                <p style={{ fontSize: '11px' }}>Starting at ₹699</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- Glassmorphism USP Floating Strip --- */}
        <div className="glass-usp-bar">
          <div className="usp-item">
            <span className="usp-icon">🌱</span>
            <span>100% Organic Cotton</span>
          </div>
          <div className="usp-item">
            <span className="usp-icon">♻️</span>
            <span>Zero Plastic Packaging</span>
          </div>
          <div className="usp-item">
            <span className="usp-icon">🔄</span>
            <span>7-Days Easy Return</span>
          </div>
        </div>
        {/* Premium Search, Category Filter & Sorting Bar */}
        <div className="filter-search-section">
          <div className="filter-top-row">
            <h2 className="section-title">Trending Clothing Styles</h2>

            {/* Search Box */}
            <div className="trending-search-box">
              <i className="fa-solid fa-magnifying-glass trending-search-icon"></i>
              <input
                type="text"
                className="trending-search-input"
                placeholder="Search items by name, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="trending-clear-btn"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Pills & Sorting Dropdown Row */}
          <div className="filter-bottom-row">
            {/* Category Filter Pills */}
            <div className="category-filters">
              {['All', 'Men Clothing', 'Women Clothing', 'Kids', 'Home', 'Beauty', 'Footwear'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="sorting-container">
              <label htmlFor="sortSelect">Sort By: </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="default">Default</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>
        {/* Product Grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', padding: '10px 0' }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const hasOffer = product.offer_price && Number(product.offer_price) < Number(product.price);

              return (
                <div className="product-card" key={product.id || product._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '14px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#fff', padding: '2px 6px', fontSize: '12px', fontWeight: 'bold', borderRadius: '4px', zIndex: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      ★ {product.rating || '4.5'}
                    </span>
                    <img
                      src={product.image?.startsWith('http') ? product.image : `http://localhost:5000/${product.image}`}
                      alt={product.title}
                      style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <span className="product-badge badge-eco">🌳 100% Eco-Friendly</span>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#282c3f', margin: '4px 0', textTransform: 'uppercase' }}>
                      {product.brand}
                    </h4>

                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#333', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title || product.name}
                    </p>

                    {product.sizes && (
                      <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px', background: '#f8f9fa', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', border: '1px solid #e2e8f0' }}>
                        Sizes: <strong style={{ color: '#ff3f6c' }}>{product.sizes}</strong>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {hasOffer ? (
                        <>
                          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>₹{product.offer_price}</span>
                          <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>₹{product.price}</span>
                          <span style={{ fontSize: '11px', color: '#ff3f6c', fontWeight: 'bold' }}>SPECIAL PRICE</span>
                        </>
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>₹{product.price}</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>

                      {/* --- 1. Add to Cart Button --- */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          try {
                            // Cart items ko localStorage mein save karne ka logic
                            const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];

                            // Check karo kya product pehle se cart me hai
                            const productIndex = existingCart.findIndex(item => (item.id || item._id) === (product.id || product._id));

                            if (productIndex > -1) {
                              existingCart[productIndex].quantity = (existingCart[productIndex].quantity || 1) + 1;
                            } else {
                              existingCart.push({ ...product, quantity: 1 });
                            }

                            localStorage.setItem('cartItems', JSON.stringify(existingCart));
                            alert(`Added ${product.title} to cart successfully! 🛒`);
                          } catch (err) {
                            console.error("Cart error:", err);
                          }
                        }}
                        style={{ flex: 1, padding: '8px', background: '#fff', border: '1px solid #ff3f6c', color: '#ff3f6c', fontWeight: 'bold', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Add to Cart
                      </button>

                      {/* --- 2. Buy Now Button --- */}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const user = JSON.parse(localStorage.getItem('user'));
                            if (!user || !user.id) {
                              alert('Please login first!');
                              navigate('/login');
                              return;
                            }

                            // 1. Jaise Add to Cart karta hai, waise hi cart items fetch/update karo
                            const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
                            const productIndex = existingCart.findIndex(item => (item.id || item._id) === (product.id || product._id));

                            if (productIndex > -1) {
                              existingCart[productIndex].quantity = (existingCart[productIndex].quantity || 1) + 1;
                            } else {
                              existingCart.push({ ...product, quantity: 1 });
                            }

                            // 2. LocalStorage mein cart save kar do
                            localStorage.setItem('cartItems', JSON.stringify(existingCart));

                            // 3. Seedha profile/dashboard page par bhej do jahan apna CheckoutCart component chal raha hai
                            navigate('/checkout'); // Agar tumhara profile route kuch aur hai (jaise '/dashboard' ya '/account'), toh wo yahan likh dena
                          } catch (err) {
                            console.error("Buy Now error:", err);
                            alert('Something went wrong!');
                          }
                        }}
                        style={{ flex: 1, padding: '8px', background: '#ff3f6c', border: 'none', color: '#fff', fontWeight: 'bold', fontSize: '12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Buy Now
                      </button>
                      {/* Wishlist Button */}
                      <button
                        className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        {wishlist.includes(product.id) ? '❤️' : '🤍'}
                      </button>

                      <button
                        className="quick-view-trigger-btn"
                        onClick={() => {
                          setQuickViewProduct(product);
                          addToRecentlyViewed(product);
                        }}
                      >
                        Quick View 👁️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-products-found">
              <i className="fa-solid fa-box-open" style={{ fontSize: '32px', marginBottom: '10px', color: '#a0aec0' }}></i>
              <p>No products found matching your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
      {/* Feature 5: Customer Reviews & Testimonials Section */}
      <div className="testimonials-section">
        <h3 className="section-title">⭐ What Our Eco-Buyers Say</h3>
        <div className="testimonials-grid">
          {reviewsData.map((review) => (
            <div key={review.id} className="testimonial-card">
              <div className="testimonial-rating">
                {"⭐".repeat(review.rating)}
              </div>
              <p className="testimonial-comment">"{review.comment}"</p>
              <h5 className="testimonial-author">- {review.name}</h5>
            </div>
          ))}
        </div>
        {/* Feature 7: Interactive Quick View Modal */}
        {quickViewProduct && (
          <div className="quick-view-overlay" onClick={() => setQuickViewProduct(null)}>
            <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setQuickViewProduct(null)}>&times;</button>
              <div className="modal-content-grid">
                <div className="modal-image-box">
                  <img src={quickViewProduct.image} alt={quickViewProduct.title} />
                </div>
                <div className="modal-details-box">
                  <span className="modal-brand">{quickViewProduct.brand}</span>
                  <h2>{quickViewProduct.title}</h2>
                  <div className="modal-rating">⭐ {quickViewProduct.rating}</div>
                  <div className="modal-price-box">
                    <span className="modal-offer-price">₹{quickViewProduct.offer_price || quickViewProduct.price}</span>
                    {quickViewProduct.offer_price && (
                      <span className="modal-original-price">₹{quickViewProduct.price}</span>
                    )}
                  </div>
                  <p className="modal-desc">{quickViewProduct.description || "A wonderful eco-friendly fashion piece designed for sustainable style and everyday comfort."}</p>

                  <div className="modal-sizes">
                    <label>Available Sizes:</label>
                    <div className="size-pills">
                      {(quickViewProduct.sizes || "S, M, L, XL").split(',').map(size => (
                        <span key={size.trim()} className="size-badge">{size.trim()}</span>
                      ))}
                    </div>
                  </div>

                  <button className="modal-add-to-cart-btn" onClick={() => {
                    alert(`Added ${quickViewProduct.title} to cart successfully! 🛒`);
                    setQuickViewProduct(null);
                  }}>
                    Add to Cart 🛒
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="eco-footer">
        <div className="footer-container">

          {/* Column 1: Online Shopping */}
          <div className="footer-section">
            <h3>ONLINE SHOPPING</h3>
            <ul>
              <li><Link to="/dashboard">Men's Clothing</Link></li>
              <li><Link to="/dashboard">Women's Clothing</Link></li>
              <li><Link to="/dashboard">Kid's Wear</Link></li>
              <li>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const user = JSON.parse(localStorage.getItem('user'));

                    if (!user || !user.id) {
                      alert('Please login first to access the Seller Portal!');
                      navigate('/login');
                      return;
                    }

                    const isSeller = localStorage.getItem('isSeller') === 'true' || user.role === 'seller';

                    if (isSeller) {
                      navigate('/seller');
                    } else {
                      alert('Please register/login as a Seller first!');
                      navigate('/seller-login');
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#696e79', fontSize: '13px', padding: 0, textAlign: 'left' }}
                >
                  Seller Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Policies */}
          <div className="footer-section">
            <h3>CUSTOMER POLICIES</h3>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#terms">Terms Of Use</a></li>
              <li><a href="#shipping">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* Column 3: Contact & Office Details */}
          <div className="footer-section">
            <h3>OFFICE & CONTACT</h3>
            <p className="footer-text">📍 Office: Sector 62, Noida, Uttar Pradesh</p>
            <p className="footer-text">📞 Phone: +91 9517471194</p>
            <p className="footer-text">✉️ Email: bhattarya4533@gmail.com</p>
          </div>

          {/* Column 4: Experience App */}
          <div className="footer-section">
            <h3>EXPERIENCE APP</h3>
            <p className="footer-text">Get real-time order tracking and exclusive fashion offers right on your device.</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 EcoBazaar Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};