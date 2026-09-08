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

  // Slides ka data (Ab images ke sath!)
  const slides = [
    {
      tag: "🚀 GROW YOUR BUSINESS WITH ECOBAZAAR",
      title: "Expand Your Reach & Reduce Waste",
      desc: "Digitalize your inventory, connect with conscious buyers and local partners instantly, and scale your green business growth seamlessly.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" // Eco grocery/green store vibe
    },
    {
      tag: "📈 BOOST SALES & VISIBILITY",
      title: "Reach Thousands of Eco-Friendly Customers",
      desc: "Showcase your fashion, food, and lifestyle products to a dedicated community that values sustainability and green shopping.",
      image: "https://images.unsplash.com/photo-1556742049-0a67d553c2a5?auto=format&fit=crop&w=600&q=80" // Shopping / business tech vibe
    },
    {
      tag: "💡 SMART INVENTORY MANAGEMENT",
      title: "Manage Listings & Track Orders Easily",
      desc: "Use our advanced dashboard tools to upload products, monitor sales performance, and optimize your daily business operations.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" // Analytics / Dashboard vibe
    },
    {
      tag: "🤝 ZERO WASTE, MAXIMUM IMPACT",
      title: "Partner with Green Initiatives",
      desc: "Turn surplus inventory and sustainable items into profitable revenue streams while contributing to a cleaner environment.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80" // Eco sustainability vibe
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
        // Turant list ko refresh karein taaki niche naya item dikhe
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
        <div className="nav-brand">🌱 EcoBazaar Seller</div>
        <div className="nav-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#upload-section">Add Item</a>
          <a href="#logout" onClick={() => navigate('/')}>Logout</a>
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

      {/* 3. Product Upload Form Section */}
      <div className="upload-container" id="upload-section">
        <div className="upload-card">
          <div className="upload-header">
            <h2>Seller Portal</h2>
            <p>Add new fashion or lifestyle products to EcoBazaar store</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">

            <div className="input-group">
              <label>Brand Name</label>
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
              <label>Product Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Men Relaxed Casual Shirt"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

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
              <label>Maximum Retail Price (MRP ₹)</label>
              <input
                type="number"
                name="price"
                placeholder="2499"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Selling / Offer Price (₹) [Optional]</label>
              <input
                type="number"
                name="offerPrice"
                placeholder="1155"
                value={formData.offerPrice}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Available Sizes (Comma separated)</label>
              <input
                type="text"
                name="sizes"
                placeholder="e.g., 38, 40, 42, 44 or S, M, L, XL"
                value={formData.sizes}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Upload Product Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="input-group full">
              <label>Product Details / Description</label>
              <textarea
                name="description"
                placeholder="e.g., Blue Solid Opaque Casual shirts, Spread Collar, Button Placket..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="input-group full">
              <label>Specifications (Material & Care / Fit)</label>
              <textarea
                name="specifications"
                placeholder="e.g., 100% Cotton Denim. Machine wash cold. Fit: Oversized."
                value={formData.specifications}
                onChange={handleChange}
                rows="2"
              />
            </div>

            <button type="submit" className="upload-btn">Publish Product</button>
            <button type="button" className="back-btn" onClick={() => navigate('/')}>Logout / Back</button>
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