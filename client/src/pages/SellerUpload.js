import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SellerUpload.css';

const SellerUpload = () => {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    brand: '',
    title: '',
    category: 'Men Clothing',
    price: '',
    offerPrice: '',
    sizes: '',
    description: '',
    specifications: ''
  });

  // Image file state for product upload
  const [imageFile, setImageFile] = useState(null);

  // New State for storing uploaded products list
  const [sellerProducts, setSellerProducts] = useState([]);

  // AI Growth Advisor State
  const [growthGoal, setGrowthGoal] = useState('sales');
  const [aiTip, setAiTip] = useState('Select a business goal above to get tailored AI-driven strategies for scaling your green enterprise.');

  const seller = JSON.parse(localStorage.getItem('user'));
  const sellerId = seller ? seller.id : 1;

  // Fetch products function
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?seller_id=${sellerId}`);
      setSellerProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- EXPENSE / FINANCIAL CALCULATIONS ---
  const totalItemsUploaded = sellerProducts.length;
  const totalInventoryValue = sellerProducts.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const totalOfferValue = sellerProducts.reduce((acc, item) => acc + Number(item.offer_price || item.price || 0), 0);

  // Slides ka data
  const slides = [
    {
      tag: "🚀 GROW YOUR BUSINESS WITH ECOBAZAAR",
      title: "Expand Your Reach & Reduce Waste",
      desc: "Digitalize your inventory, connect with conscious buyers and local partners instantly, and scale your green business growth seamlessly.",
    },
    {
      tag: "📈 BOOST SALES & VISIBILITY",
      title: "Reach Thousands of Eco-Friendly Customers",
      desc: "Showcase your fashion, food, and lifestyle products to a dedicated community that values sustainability and green shopping.",
    },
    {
      tag: "💡 SMART INVENTORY MANAGEMENT",
      title: "Manage Listings & Track Orders Easily",
      desc: "Use our advanced dashboard tools to upload products, monitor sales performance, and optimize your daily business operations.",
    },
    {
      tag: "🤝 ZERO WASTE, MAXIMUM IMPACT",
      title: "Partner with Green Initiatives",
      desc: "Turn surplus inventory and sustainable items into profitable revenue streams while contributing to a cleaner environment.",
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto Slide Change (Har 4 seconds mein)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // AI Growth Advisor Generator Logic
  const handleAIGrowthAdvice = (goal) => {
    setGrowthGoal(goal);
    if (goal === 'sales') {
      setAiTip("🤖 AI Tip: Bundle your top-selling eco-friendly apparel with complimentary organic accessories to increase Average Order Value (AOV) by up to 22%. Highlight biodegradable packaging in your titles!");
    } else if (goal === 'visibility') {
      setAiTip("🤖 AI Tip: Leverage high-resolution imagery showing natural lighting. Use keywords like 'Handcrafted', 'Organic Cotton', and 'Zero-Waste' in your descriptions to rank higher in eco-search algorithms.");
    } else if (goal === 'retention') {
      setAiTip("🤖 AI Tip: Include a handwritten 'Thank You' card made from seed paper with every shipment. Customers who plant their tags have a 40% higher repeat purchase rate!");
    }
  };

  // Handle Logout with proper redirection
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/login');
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Input Change
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle Form Submission
  const handleUpload = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('brand', formData.brand);
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('price', formData.price);
    data.append('offer_price', formData.offerPrice || '');
    data.append('sizes', formData.sizes);
    data.append('description', formData.description);
    data.append('specifications', formData.specifications);
    data.append('seller_id', sellerId);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success || res.status === 201 || res.status === 200) {
        alert('Product uploaded successfully!');
        setFormData({
          brand: '',
          title: '',
          category: 'Men Clothing',
          price: '',
          offerPrice: '',
          sizes: '',
          description: '',
          specifications: ''
        });
        setImageFile(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to upload product.');
    }
  };

  return (
    <div className="seller-page-container">

      {/* 1. Navbar */}
      <nav className="seller-navbar">
        <div className="nav-brand">🌱 EcoBazaar Seller Portal</div>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#expense-tracker">Expense & Tracker</a>
          <a href="#ai-growth">AI Growth Hub</a>
          <a href="#upload-section">Add Item</a>
          <a href="#logout" onClick={handleLogout} className="logout-link">Logout</a>
        </div>
      </nav>

      {/* 2. Multi-Slide Hero Section */}
      <header className="seller-hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slider-content">
              <span>{slide.tag}</span>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="slider-btn prev-btn" onClick={prevSlide}>❮</button>
        <button className="slider-btn next-btn" onClick={nextSlide}>❯</button>

        {/* Dots Indicator */}
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </header>

      {/* 🌟 NEW: Expense Tracker & Inventory Financial Summary Section */}
      <section className="expense-tracker-section" id="expense-tracker">
        <div className="tracker-header">
          <h2><i className="fa-solid fa-chart-pie"></i> Store Financial & Upload Tracker</h2>
          <p>Real-time analytics of total items listed and total inventory asset value in your store.</p>
        </div>

        <div className="tracker-cards-grid">
          <div className="tracker-card">
            <div className="icon-box red"><i className="fa-solid fa-box-open"></i></div>
            <div className="tracker-info">
              <span>Total Uploaded Items</span>
              <h3>{totalItemsUploaded} Products</h3>
            </div>
          </div>

          <div className="tracker-card">
            <div className="icon-box pink"><i className="fa-solid fa-indian-rupee-sign"></i></div>
            <div className="tracker-info">
              <span>Total Inventory Value (MRP)</span>
              <h3>₹{totalInventoryValue.toLocaleString()}</h3>
            </div>
          </div>

          <div className="tracker-card">
            <div className="icon-box dark-red"><i className="fa-solid fa-tags"></i></div>
            <div className="tracker-info">
              <span>Total Selling Price Value</span>
              <h3>₹{totalOfferValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Moving Ticker Tape */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          <div className="ticker-item"><span>💡 Tip 1</span> Eco-conscious packaging boosts customer retention by 35%!</div>
          <div className="ticker-item"><span>🚀 Growth</span> Flash sales on organic lines increase store visibility.</div>
          <div className="ticker-item"><span>♻️ Impact</span> Reduce textile waste by listing surplus inventory instantly.</div>
          <div className="ticker-item"><span>💡 Tip 2</span> Fast fulfillment leads to 5-star seller ratings on EcoBazaar.</div>
          <div className="ticker-item"><span>💡 Tip 1</span> Eco-conscious packaging boosts customer retention by 35%!</div>
          <div className="ticker-item"><span>🚀 Growth</span> Flash sales on organic lines increase store visibility.</div>
        </div>
      </div>

      {/* AI Business Growth Advisor Section */}
      <section className="ai-growth-section" id="ai-growth">
        <div className="ai-growth-card">
          <div className="ai-header">
            <h2><i className="fa-solid fa-wand-magic-sparkles"></i> EcoBazaar AI Business Growth Advisor</h2>
            <p>Select your primary business objective to receive personalized data-driven growth insights.</p>
          </div>
          <div className="ai-buttons">
            <button 
              className={`ai-goal-btn ${growthGoal === 'sales' ? 'active' : ''}`} 
              onClick={() => handleAIGrowthAdvice('sales')}
            >
              📈 Increase Sales & AOV
            </button>
            <button 
              className={`ai-goal-btn ${growthGoal === 'visibility' ? 'active' : ''}`} 
              onClick={() => handleAIGrowthAdvice('visibility')}
            >
              🔍 Boost Store Visibility
            </button>
            <button 
              className={`ai-goal-btn ${growthGoal === 'retention' ? 'active' : ''}`} 
              onClick={() => handleAIGrowthAdvice('retention')}
            >
              ❤️ Improve Customer Loyalty
            </button>
          </div>
          <div className="ai-response-box">
            <p>{aiTip}</p>
          </div>
        </div>
      </section>

      {/* 3. Product Upload Form Section */}
      <div className="upload-container" id="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <div className="portal-badge">
              <i className="fa-solid fa-store"></i> Seller Dashboard
            </div>
            <h2>List New Product</h2>
            <p>Add fashion or lifestyle inventory to EcoBazaar store with complete details</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">

            {/* Row 1: Brand & Title */}
            <div className="form-row">
              <div className="input-group">
                <label><i className="fa-solid fa-tag"></i> Brand Name</label>
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g., XL Wear"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label><i className="fa-solid fa-shirt"></i> Product Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Men Relaxed Casual Shirt"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 2: Category & MRP */}
            <div className="form-row">
              <div className="input-group">
                <label><i className="fa-solid fa-list"></i> Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select-box">
                  <option value="Men Clothing">Men Clothing</option>
                  <option value="Women Clothing">Women Clothing</option>
                  <option value="Kids">Kids</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Footwear">Footwear</option>
                </select>
              </div>

              <div className="input-group">
                <label><i className="fa-solid fa-indian-rupee-sign"></i> Maximum Retail Price (MRP ₹)</label>
                <input
                  type="number"
                  name="price"
                  placeholder="2499"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 3: Offer Price & Sizes */}
            <div className="form-row">
              <div className="input-group">
                <label><i className="fa-solid fa-percent"></i> Selling / Offer Price (₹) [Optional]</label>
                <input
                  type="number"
                  name="offerPrice"
                  placeholder="1155"
                  value={formData.offerPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label><i className="fa-solid fa-ruler-combined"></i> Available Sizes (Comma separated)</label>
                <input
                  type="text"
                  name="sizes"
                  placeholder="e.g., 38, 40, 42 or S, M, L, XL"
                  value={formData.sizes}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Row 4: Image Upload Box */}
            <div className="input-group full-width">
              <label><i className="fa-solid fa-image"></i> Upload Product Image</label>
              <div className="file-upload-box">
                <input
                  type="file"
                  name="image"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>{imageFile ? imageFile.name : "Choose high-resolution product image..."}</span>
                </label>
              </div>
            </div>

            {/* Row 5: Description */}
            <div className="input-group full-width">
              <label><i className="fa-solid fa-align-left"></i> Product Details / Description</label>
              <textarea
                name="description"
                placeholder="e.g., Blue Solid Opaque Casual shirts, Spread Collar, Button Placket..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {/* Row 6: Specifications */}
            <div className="input-group full-width">
              <label><i className="fa-solid fa-circle-info"></i> Specifications (Material & Care / Fit)</label>
              <textarea
                name="specifications"
                placeholder="e.g., 100% Cotton Denim. Machine wash cold. Fit: Oversized."
                value={formData.specifications}
                onChange={handleChange}
                rows="2"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button type="submit" className="upload-btn">
                <i className="fa-solid fa-rocket"></i> Publish Product
              </button>
              <button type="button" className="back-btn" onClick={() => navigate('/')}>
                <i className="fa-solid fa-arrow-left"></i> Back to Store
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* 4. Uploaded Products List Section */}
      <div className="my-products-container">
        <div className="section-title">
          <h3>Your Uploaded Products ({sellerProducts.length})</h3>
          <p>Manage and track all the items you have listed on EcoBazaar</p>
        </div>

        <div className="products-grid">
          {sellerProducts.length === 0 ? (
            <p className="no-products">No products uploaded yet. Start by filling the form above!</p>
          ) : (
            sellerProducts.map((item) => (
              <div key={item.id || item._id} className="uploaded-product-card">
                <img src={item.image ? `http://localhost:5000/${item.image}` : "https://via.placeholder.com/150"} alt={item.title} />
                <div className="product-info">
                  <span className="card-brand">{item.brand}</span>
                  <h4>{item.title}</h4>
                  <div className="price-box">
                    <span className="offer-price">₹{item.offer_price || item.price}</span>
                    {item.offer_price && <span className="mrp">₹{item.price}</span>}
                  </div>
                  <span className="category-tag">{item.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default SellerUpload;