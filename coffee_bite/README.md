# ☕ Coffee_Bite — Full Stack Web App

A complete coffee shop ordering website built with **React**, **Node.js + Express**, and **PostgreSQL**.

---

## 🗂 Project Structure

```
coffee_bite/
├── database/
│   └── schema.sql          # PostgreSQL schema + seed data
├── backend/                # Node.js + Express API
│   ├── server.js
│   ├── db.js
│   ├── .env.example
│   ├── middleware/auth.js
│   └── routes/
│       ├── auth.js         # Register / Login / Me
│       ├── products.js     # List products & categories
│       └── orders.js       # Place & view orders
└── frontend/               # React app
    └── src/
        ├── App.jsx
        ├── context/        # Auth & Cart context
        ├── components/     # Navbar
        └── pages/          # Home, Login, Signup, Cart, Checkout, Orders
```

---

## 🚀 Setup Guide

### 1. Database (PostgreSQL)

```bash
# Create database
createdb coffee_bite

# Run schema & seed data
psql -d coffee_bite -f database/schema.sql
```

### 2. Backend (Node.js + Express)

```bash
cd backend
npm install

# Copy and fill in your .env
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

npm run dev   # Development (nodemon)
# or
npm start     # Production
```

The API will run on **http://localhost:5000**

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

The React app will run on **http://localhost:3000**
(The `"proxy"` in package.json forwards `/api/*` requests to the backend automatically.)

---

## 🔌 API Endpoints

| Method | Endpoint             | Auth? | Description              |
|--------|----------------------|-------|--------------------------|
| POST   | /api/auth/register   | No    | Create account           |
| POST   | /api/auth/login      | No    | Login & receive JWT      |
| GET    | /api/auth/me         | Yes   | Get current user         |
| GET    | /api/products        | No    | List all products        |
| GET    | /api/products/categories | No | List categories         |
| GET    | /api/products/:id    | No    | Single product           |
| POST   | /api/orders          | Yes   | Place an order           |
| GET    | /api/orders/my       | Yes   | User's order history     |
| GET    | /api/orders/:id      | Yes   | Single order detail      |

---

## ✨ Features

- 🧾 **Menu listing** with category filter tabs
- 🛒 **Shopping cart** with quantity controls (persisted to localStorage)
- 🔐 **User auth** — sign up / login with JWT tokens
- 📦 **Order placement** with optional special instructions
- 📋 **Order history** — view all past orders
- 📱 **Fully responsive** mobile-friendly design
- ☕ **Coffee_Bite branding** — warm espresso colour palette

---

## 🛠 Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18, React Router v6   |
| Backend  | Node.js, Express 4          |
| Database | PostgreSQL                  |
| Auth     | JWT (jsonwebtoken), bcryptjs|
| Styling  | Custom CSS (no UI library)  |
