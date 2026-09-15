import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logoImg from '../assets/brand.png';
import './AdminPanel.css';

export const AdminPanel = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [productSearch, setProductSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const [activeTab, setActiveTab] = useState('products');

  /* =====================================================
     FETCH ADMIN DATA
  ===================================================== */

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setError('');

      if (!loading) {
        setRefreshing(true);
      }

      const adminToken =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('token');

      const response = await axios.get(
        'http://localhost:5000/api/admin/dashboard-stats',
        {
          headers: adminToken
            ? {
                Authorization: `Bearer ${adminToken}`
              }
            : {}
        }
      );

      if (response.data?.success) {
        setUsers(response.data.users || []);
        setProducts(response.data.products || []);
      }

    } catch (err) {
      console.error('Admin data error:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load admin data from server.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');

    navigate('/admin/login');
  };


  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const handleDeleteProduct = async (productId) => {

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this product?'
    );

    if (!confirmed) return;

    try {

      const userToken =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('token');

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      setProducts(prev =>
        prev.filter(
          product =>
            (product.id || product._id) !== productId
        )
      );

      alert('Product deleted successfully.');

    } catch (err) {

      console.error('Failed to delete product:', err);

      alert(
        err.response?.data?.message ||
        'Product delete karne mein error aayi hai.'
      );
    }
  };


  /* =====================================================
     DELETE USER
  ===================================================== */

  const handleDeleteUser = async (userId) => {

    const confirmed = window.confirm(
      'Are you sure you want to remove this user?'
    );

    if (!confirmed) return;

    try {

      const userToken =
        localStorage.getItem('adminToken') ||
        localStorage.getItem('token');

      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      setUsers(prev =>
        prev.filter(
          user =>
            (user.id || user._id) !== userId
        )
      );

      alert('User removed successfully.');

    } catch (err) {

      console.error('Failed to delete user:', err);

      alert(
        err.response?.data?.message ||
        'User remove karne mein error aayi hai.'
      );
    }
  };


  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts = useMemo(() => {

    const search = productSearch
      .toLowerCase()
      .trim();

    if (!search) return products;

    return products.filter(product => {

      const title =
        product.title ||
        product.name ||
        '';

      const category =
        product.category ||
        '';

      return (
        title.toLowerCase().includes(search) ||
        category.toLowerCase().includes(search)
      );
    });

  }, [products, productSearch]);


  /* =====================================================
     FILTER USERS
  ===================================================== */

  const filteredUsers = useMemo(() => {

    const search = userSearch
      .toLowerCase()
      .trim();

    if (!search) return users;

    return users.filter(user => {

      const name =
        user.name ||
        '';

      const email =
        user.email ||
        '';

      const role =
        user.role ||
        '';

      return (
        name.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        role.toLowerCase().includes(search)
      );
    });

  }, [users, userSearch]);


  /* =====================================================
     STATISTICS
  ===================================================== */

  const adminCount = users.filter(
    user => user.role === 'admin'
  ).length;

  const normalUserCount =
    users.length - adminCount;

  const inventoryValue = products.reduce(
    (total, product) => {

      const price =
        Number(
          product.offer_price ||
          product.price ||
          0
        );

      return total + price;

    },
    0
  );


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (
      <div className="admin-loading-screen">

        <div className="admin-loading-logo">
          <img
            src={logoImg}
            alt="EcoBazaar"
          />
        </div>

        <div className="admin-loading-spinner"></div>

        <h2>
          Initializing Command Center
        </h2>

        <p>
          Connecting to EcoBazaar administrative network...
        </p>

      </div>
    );
  }


  /* =====================================================
     MAIN
  ===================================================== */

  return (

    <div className="admin-dashboard">

      {/* BACKGROUND */}

      <div className="admin-dashboard-grid"></div>

      <div className="dashboard-glow dashboard-glow-1"></div>
      <div className="dashboard-glow dashboard-glow-2"></div>


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="dashboard-header">

        <div className="dashboard-brand">

          <Link to="/dashboard">

            <img
              src={logoImg}
              alt="EcoBazaar"
            />

          </Link>

          <div className="dashboard-brand-divider"></div>

          <div>

            <h1>
              Command Center
            </h1>

            <p>
              EcoBazaar Administration
            </p>

          </div>

        </div>


        <div className="dashboard-header-right">

          <div className="system-online">

            <span></span>

            SYSTEM ONLINE

          </div>


          <button
            className="refresh-btn"
            onClick={fetchAdminData}
            disabled={refreshing}
          >

            <span className={refreshing ? 'spin' : ''}>
              ↻
            </span>

            {refreshing
              ? 'SYNCING'
              : 'REFRESH'}

          </button>


          <button
            className="dashboard-back-btn"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            Storefront
          </button>


          <button
            className="dashboard-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="dashboard-main">


        {/* PAGE INTRO */}

        <section className="dashboard-intro">

          <div>

            <div className="intro-kicker">
              ADMINISTRATIVE NETWORK
            </div>

            <h2>
              Good day, Administrator.
            </h2>

            <p>
              Monitor your marketplace, products
              and registered users from one central
              command interface.
            </p>

          </div>


          <div className="node-status">

            <span className="node-dot"></span>

            <div>

              <small>
                ACTIVE NODE
              </small>

              <strong>
                EBX-09
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="dashboard-stats">


          <div className="stat-card">

            <div className="stat-icon">
              ◈
            </div>

            <div className="stat-info">

              <span>
                TOTAL PRODUCTS
              </span>

              <strong>
                {products.length}
              </strong>

              <small>
                Active catalog items
              </small>

            </div>

            <div className="stat-line"></div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ◉
            </div>

            <div className="stat-info">

              <span>
                REGISTERED USERS
              </span>

              <strong>
                {normalUserCount}
              </strong>

              <small>
                Customer accounts
              </small>

            </div>

            <div className="stat-line"></div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ◆
            </div>

            <div className="stat-info">

              <span>
                ADMIN ACCOUNTS
              </span>

              <strong>
                {adminCount}
              </strong>

              <small>
                Privileged accounts
              </small>

            </div>

            <div className="stat-line"></div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ₹
            </div>

            <div className="stat-info">

              <span>
                CATALOG VALUE
              </span>

              <strong>
                ₹
                {inventoryValue.toLocaleString('en-IN')}
              </strong>

              <small>
                Current listed value
              </small>

            </div>

            <div className="stat-line"></div>

          </div>

        </section>


        {/* ERROR */}

        {error && (

          <div className="dashboard-error">

            <span>!</span>

            <div>

              <strong>
                SYSTEM ERROR
              </strong>

              <p>
                {error}
              </p>

            </div>

            <button
              onClick={fetchAdminData}
            >
              Retry
            </button>

          </div>

        )}


        {/* =================================================
            MANAGEMENT AREA
        ================================================= */}

        <section className="management-panel">


          {/* PANEL HEADER */}

          <div className="management-header">

            <div>

              <div className="panel-kicker">
                DATABASE MANAGEMENT
              </div>

              <h2>
                Marketplace Control
              </h2>

            </div>


            <div className="management-tabs">

              <button
                className={
                  activeTab === 'products'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveTab('products')
                }
              >
                Products
                <span>
                  {products.length}
                </span>
              </button>


              <button
                className={
                  activeTab === 'users'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setActiveTab('users')
                }
              >
                Users
                <span>
                  {users.length}
                </span>
              </button>

            </div>

          </div>


          {/* =================================================
              PRODUCTS
          ================================================= */}

          {activeTab === 'products' && (

            <div className="management-content">

              <div className="table-toolbar">

                <div>

                  <h3>
                    Product Inventory
                  </h3>

                  <p>
                    Manage products listed on EcoBazaar.
                  </p>

                </div>


                <div className="table-search">

                  <span>
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) =>
                      setProductSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div className="table-wrapper">

                <table className="admin-data-table">

                  <thead>

                    <tr>

                      <th>
                        PRODUCT
                      </th>

                      <th>
                        CATEGORY
                      </th>

                      <th>
                        PRICE
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        ACTION
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredProducts.length > 0 ? (

                      filteredProducts.map(item => {

                        const pId =
                          item.id ||
                          item._id;

                        const imgUrl =
                          item.image?.startsWith('http')
                            ? item.image
                            : `http://localhost:5000/${item.image}`;

                        const hasOffer =
                          item.offer_price &&
                          Number(item.offer_price) <
                          Number(item.price);

                        return (

                          <tr key={pId}>

                            <td>

                              <div className="product-cell">

                                <div className="product-image-box">

                                  <img
                                    src={imgUrl}
                                    alt=""
                                  />

                                </div>

                                <div>

                                  <strong>
                                    {item.title ||
                                      item.name ||
                                      'Untitled Product'}
                                  </strong>

                                  <span>
                                    ID: {String(pId).slice(-8)}
                                  </span>

                                </div>

                              </div>

                            </td>


                            <td>

                              <span className="category-badge">
                                {item.category ||
                                  'Uncategorized'}
                              </span>

                            </td>


                            <td>

                              <div className="price-cell">

                                <strong>
                                  ₹
                                  {Number(
                                    item.offer_price ||
                                    item.price ||
                                    0
                                  ).toLocaleString('en-IN')}
                                </strong>

                                {hasOffer && (

                                  <span>
                                    ₹
                                    {Number(
                                      item.price
                                    ).toLocaleString('en-IN')}
                                  </span>

                                )}

                              </div>

                            </td>


                            <td>

                              <span className="status-badge">

                                <i></i>

                                ACTIVE

                              </span>

                            </td>


                            <td>

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  handleDeleteProduct(pId)
                                }
                              >

                                <span>
                                  ×
                                </span>

                                Delete

                              </button>

                            </td>

                          </tr>

                        );

                      })

                    ) : (

                      <tr>

                        <td
                          colSpan="5"
                          className="empty-table"
                        >

                          <div className="empty-icon">
                            ◇
                          </div>

                          <strong>
                            No products found
                          </strong>

                          <span>
                            Try another search term.
                          </span>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}


          {/* =================================================
              USERS
          ================================================= */}

          {activeTab === 'users' && (

            <div className="management-content">

              <div className="table-toolbar">

                <div>

                  <h3>
                    Registered Users
                  </h3>

                  <p>
                    Manage EcoBazaar customer accounts.
                  </p>

                </div>


                <div className="table-search">

                  <span>
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) =>
                      setUserSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div className="table-wrapper">

                <table className="admin-data-table">

                  <thead>

                    <tr>

                      <th>
                        USER
                      </th>

                      <th>
                        EMAIL
                      </th>

                      <th>
                        ROLE
                      </th>

                      <th>
                        STATUS
                      </th>

                      <th>
                        ACTION
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredUsers.length > 0 ? (

                      filteredUsers.map(user => {

                        const uId =
                          user.id ||
                          user._id;

                        const isAdmin =
                          user.role === 'admin';

                        return (

                          <tr key={uId}>

                            <td>

                              <div className="user-cell">

                                <div className="user-avatar">

                                  {(
                                    user.name ||
                                    'U'
                                  )
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>

                                <div>

                                  <strong>
                                    {user.name ||
                                      'Unknown User'}
                                  </strong>

                                  <span>
                                    Account ID: {String(uId).slice(-8)}
                                  </span>

                                </div>

                              </div>

                            </td>


                            <td>

                              <span className="email-text">
                                {user.email}
                              </span>

                            </td>


                            <td>

                              <span
                                className={
                                  `role-badge ${
                                    isAdmin
                                      ? 'admin-role'
                                      : 'user-role'
                                  }`
                                }
                              >

                                {isAdmin
                                  ? 'ADMIN'
                                  : 'USER'}

                              </span>

                            </td>


                            <td>

                              <span className="status-badge">

                                <i></i>

                                ACTIVE

                              </span>

                            </td>


                            <td>

                              {!isAdmin ? (

                                <button
                                  className="delete-btn"
                                  onClick={() =>
                                    handleDeleteUser(uId)
                                  }
                                >

                                  <span>
                                    ×
                                  </span>

                                  Remove

                                </button>

                              ) : (

                                <span className="protected-text">
                                  Protected
                                </span>

                              )}

                            </td>

                          </tr>

                        );

                      })

                    ) : (

                      <tr>

                        <td
                          colSpan="5"
                          className="empty-table"
                        >

                          <div className="empty-icon">
                            ◇
                          </div>

                          <strong>
                            No users found
                          </strong>

                          <span>
                            Try another search term.
                          </span>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="dashboard-footer">

          <div>

            <img
              src={logoImg}
              alt="EcoBazaar"
            />

            <span>
              Sustainable commerce. Smarter management.
            </span>

          </div>


          <div>

            ECOBAZAAR OS v2.0.99

            <b>//</b>

            ADMIN CORE

            <b>//</b>

            ALL SYSTEMS NOMINAL

          </div>

        </footer>

      </main>

    </div>
  );
};

export default AdminPanel;