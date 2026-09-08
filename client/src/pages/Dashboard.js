import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- 1. User Greeting State ---
  const [userName, setUserName] = useState('Arybhatt');

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
          <Link to="/dashboard" className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#ff3f6c', letterSpacing: '0.5px' }}>EcoBazaar</span>
          </Link>
          <ul className="nav-links">
            <li><Link to="/dashboard">Men</Link></li>
            <li><Link to="/dashboard">Women</Link></li>
            <li><Link to="/dashboard">Kids</Link></li>
            <li><Link to="/seller" style={{ color: '#ff3f6c' }}>Seller Portal</Link></li>
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
            Profile
          </Link>
        </div>
      </header>
      {/* Feature 1: Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h1>Welcome back, {userName}! 🌱</h1>
          <p>Explore our latest eco-friendly collection built for a sustainable future.</p>
        </div>
        <div className="welcome-badge">
          <span>🌿 EcoBazaar Member</span>
        </div>
      </div>

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

        {/* Multi-Card Promotional Offer Grid */}
        <div className="promo-slider-section">
          <div className="promo-slider-track" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="promo-banner-card" style={{ background: 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 100%)', borderRadius: '12px', padding: '20px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="promo-tag" style={{ background: 'rgba(0,0,0,0.15)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>TRENDING</span>
                <h3 style={{ fontSize: '18px', margin: '8px 0 4px 0' }}>Casual Denims</h3>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>Min. <strong>50% OFF</strong></p>
              </div>
              <img src="https://images.unsplash.com/photo-1542272604-787c96355d54?w=300" alt="Denim" style={{ width: '110px', height: '110px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>

            <div className="promo-banner-card" style={{ background: 'linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)', borderRadius: '12px', padding: '20px', color: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="promo-tag" style={{ background: 'rgba(6, 78, 59, 0.15)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>WINTER WEAR</span>
                <h3 style={{ fontSize: '18px', margin: '8px 0 4px 0' }}>Stylish Jackets</h3>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>Starting at <strong>₹699</strong></p>
              </div>
              <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300" alt="Jacket" style={{ width: '110px', height: '110px', borderRadius: '8px', objectFit: 'cover' }} />
            </div>

            <div className="promo-banner-card" style={{ background: 'linear-gradient(135deg, #fed7aa 0%, #fb923c 100%)', borderRadius: '12px', padding: '20px', color: '#7c2d12', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="promo-tag" style={{ background: 'rgba(124, 45, 18, 0.15)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>FOOTWEAR</span>
                <h3 style={{ fontSize: '18px', margin: '8px 0 4px 0' }}>Sneakers & Shoes</h3>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>Up to <strong>70% OFF</strong></p>
              </div>
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="Shoes" style={{ width: '110px', height: '110px', borderRadius: '8px', objectFit: 'cover' }} />
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

        {/* Sliding Ticker Tape */}
        <div className="ticker-wrapper" style={{ background: '#282c3f', color: '#fff', padding: '12px 0', borderRadius: '8px', overflow: 'hidden', margin: '20px 0' }}>
          <div className="ticker-track" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marqueeScroll 25s linear infinite' }}>
            <div className="ticker-item" style={{ padding: '0 30px' }}>⚡ Flat Extra 20% OFF on First Order Use Code: <span>FASHION20</span></div>
            <div className="ticker-item" style={{ padding: '0 30px' }}>🚚 Free Shipping on All Prepaid Orders Above ₹499</div>
            <div className="ticker-item" style={{ padding: '0 30px' }}>🔄 Easy 7 Days Return & Exchange Available</div>
            <div className="ticker-item" style={{ padding: '0 30px' }}>⚡ Flat Extra 20% OFF on First Order Use Code: <span>FASHION20</span></div>
            <div className="ticker-item" style={{ padding: '0 30px' }}>🚚 Free Shipping on All Prepaid Orders Above ₹499</div>
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

                            // Pehle product ko cart/checkout list me daalo
                            const existingCart = [{ ...product, quantity: 1 }];
                            localStorage.setItem('cartItems', JSON.stringify(existingCart));

                            // Ab check karo ki user ka address saved hai ya nahi database me
                            const res = await axios.get(`http://localhost:5000/api/addresses/${user.id}`);

                            if (res.data && res.data.length > 0) {
                              // Address saved hai -> Seedha Checkout/Payment page
                              navigate('/checkout');
                            } else {
                              // Address nahi hai -> Tab bhejo `/add-address` par
                              alert('Please add your delivery address first!');
                              navigate('/add-address');
                            }
                          } catch (err) {
                            console.error(err);
                            // Fallback agar API fail ho ya address table na mile
                            navigate('/add-address');
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

      <footer className="eco-footer" style={{ background: '#282c3f', color: '#fff', padding: '40px 20px', marginTop: '40px' }}>
        <div className="footer-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#ff3f6c' }}>ONLINE SHOPPING</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><Link to="/dashboard" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Men's Clothing</Link></li>
              <li><Link to="/dashboard" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Women's Clothing</Link></li>
              <li><Link to="/dashboard" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Kid's Wear</Link></li>
              <li><Link to="/seller" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Seller Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#ff3f6c' }}>CUSTOMER POLICIES</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="#contact" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Contact Us</a></li>
              <li><a href="#faq" style={{ color: '#a0a3bd', textDecoration: 'none' }}>FAQ</a></li>
              <li><a href="#terms" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Terms Of Use</a></li>
              <li><a href="#shipping" style={{ color: '#a0a3bd', textDecoration: 'none' }}>Shipping & Returns</a></li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '14px', marginBottom: '15px', color: '#ff3f6c' }}>EXPERIENCE APP</h3>
            <p style={{ color: '#a0a3bd', fontSize: '13px' }}>Get real-time order tracking and exclusive fashion offers.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '12px', color: '#7e8299' }}>
          <p>© 2026 FashionHub Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};