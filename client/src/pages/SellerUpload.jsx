import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/brand.png';
import uploadImg from '../assets/upload.png';
import inventoryImg from '../assets/inventory.png';
import priceImg from '../assets/price.png';
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

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

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
      tag: "🚀 GROW YOUR BUSINESS",
      title: "Expand Your Reach & Reduce Waste",
      desc: "Digitalize your inventory, connect with conscious buyers instantly, and scale your green business growth seamlessly.",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80"
    },
    {
      tag: "📈 BOOST SALES & VISIBILITY",
      title: "Reach Thousands of Eco-Friendly Buyers",
      desc: "Showcase your sustainable fashion and lifestyle products to a dedicated community that values green shopping.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80"
    },
    {
      tag: "💡 SMART INVENTORY MANAGEMENT",
      title: "Manage Listings & Track Orders Easily",
      desc: "Use our advanced dashboard tools to upload products, monitor sales performance, and optimize daily operations.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80"
    }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // AI Growth Advisor Generator Logic
  const handleAIGrowthAdvice = (goal) => {
    setGrowthGoal(goal);
    if (goal === 'sales') {
      setAiTip("🤖 AI Tip: Bundle your top-selling eco-friendly apparel with complimentary organic accessories to increase Average Order Value (AOV) by up to 22%.");
    } else if (goal === 'visibility') {
      setAiTip("🤖 AI Tip: Leverage high-resolution imagery showing natural lighting. Use keywords like 'Handcrafted' and 'Organic Cotton' in descriptions.");
    } else if (goal === 'retention') {
      setAiTip("🤖 AI Tip: Include a handwritten 'Thank You' card made from seed paper with every shipment for higher customer retention!");
    }
  };

  // Handle Logout
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

  // --- DELETE PRODUCT FUNCTION ---
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/products/${productId}`);
        if (res.data.success) {
          alert("Product deleted successfully!");
          fetchProducts();
        }
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete product.");
      }
    }
  };

  // --- START EDIT PRODUCT FUNCTION ---
  const handleEditClick = (item) => {
    setIsEditing(true);
    setEditProductId(item.id || item._id);
    setFormData({
      brand: item.brand || '',
      title: item.title || '',
      category: item.category || 'Men Clothing',
      price: item.price || '',
      offerPrice: item.offer_price || '',
      sizes: item.sizes || '',
      description: item.description || '',
      specifications: item.specifications || ''
    });
    // Scroll smoothly to upload form
    document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
  };

  // --- HANDLE FORM SUBMISSION (CREATE OR UPDATE) ---
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
      let res;
      if (isEditing) {
        // Update API call (PUT)
        res = await axios.put(`http://localhost:5000/api/products/${editProductId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create API call (POST)
        res = await axios.post('http://localhost:5000/api/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        alert(isEditing ? 'Product updated successfully!' : 'Product uploaded successfully!');
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
        setIsEditing(false);
        setEditProductId(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed.');
    }
  };

  return (
    <div className="seller-page-container">

      {/* 1. Navbar */}
      <nav className="seller-navbar">
        <div className="logo-container">
          <img src={logoImg} alt="EcoBazaar Logo" className="nav-logo-img" />
        </div>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#expense-tracker">Financial Tracker</a>
          <a href="#ai-growth">AI Growth Hub</a>
          <a href="#upload-section">{isEditing ? 'Edit Item' : 'Add Item'}</a>
          <a href="#logout" onClick={handleLogout} className="logout-link">Logout</a>
        </div>
      </nav>

      {/* 2. Hero Slider */}
      <header className="seller-hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slider-content">
              <span>{slide.tag}</span>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
            </div>
          </div>
        ))}
        <button className="slider-btn prev-btn" onClick={prevSlide}>❮</button>
        <button className="slider-btn next-btn" onClick={nextSlide}>❯</button>
      </header>

      {/* 3. Tracker Section */}
      <section className="expense-tracker-section" id="expense-tracker">
        <div className="tracker-header">
          <h2><i className="fa-solid fa-chart-pie"></i> Store Financial & Upload Tracker</h2>
        </div>
        <div className="tracker-cards-grid">
          <div className="tracker-card">
            <div className="tracker-icon-box"><img src={uploadImg} alt="Upload" /></div>
            <div className="tracker-info">
              <span>Total Uploaded Items</span>
              <h3>{totalItemsUploaded} Products</h3>
            </div>
          </div>
          <div className="tracker-card">
            <div className="tracker-icon-box"><img src={inventoryImg} alt="Inventory" /></div>
            <div className="tracker-info">
              <span>Total Inventory Value (MRP)</span>
              <h3>₹{totalInventoryValue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="tracker-card">
            <div className="tracker-icon-box"><img src={priceImg} alt="Price" /></div>
            <div className="tracker-info">
              <span>Total Selling Price Value</span>
              <h3>₹{totalOfferValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* AI Advisor */}
      <section className="ai-growth-section" id="ai-growth">
        <div className="ai-growth-card">
          <div className="ai-header">
            <h2><i className="fa-solid fa-wand-magic-sparkles"></i> EcoBazaar AI Business Growth Advisor</h2>
          </div>
          <div className="ai-buttons">
            <button className={`ai-goal-btn ${growthGoal === 'sales' ? 'active' : ''}`} onClick={() => handleAIGrowthAdvice('sales')}>📈 Increase Sales & AOV</button>
            <button className={`ai-goal-btn ${growthGoal === 'visibility' ? 'active' : ''}`} onClick={() => handleAIGrowthAdvice('visibility')}>🔍 Boost Store Visibility</button>
            <button className={`ai-goal-btn ${growthGoal === 'retention' ? 'active' : ''}`} onClick={() => handleAIGrowthAdvice('retention')}>❤️ Improve Customer Loyalty</button>
          </div>
          <div className="ai-response-box"><p>{aiTip}</p></div>
        </div>
      </section>

      {/* 4. Product Upload / Edit Form Section */}
      <div className="upload-container" id="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <div className="portal-badge">
              <i className="fa-solid fa-store"></i> Seller Dashboard
            </div>
            <h2>{isEditing ? 'Edit Product Details' : 'List New Product'}</h2>
            <p>{isEditing ? 'Update your existing listing' : 'Add fashion or lifestyle inventory to EcoBazaar store'}</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-row">
              <div className="input-group">
                <label>Brand Name</label>
                <input type="text" name="brand" placeholder="e.g., XL Wear" value={formData.brand} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Product Title</label>
                <input type="text" name="title" placeholder="e.g., Casual Shirt" value={formData.title} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Category</label>
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
                <label>MRP (₹)</label>
                <input type="number" name="price" placeholder="2499" value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Offer Price (₹)</label>
                <input type="number" name="offerPrice" placeholder="1155" value={formData.offerPrice} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Available Sizes</label>
                <input type="text" name="sizes" placeholder="S, M, L, XL" value={formData.sizes} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Product Image {isEditing && "(Optional: choose new to replace)"}</label>
              <div className="file-upload-box">
                <input type="file" name="image" id="file-input" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="file-input" className="file-upload-label">
                  <span>{imageFile ? imageFile.name : "Choose product image..."}</span>
                </label>
              </div>
            </div>

            <div className="input-group full-width">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
            </div>

            <div className="input-group full-width">
              <label>Specifications</label>
              <textarea name="specifications" value={formData.specifications} onChange={handleChange} rows="2" />
            </div>

            <div className="form-actions">
              <button type="submit" className="upload-btn">
                {isEditing ? 'Update Product' : 'Publish Product'}
              </button>
              {isEditing && (
                <button type="button" className="back-btn" onClick={() => { setIsEditing(false); setEditProductId(null); }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* 5. Uploaded Products List with Edit/Delete */}
      <div className="my-products-container">
        <div className="section-title">
          <h3>Your Uploaded Products ({sellerProducts.length})</h3>
        </div>

        <div className="products-grid">
          {sellerProducts.length === 0 ? (
            <p className="no-products">No products uploaded yet.</p>
          ) : (
            sellerProducts.map((item) => (
              <div key={item.id || item._id} className="uploaded-product-card" style={{ position: 'relative' }}>
                <img src={item.image ? `http://localhost:5000/${item.image}` : "https://via.placeholder.com/150"} alt={item.title} />
                <div className="product-info">
                  <span className="card-brand">{item.brand}</span>
                  <h4>{item.title}</h4>
                  <div className="price-box">
                    <span className="offer-price">₹{item.offer_price || item.price}</span>
                    {item.offer_price && <span className="mrp">₹{item.price}</span>}
                  </div>
                  
                  {/* Edit & Delete Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button 
                      onClick={() => handleEditClick(item)}
                      style={{ flex: 1, padding: '6px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id || item._id)}
                      style={{ flex: 1, padding: '6px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
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