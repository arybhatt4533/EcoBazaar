import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/brand.png';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedSizes, setSelectedSizes] = useState({});

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
    <div className="dashboard-wrapper" style={{ backgroundColor: '#ecd7c6' }}>

      <header className="eco-header">

        {/* LEFT */}
        <div className="nav-left">

          <Link to="/dashboard" className="logo-container">
            <img
              src={logoImg}
              alt="EcoBazaar Logo"
              className="nav-logo-img"
            />
          </Link>

          <ul className="nav-links">

            <li>
              <Link to="/dashboard">Men</Link>
            </li>

            <li>
              <Link to="/dashboard">Women</Link>
            </li>

            <li>
              <Link to="/dashboard">Kids</Link>
            </li>

            <li>
              <button
                className="seller-portal-btn"
                onClick={(e) => {
                  e.preventDefault();

                  const user = JSON.parse(
                    localStorage.getItem('user')
                  );

                  if (!user || !user.id) {
                    alert(
                      'Please login first to access the Seller Portal!'
                    );
                    navigate('/login');
                    return;
                  }

                  const isSeller =
                    localStorage.getItem('isSeller') === 'true' ||
                    user.role === 'seller';

                  if (isSeller) {
                    navigate('/seller');
                  } else {
                    alert(
                      'Please register/login as a Seller first!'
                    );
                    navigate('/login');
                  }
                }}
              >
                <span>🏪</span>
                Seller Portal
              </button>
            </li>

          </ul>

        </div>


        {/* SEARCH */}
        <div className="nav-center">

          <div className="search-bar">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              className="search-input"
              placeholder="Search for products, brands and more"
            />

            <button className="search-btn">
              Search
            </button>

          </div>

        </div>


        {/* RIGHT */}
        <div className="nav-right">

          <Link
            className="nav-profile"
            to="/checkout"
          >

            <span className="profile-icon">
              👤
            </span>

            <span className="profile-text">
              Profile
            </span>

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
        {/* =====================================================
    FEATURE 3: PREMIUM FLASH DEALS
===================================================== */}

        <div className="flash-deals-section">

          <div className="flash-deals-content">

            {/* LEFT SIDE */}
            <div className="flash-deals-left">

              <div className="flash-live-badge">
                <span className="live-dot"></span>
                LIVE DEAL
              </div>

              <div className="flash-title-row">
                <span className="flash-bolt">⚡</span>

                <div>
                  <h2>Flash Deals</h2>

                  <p>
                    Limited-time sustainable offers.
                    Grab your favourites before they disappear!
                  </p>
                </div>
              </div>

            </div>


            {/* RIGHT SIDE */}
            <div className="flash-deals-right">

              <div className="ending-text">
                <span>ENDS IN</span>
                <strong>Hurry! Limited Time</strong>
              </div>


              <div className="countdown-timer">

                <div className="countdown-unit">
                  <span className="time-box">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <small>HOURS</small>
                </div>

                <span className="timer-colon">:</span>

                <div className="countdown-unit">
                  <span className="time-box">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <small>MINUTES</small>
                </div>

                <span className="timer-colon">:</span>

                <div className="countdown-unit">
                  <span className="time-box">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <small>SECONDS</small>
                </div>

              </div>

            </div>

          </div>


          {/* BOTTOM DEAL INFO */}

          <div className="flash-deals-bottom">

            <span>🌱 Eco-friendly products</span>

            <span>♻️ Sustainable choices</span>

            <span>🔥 Limited stock</span>

            <span className="flash-shop-text">
              Shop Deals →
            </span>

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


        {/* =====================================================
    ECOBAZAAR — PREMIUM USP + TRENDING SECTION
===================================================== */}

        <div className="glass-usp-bar">

          <div className="usp-item">
            <div className="usp-icon-box">
              🌱
            </div>

            <div className="usp-content">
              <strong>100% Organic Cotton</strong>
              <span>Soft & planet friendly</span>
            </div>
          </div>


          <div className="usp-divider"></div>


          <div className="usp-item">
            <div className="usp-icon-box">
              ♻️
            </div>

            <div className="usp-content">
              <strong>Zero Plastic Packaging</strong>
              <span>Better for our planet</span>
            </div>
          </div>


          <div className="usp-divider"></div>


          <div className="usp-item">
            <div className="usp-icon-box">
              🔄
            </div>

            <div className="usp-content">
              <strong>7-Days Easy Return</strong>
              <span>Shop with confidence</span>
            </div>
          </div>

        </div>


        {/* =====================================================
    PREMIUM SEARCH + FILTER
===================================================== */}

        <div className="filter-search-section">

          {/* TOP SECTION */}

          <div className="filter-top-row">

            <div className="trending-heading">

              <span className="trending-eyebrow">
                ✦ ECOBAZAAR COLLECTION
              </span>

              <h2 className="section-title">
                Trending Clothing Styles
              </h2>

              <p>
                Discover sustainable styles curated just for you.
              </p>

            </div>


            {/* SEARCH */}

            <div className="trending-search-box">

              <i className="fa-solid fa-magnifying-glass trending-search-icon"></i>

              <input
                type="text"
                className="trending-search-input"
                placeholder="Search products, brands..."
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


          {/* DIVIDER */}

          <div className="filter-main-divider"></div>


          {/* BOTTOM */}

          <div className="filter-bottom-row">


            {/* CATEGORY */}

            <div className="category-area">

              <span className="category-label">
                SHOP BY CATEGORY
              </span>

              <div className="category-filters">

                {[
                  'All',
                  'Men Clothing',
                  'Women Clothing',
                  'Kids',
                  'Home',
                  'Beauty',
                  'Footwear'
                ].map((cat) => (

                  <button
                    key={cat}
                    className={`filter-pill ${selectedCategory === cat ? 'active' : ''
                      }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>

                ))}

              </div>

            </div>


            {/* SORT */}

            <div className="sorting-container">

              <span className="sort-label">
                SORT BY
              </span>

              <div className="sort-select-wrapper">

                <i className="fa-solid fa-sliders sort-icon"></i>

                <select
                  id="sortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-dropdown"
                >
                  <option value="default">
                    Recommended
                  </option>

                  <option value="lowToHigh">
                    Price: Low to High
                  </option>

                  <option value="highToLow">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Customer Rating
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>
        {/* =========================================================
    PREMIUM PRODUCT GRID
========================================================= */}

        <div className="product-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((product) => {

              const productId = product.id || product._id;

              const hasOffer =
                product.offer_price &&
                Number(product.offer_price) < Number(product.price);

              const currentPrice = hasOffer
                ? Number(product.offer_price)
                : Number(product.price);

              const originalPrice = Number(product.price);

              const discount =
                hasOffer && originalPrice > 0
                  ? Math.round(
                    ((originalPrice - currentPrice) / originalPrice) * 100
                  )
                  : 0;

              const productSizes = product.sizes
                ? String(product.sizes)
                  .split(',')
                  .map((size) => size.trim())
                  .filter(Boolean)
                : [];

              return (

                <article
                  className="eco-product-card"
                  key={productId}
                >

                  {/* =================================================
              IMAGE
          ================================================= */}

                  <div className="eco-product-image-wrap">

                    <img
                      src={
                        product.image?.startsWith('http')
                          ? product.image
                          : `http://localhost:5000/${product.image}`
                      }
                      alt={product.title || product.name || 'Product'}
                      className="eco-product-image"
                    />

                    {/* Eco Badge */}

                    <div className="eco-product-badge">
                      🌿 100% ECO
                    </div>


                    {/* Wishlist */}

                    <button
                      type="button"
                      className={`eco-wishlist-btn ${wishlist.includes(productId)
                        ? 'wishlist-active'
                        : ''
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(productId);
                      }}
                      title={
                        wishlist.includes(productId)
                          ? 'Remove from Wishlist'
                          : 'Add to Wishlist'
                      }
                    >
                      {wishlist.includes(productId) ? '♥' : '♡'}
                    </button>


                    {/* Rating */}

                    <div className="eco-rating">
                      <span>★</span>
                      {product.rating || '4.5'}
                    </div>

                  </div>


                  {/* =================================================
              PRODUCT CONTENT
          ================================================= */}

                  <div className="eco-product-content">


                    {/* Brand */}

                    <div className="eco-product-brand">
                      {product.brand || 'EcoBazaar'}
                    </div>


                    {/* Product Name */}

                    <h3 className="eco-product-title">
                      {product.title || product.name}
                    </h3>


                    {/* =================================================
                SIZE SELECTOR
            ================================================= */}

                    {productSizes.length > 0 && (

                      <div className="eco-size-section">

                        <div className="eco-size-header">
                          <span>SELECT SIZE</span>

                          <span className="eco-size-guide">
                            Size Guide
                          </span>
                        </div>


                        <div className="eco-size-options">

                          {productSizes.map((size) => (

                            <button
                              key={size}
                              type="button"
                              className={`eco-size-btn ${selectedSizes?.[productId] === size
                                ? 'size-selected'
                                : ''
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();

                                setSelectedSizes((prev) => ({
                                  ...prev,
                                  [productId]: size
                                }));
                              }}
                            >
                              {size}
                            </button>

                          ))}

                        </div>

                      </div>

                    )}


                    {/* =================================================
                PRICE
            ================================================= */}

                    <div className="eco-price-row">

                      <div className="eco-price-main">

                        <span className="eco-current-price">
                          ₹{currentPrice.toFixed(2)}
                        </span>

                        {hasOffer && (

                          <span className="eco-old-price">
                            ₹{originalPrice.toFixed(2)}
                          </span>

                        )}

                      </div>


                      {hasOffer && (

                        <span className="eco-discount">
                          {discount}% OFF
                        </span>

                      )}

                    </div>


                    {/* =================================================
                ACTION BUTTONS
            ================================================= */}

                    <div className="eco-product-actions">


                      {/* Add Cart */}

                      <button
                        type="button"
                        className="eco-add-cart-btn"
                        onClick={(e) => {

                          e.stopPropagation();

                          try {

                            const existingCart =
                              JSON.parse(
                                localStorage.getItem('cartItems')
                              ) || [];


                            const productIndex =
                              existingCart.findIndex(
                                (item) =>
                                  (item.id || item._id) === productId
                              );


                            if (productIndex > -1) {

                              existingCart[productIndex].quantity =
                                (existingCart[productIndex].quantity || 1) + 1;

                            } else {

                              existingCart.push({
                                ...product,
                                selectedSize:
                                  selectedSizes?.[productId] || null,
                                quantity: 1
                              });

                            }


                            localStorage.setItem(
                              'cartItems',
                              JSON.stringify(existingCart)
                            );


                            alert(
                              `${product.title || product.name} added to cart! 🛒`
                            );

                          } catch (err) {

                            console.error(
                              'Cart error:',
                              err
                            );

                            alert(
                              'Unable to add product to cart.'
                            );

                          }

                        }}
                      >
                        <span>🛒</span>
                        Add to Cart
                      </button>


                      {/* Buy Now */}

                      <button
                        type="button"
                        className="eco-buy-now-btn"
                        onClick={async (e) => {

                          e.stopPropagation();

                          try {

                            const user =
                              JSON.parse(
                                localStorage.getItem('user')
                              );


                            if (!user || !user.id) {

                              alert('Please login first!');

                              navigate('/login');

                              return;

                            }


                            const existingCart =
                              JSON.parse(
                                localStorage.getItem('cartItems')
                              ) || [];


                            const productIndex =
                              existingCart.findIndex(
                                (item) =>
                                  (item.id || item._id) === productId
                              );


                            if (productIndex > -1) {

                              existingCart[productIndex].quantity =
                                (existingCart[productIndex].quantity || 1) + 1;

                            } else {

                              existingCart.push({
                                ...product,
                                selectedSize:
                                  selectedSizes?.[productId] || null,
                                quantity: 1
                              });

                            }


                            localStorage.setItem(
                              'cartItems',
                              JSON.stringify(existingCart)
                            );


                            navigate('/checkout');

                          } catch (err) {

                            console.error(
                              'Buy Now error:',
                              err
                            );

                            alert(
                              'Something went wrong!'
                            );

                          }

                        }}
                      >
                        Buy Now
                        <span>→</span>
                      </button>

                    </div>
                  </div>

                </article>

              );

            })

          ) : (

            /* =====================================================
               NO PRODUCTS
            ===================================================== */

            <div className="eco-no-products">

              <div className="eco-no-products-icon">
                📦
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try another search or select a different category.
              </p>

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