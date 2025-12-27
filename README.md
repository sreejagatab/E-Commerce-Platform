# HowTo E-Commerce Platform

A full-stack e-commerce application with NFT marketplace analytics, cryptocurrency payments, and a comprehensive admin dashboard. Built with React, Node.js, Express, and Supabase.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-darkgreen?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Admin Dashboard](#admin-dashboard)
- [Payment Integration](#payment-integration)
- [NFT Marketplace](#nft-marketplace)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core E-Commerce
- **Product Catalog** - Browse products with categories and search functionality
- **Shopping Cart** - Add/remove items with persistent local storage
- **User Authentication** - Secure JWT-based registration and login
- **Order Management** - Complete checkout flow with order tracking

### Payment Options
- **Stripe Integration** - Credit/debit card payments
- **MetaMask/Crypto** - Cryptocurrency payment support
- **Secure Checkout** - PCI-compliant payment processing

### Admin Dashboard
- **Revenue Analytics** - Daily and monthly revenue charts
- **Order Management** - View, update, and track all orders
- **Product Management** - Add, edit, and delete products
- **User Management** - Manage customer accounts
- **Delivery Tracking** - Monitor pending, shipped, and delivered orders

### NFT Marketplace Analytics
- **Marketplace Rankings** - Top NFT marketplaces comparison
- **Trading Volume Stats** - 24h/7d volume tracking
- **Trending Collections** - Popular NFT collections with floor prices
- **Market Insights** - Real-time market analysis

### Additional Features
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Theme** - Modern dark UI throughout
- **Toast Notifications** - Real-time feedback on actions
- **Redux State Management** - Predictable state container

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Redux Toolkit | State Management |
| React Router 6 | Client-side Routing |
| TailwindCSS 3 | Styling |
| Axios | HTTP Client |
| React Icons | Icon Library |
| React Toastify | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime |
| Express 4 | Web Framework |
| Supabase | Database & Auth |
| Passport.js | Authentication |
| JWT (jose) | Token Management |
| Stripe | Payment Processing |
| bcrypt | Password Hashing |

---

## Project Structure

```
how/
├── client/                 # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── app/           # Redux store configuration
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Card.js
│   │   │   ├── Footer.js
│   │   │   ├── Navbar.js
│   │   │   ├── PayButton.jsx
│   │   │   ├── Slider.js
│   │   │   └── WalletStatus.js
│   │   ├── features/      # Redux slices
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   └── wallet/
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── Cart.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── NFTMarketplace.js
│   │   │   ├── Products.js
│   │   │   └── Register.js
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/            # Configuration files
│   │   └── supabase.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   └── productController.js
│   ├── data/              # Seed data
│   ├── model/             # Data models
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/            # API routes
│   │   ├── admin.js
│   │   ├── authRoutes.js
│   │   ├── crypto.js
│   │   ├── order.js
│   │   ├── productRoutes.js
│   │   └── stripe.js
│   ├── scripts/           # Utility scripts
│   ├── utils/             # Helper utilities
│   ├── index.js           # Server entry point
│   └── package.json
│
├── package.json            # Root package (concurrently)
└── README.md
```

---

## Prerequisites

- **Node.js** 20.0.0 or higher
- **npm** 9.0.0 or higher
- **Supabase Account** (free tier available)
- **Stripe Account** (for payment processing)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sreejagatab/how.git
cd how
```

### 2. Install All Dependencies

```bash
# Install root, server, and client dependencies
npm run install-all
```

Or install manually:

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install
```

---

## Environment Variables

### Server Configuration

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=4000

# Supabase Configuration (REQUIRED)
# Get from: https://supabase.com → Your Project → Settings → API
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Configuration (REQUIRED)
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_jwt_secret_here

# Stripe Configuration (REQUIRED for payments)
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_KEY=sk_test_your_stripe_secret_key_here
```

### Getting Your Keys

1. **Supabase**
   - Go to [supabase.com](https://supabase.com) and create a project
   - Navigate to Settings → API
   - Copy the Project URL and anon/public key

2. **Stripe**
   - Go to [dashboard.stripe.com](https://dashboard.stripe.com/apikeys)
   - Copy your Secret Key (starts with `sk_test_` for testing)

3. **JWT Secret**
   - Generate a secure random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

---

## Database Setup

### 1. Create Tables in Supabase

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping JSONB NOT NULL,
  delivery_status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

### 2. Migrate Sample Products (Optional)

```bash
cd server
npm run migrate-products
```

### 3. Test Supabase Connection

```bash
cd server
npm run test-supabase
```

---

## Running the Application

### Development Mode (Both Client & Server)

```bash
# From root directory
npm start
```

This runs both the client (port 3000) and server (port 4000) concurrently.

### Run Separately

```bash
# Terminal 1 - Server
cd server
npm run dev    # With nodemon (auto-reload)
# or
npm start      # Without auto-reload

# Terminal 2 - Client
cd client
npm start
```

### Production Build

```bash
# Build client
cd client
npm run build

# Start server
cd ../server
npm start
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| API Health Check | http://localhost:4000/health |

---

## API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get single product |
| POST | `/products` | Create product (Admin) |
| PUT | `/products/:id` | Update product (Admin) |
| DELETE | `/products/:id` | Delete product (Admin) |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| GET | `/orders/:id` | Get single order |
| POST | `/orders` | Create new order |
| PUT | `/orders/:id` | Update order status |

### Stripe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/stripe/create-checkout-session` | Create Stripe checkout |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Get dashboard statistics |
| GET | `/admin/analytics/sales` | Get sales analytics |
| GET | `/admin/orders` | Get all orders (Admin) |
| GET | `/admin/users` | Get all users (Admin) |

---

## Admin Dashboard

Access the admin dashboard at `/admin` to:

- View total revenue, orders, users, and products
- Monitor payment methods (MetaMask, Stripe)
- Track delivery status (Pending, Shipped, Delivered)
- View revenue charts (daily and monthly)
- Manage orders, products, and users

### Admin Routes

| Route | Description |
|-------|-------------|
| `/admin` | Main dashboard |
| `/admin/orders` | Order management |
| `/admin/products` | Product management |
| `/admin/users` | User management |

---

## Payment Integration

### Stripe (Credit/Debit Cards)

1. User adds items to cart
2. Clicks "Pay with Card"
3. Redirected to Stripe Checkout
4. After payment, redirected to success page

### MetaMask (Cryptocurrency)

1. User connects MetaMask wallet
2. Wallet status displayed in header
3. Can pay with ETH at checkout

---

## NFT Marketplace

Access at `/nft-marketplace` for:

- **Marketplace Rankings** - OpenSea, Blur, Magic Eden, etc.
- **Global Statistics** - 24h volume, active traders, total sales
- **Trending Collections** - BAYC, CryptoPunks, Azuki, etc.
- **Market Insights** - Real-time analysis

---

## Scripts

### Root Package

```bash
npm start           # Run client and server together
npm run server      # Run server only
npm run client      # Run client only
npm run install-all # Install all dependencies
```

### Server Package

```bash
npm start              # Start server
npm run dev            # Start with nodemon
npm run migrate-products # Migrate sample products
npm run test-supabase  # Test database connection
```

### Client Package

```bash
npm start   # Start development server
npm run build # Create production build
npm test    # Run tests
```

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000 or 4000
npx kill-port 3000
npx kill-port 4000
```

**Supabase connection failed:**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in `.env`
- Check if your IP is allowed in Supabase dashboard

**Stripe errors:**
- Ensure you're using test keys in development
- Verify STRIPE_KEY starts with `sk_test_`

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

- [React](https://reactjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
