import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/brand.png';
import './AdminPanel.css'; // Apni specific CSS file link ki hai

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Admin and data fetching
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const userToken = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${userToken}` }
      };

      const [usersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/products')
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError('Failed to load admin data. Make sure you are logged in as admin.');
      setLoading(false);
    }
  };

  // Item/Product Delete Handler
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Kya tu sach mein is product ko delete karna chahta hai?")) return;

    try {
      const userToken = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setProducts(products.filter(p => (p.id || p._id) !== productId));
      alert('Product successfully delete ho gaya!');
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert('Product delete karne mein error aayi hai.');
    }
  };

  // User Remove Handler
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Kya tu is user ko remove karna chahta hai?")) return;

    try {
      const userToken = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      setUsers(users.filter(u => (u.id || u._id) !== userId));
      alert('User successfully remove ho gaya!');
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert('User remove karne mein error aayi hai.');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Panel...</div>;
  }

  return (
    <div className="admin-wrapper">
      
      {/* Admin Navbar */}
      <header className="admin-header">
        <div className="admin-logo-area">
          <Link to="/dashboard">
            <img src={logoImg} alt="Logo" className="admin-logo-img" />
          </Link>
          <h1 className="admin-title">🛠️ Admin Control Panel</h1>
        </div>
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="admin-back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <div className="admin-container">
        {error && <div className="admin-error-box">{error}</div>}

        {/* --- SECTION 1: PRODUCTS MANAGEMENT --- */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>📦 Manage Products ({products.length})</h2>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((item) => {
                    const pId = item.id || item._id;
                    const imgUrl = item.image?.startsWith('http') ? item.image : `http://localhost:5000/${item.image}`;
                    return (
                      <tr key={pId}>
                        <td>
                          <img src={imgUrl} alt="" className="admin-item-img" />
                        </td>
                        <td style={{ fontWeight: '500' }}>{item.title || item.name}</td>
                        <td>{item.category}</td>
                        <td>₹{item.offer_price || item.price}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(pId)}
                            className="admin-delete-btn"
                          >
                            Delete Item
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* --- SECTION 2: USERS MANAGEMENT --- */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2>👥 Registered Users ({users.length})</h2>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((usr) => {
                    const uId = usr.id || usr._id;
                    const isAdm = usr.role === 'admin';
                    return (
                      <tr key={uId}>
                        <td style={{ fontWeight: '500' }}>{usr.name}</td>
                        <td>{usr.email}</td>
                        <td>
                          <span className={`admin-role-badge ${isAdm ? 'admin' : 'user'}`}>
                            {usr.role || 'user'}
                          </span>
                        </td>
                        <td>
                          {!isAdm && (
                            <button
                              onClick={() => handleDeleteUser(uId)}
                              className="admin-delete-btn"
                            >
                              Remove User
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No users found or unauthorized to view users.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};