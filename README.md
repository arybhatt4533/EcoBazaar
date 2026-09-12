
# 🌿 EcoBazaar - Sustainable E-Commerce Marketplace

EcoBazaar is a modern, eco-friendly e-commerce web application built to connect sustainable product sellers with conscious buyers.

The platform provides separate experiences for buyers and sellers, secure route protection, product filtering, wishlist and cart management, dynamic pricing, and a seamless checkout experience.

---

## 🚀 Key Features

### 👥 Role-Based Access Control (RBAC)

- Separate portals for Buyers and Sellers.
- Role-based permissions for different users.
- Sellers can manage and upload products.
- Buyers can browse products and purchase items.

### 🔐 Secure Route Protection

- Protected React routes prevent unauthorized access.
- `/seller` dashboard is accessible only to authorized sellers.
- `/checkout` is protected from unauthenticated users.
- Unauthorized users are automatically redirected to `/login`.
- Buyers attempting to access seller routes are redirected to their appropriate dashboard.

### 🛍️ Product Catalog

- Dynamic product listing.
- Product filtering and searching.
- Product brand and title display.
- Eco-friendly product badges.
- Multi-size product selection.
- Dynamic offer-price calculation.
- Automatic discount percentage calculation.
- Original price and discounted price display.
- Responsive product cards.

### ❤️ Wishlist Management

- Add products to wishlist.
- Remove products from wishlist.
- Active wishlist state.
- Wishlist data is maintained using Local Storage.

### 🛒 Shopping Cart

- Add products to cart.
- Increase product quantity.
- Persistent cart using Local Storage.
- Selected product size is stored with the cart item.
- Existing products are automatically detected and their quantity is increased.

### 💳 Checkout

- Buy Now functionality.
- Login verification before checkout.
- Automatic cart update.
- Redirect to checkout after successful validation.

### 🔑 Secure Authentication

- User signup and login.
- Role validation.
- Login state management.
- Protected user-specific routes.

### 📱 Responsive UI/UX

- Responsive design for desktop, tablet, and mobile.
- Modern Flexbox and CSS Grid layouts.
- Premium product cards.
- Smooth hover animations.
- Custom gradients.
- Light reddish and emerald visual theme.
- Mobile-friendly navigation and product layout.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- JavaScript
- HTML5
- CSS3
- CSS Flexbox
- CSS Grid

### Backend

- Node.js
- Express.js

### Database / Storage

- PostgreeSQL
- Local Storage

### Development Tools

- npm
- Git
- GitHub
- Visual Studio Code

---

## 📂 Project Structure

```text
ecobazaar/
│
├── client/                         # Frontend (React App)
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── components/             # Reusable React components
│   │   │   └── ProtectedRoute.js   # Protected route component
│   │   │
│   │   ├── pages/                  # Application pages
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── SellerUpload.js
│   │   │   └── CheckoutCart.js
│   │   │
│   │   ├── App.js                  # Main router setup
│   │   └── index.js                # React entry point
│   │
│   └── package.json
│
├── server/                         # Backend (Node.js + Express)
│   │
│   ├── models/                     # Database models
│   │
│   ├── routes/                     # API routes
│   │
│   └── server.js                   # Backend entry point
│
└── README.md                       # Project documentation
```

---

# ⚙️ Getting Started

Follow the steps below to run EcoBazaar locally on your computer.

## 📋 Prerequisites

Before running the project, make sure the following software is installed:

- Node.js
- npm
- PostgreeSQL
- Git
- Visual Studio Code

You can verify Node.js and npm installation using:

```bash
node --version
npm --version
```

---

# 📥 Installation

## 1. Clone the Repository

Clone the EcoBazaar repository using Git:

```bash
git clone https://github.com/your-username/ecobazaar.git
```

Navigate into the project directory:

```bash
cd ecobazaar
```

---

# 🖥️ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm run dev
```

Or, if `nodemon` is not configured:

```bash
node server.js
```

The backend server will run on the configured backend port.

Example:

```text
http://localhost:5000
```

---

# 🌐 Frontend Setup

Open a new terminal window.

Navigate to the client directory:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The application will normally open at:

```text
http://localhost:3000
```

---

# 🔒 Security & Route Protection

EcoBazaar uses custom `ProtectedRoute` components to protect sensitive pages.

Protected routes include:

```text
/checkout
/seller
```

## Checkout Protection

Unauthenticated users attempting to access:

```text
/checkout
```

are automatically redirected to:

```text
/login
```

## Seller Dashboard Protection

The seller dashboard is protected from unauthorized access.

Users without the required seller role cannot directly access:

```text
/seller
```

Instead, they are redirected to the appropriate page.

---

# 🛍️ Product Features

Each product supports dynamic information such as:

```text
Product Image
Brand
Product Title
Rating
Available Sizes
Original Price
Offer Price
Discount Percentage
Eco Badge
Wishlist
Add to Cart
Buy Now
```

The application dynamically calculates discounts when an offer price is available.

Example:

```text
Original Price: ₹1000
Offer Price:   ₹800

Discount: 20% OFF
```

---

# 📐 Size Selection

Products containing multiple sizes allow users to select their preferred size.

Example:

```text
SELECT SIZE

[28] [30] [32] [34]
```

The selected size is stored with the cart item.

Example:

```javascript
{
    productId: "123",
    selectedSize: "32",
    quantity: 1
}
```

---

# 🛒 Cart Management

EcoBazaar uses browser Local Storage to maintain cart data.

Cart items are stored under:

```text
cartItems
```

Example cart structure:

```javascript
[
    {
        id: "123",
        title: "Classic Shirt",
        price: 1200,
        selectedSize: "32",
        quantity: 1
    }
]
```

If the same product is added again, its quantity is automatically increased.

---

# ❤️ Wishlist

Wishlist products are maintained using Local Storage.

Users can:

```text
♡ Add to Wishlist
♥ Remove from Wishlist
```

The wishlist button dynamically changes based on the current wishlist state.

---

# 💰 Dynamic Pricing

EcoBazaar supports product offers and automatic discount calculation.

If an offer price is lower than the original price:

```text
Original Price
      ↓
Offer Price
      ↓
Discount %
```

Example:

```text
Original Price     ₹1500
Offer Price        ₹1200
Discount           20% OFF
```

The product card displays both the original and discounted price.

---

# 🎨 UI Design

EcoBazaar follows a modern sustainable fashion-commerce design.

## Primary Colors

```text
Primary Red     #C9000C
Dark Red       #A9000A
Light Red      #FFF3F4
Text           #282C3F
Muted Text     #696E79
Eco Green      #008A45
```

## Design Elements

- Rounded product cards
- Soft shadows
- Light reddish background
- Premium product imagery
- Eco-friendly badges
- Wishlist buttons
- Rating badges
- Size selectors
- Discount labels
- Add to Cart buttons
- Buy Now buttons
- Smooth hover animations
- Responsive layouts

---

# 📱 Responsive Design

EcoBazaar is designed to work across different screen sizes.

## Desktop

```text
Multiple product columns
        ↓
Large product images
        ↓
Full product information
```

## Tablet

```text
Responsive product grid
        ↓
Optimized card sizes
```

## Mobile

```text
Two-column product layout
        ↓
Compact product cards
        ↓
Touch-friendly buttons
```

---

# 🔄 Application Flow

The general user flow is:

```text
                ┌──────────────┐
                │   EcoBazaar  │
                └──────┬───────┘
                       │
              ┌────────▼────────┐
              │ Login / Signup  │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Role Checking  │
              └───────┬─┬───────┘
                      │ │
             ┌────────┘ └────────┐
             ▼                   ▼
       ┌───────────┐       ┌───────────┐
       │   Buyer   │       │   Seller  │
       └─────┬─────┘       └─────┬─────┘
             │                   │
             ▼                   ▼
       Browse Products      Manage Products
             │
             ▼
       Select Product
             │
       ┌─────┴─────┐
       ▼           ▼
   Wishlist      Cart
                   │
                   ▼
                Checkout
                   │
                   ▼
              Place Order
```

---

# 🧩 Main Application Components

## `App.js`

Responsible for:

- Application routing
- Route configuration
- Protected routes
- Navigation between pages

## `ProtectedRoute.js`

Responsible for:

- Authentication verification
- Role verification
- Preventing unauthorized access

## Product Components

Responsible for:

- Product display
- Product filtering
- Size selection
- Wishlist management
- Cart operations
- Pricing and discount calculation

## Seller Pages

Responsible for:

- Seller authentication
- Product uploading
- Product management

## Checkout

Responsible for:

- Cart review
- User validation
- Checkout process

---

# 🔐 Authentication Flow

The authentication flow works as follows:

```text
User
 │
 ▼
Signup / Login
 │
 ▼
Authentication
 │
 ▼
Role Validation
 │
 ├───────────────┐
 ▼               ▼
Buyer           Seller
 │               │
 ▼               ▼
Dashboard       Seller Dashboard
```

---

# 🗃️ Local Storage

EcoBazaar uses browser Local Storage for client-side persistence.

Important storage keys include:

```text
user
cartItems
wishlist
```

These values allow the application to maintain user session information, wishlist data, and cart items during navigation.

---

# 🚧 Future Improvements

The following features can be added in future versions:

- Online payment gateway
- Order history
- Product reviews
- Product ratings
- Seller analytics dashboard
- Admin dashboard
- Inventory management
- Email notifications
- Advanced product search
- Category-based filtering
- Coupon and discount system
- Product recommendation system
- Cloud image storage
- JWT-based authentication
- Password encryption and reset functionality

---

# 🤝 Contributing

Contributions are welcome.

## 1. Fork or Clone the Repository

```bash
git clone https://github.com/your-username/ecobazaar.git
```

## 2. Create a New Branch

```bash
git checkout -b feature/new-feature
```

## 3. Make Your Changes

Update the project according to your feature or bug fix.

## 4. Commit Your Changes

```bash
git add .
git commit -m "Add new feature"
```

## 5. Push the Branch

```bash
git push origin feature/new-feature
```

## 6. Create a Pull Request

Open a Pull Request on GitHub and describe the changes you have made.

---

# 🐛 Bug Reporting

If you find a bug, please create an issue with the following information:

- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and operating system information

---

# 📸 Screenshots

Add your EcoBazaar project screenshots here.

Example:

```markdown
![EcoBazaar Home Page](screenshots/home.png)

![Product Page](screenshots/products.png)

![Shopping Cart](screenshots/cart.png)

![Checkout Page](screenshots/checkout.png)

![Seller Dashboard](screenshots/seller-dashboard.png)
```

---

# 👨‍💻 Author

## Aryabhatt, Nilesh & Pradeep

**Bachelor of Computer Applications (BCA) Student & Software Developer**

EcoBazaar was developed as a sustainable e-commerce marketplace project focusing on modern web development, role-based access control, responsive UI/UX, and secure application routing.

---

# 📄 License

This project is created for educational and development purposes.

You are free to modify and improve the project according to your requirements.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Thank you for checking out **EcoBazaar**! 🌿❤️
````
