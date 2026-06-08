# 🏋️ Gymora - Modern Fitness E-Commerce Platform

## 🚀 Live Demo

**Website:** https://gymora-alpha.vercel.app/

---

## 📖 Overview

Gymora is a modern fitness-focused e-commerce platform built for gym enthusiasts, athletes, and fitness lovers. The platform delivers a complete online shopping experience for gym equipment, fitness accessories, supplements, and workout essentials through a sleek dark-themed user interface and a powerful admin management system.

The application includes secure authentication, product management, shopping cart functionality, wishlist management, order tracking, reviews & ratings, user profile management, AI-powered product assistance, and a dedicated admin dashboard for complete store control.

---

## 📸 Screenshots

### 🏠 Homepage

![Homepage](https://raw.githubusercontent.com/krishnash648/Gymora/main/public/homepage.png)

### 👤 User Dashboard

![User Dashboard](https://raw.githubusercontent.com/krishnash648/Gymora/main/public/user-dashboard.png)

### 🛠️ Admin Dashboard

![Admin Dashboard](https://raw.githubusercontent.com/krishnash648/Gymora/main/public/admin-dashboard.png)

---

## ✨ Features

### 👤 User Features

* Secure User Authentication
* User Dashboard
* Profile Management
* Profile Picture Upload
* Address Management
* Shopping Cart
* Wishlist Management
* Recently Viewed Products
* Product Search
* Product Reviews & Ratings
* Order History
* Order Tracking
* Refund Requests
* Responsive Design

### 🛒 Shopping Features

* Product Catalog
* Product Categories
* Product Details Page
* Search Functionality
* Cart Management
* Wishlist System
* Product Reviews
* Product Rating System
* Order Placement
* Order Tracking

### 🤖 AI Features

* AI Product Chat Assistant
* Product Recommendation Support
* Interactive Product Queries

### 🛠️ Admin Features

* Admin Dashboard
* User Management
* Product Management
* Order Management
* Message Management
* Store Settings
* Dashboard Analytics
* Real-Time Data Updates

---

## 🏗️ Tech Stack

### Frontend

* React.js
* React Router DOM
* React Icons
* CSS3
* Vite

### Backend & Database

* Firebase Authentication
* Firebase Firestore
* Firebase Storage

### Deployment

* Vercel

---

## 📂 Project Structure

```bash
Gymora/
│
├── public/
│   ├── admin-dashboard.png
│   ├── homepage.png
│   ├── user-dashboard.png
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   │
│   ├── assets/
│   │   ├── cart.png
│   │   ├── gym-logo.png
│   │   ├── gym.png
│   │   ├── logo.png
│   │   └── react.svg
│   │
│   ├── components/
│   │   ├── Categories.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductChat.jsx
│   │   ├── ProductDrawer.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useChat.jsx
│   │
│   ├── pages/
│   │   ├── Account.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   ├── Messages.jsx
│   │   ├── Orders.jsx
│   │   ├── Payments.jsx
│   │   ├── Product.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── Users.jsx
│   │   └── Wishlist.jsx
│   │
│   ├── routes/
│   │   └── AdminRoute.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── crud.css
│   ├── firebase-config.js
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
└── README.md
```

---

## 🔐 Authentication

Gymora uses Firebase Authentication to provide:

* Email & Password Authentication
* Persistent Login Sessions
* Protected Routes
* Role-Based Access Control
* Admin/User Authorization

---

## 🔥 Firebase Services Used

### Authentication

Handles user registration, login, and session management.

### Firestore Database

Stores:

* Users
* Products
* Orders
* Reviews
* Wishlist Data
* Recently Viewed Products
* Messages

### Firebase Storage

Stores:

* Profile Images
* Product Images

---

## 📊 Admin Dashboard Modules

### Dashboard

* Total Users
* Total Products
* Total Orders
* Business Overview

### Users

* View Users
* Delete Users
* Manage User Accounts

### Products

* Add Products
* Edit Products
* Delete Products

### Orders

* View Orders
* Update Order Status
* Manage Deliveries

### Messages

* Manage Customer Queries

### Settings

* Store Configuration

---

## 🎨 UI Highlights

* Modern Dark Theme
* Neon Blue Accents
* Responsive Layout
* Professional Dashboard Design
* Smooth User Experience
* Interactive Product Cards
* Mobile Friendly Design
* Clean Navigation System

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/krishnash648/Gymora.git
```

### Move Into Project

```bash
cd Gymora
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## 🔑 Environment Variables

Create a `.env` file and add:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## 🌐 Deployment

The project is deployed using Vercel:

https://gymora-alpha.vercel.app/

---

## 📈 Future Improvements

* Stripe Payment Integration
* Razorpay Integration
* Coupon & Discount System
* AI Product Recommendations
* Multi-Vendor Marketplace
* Inventory Management
* Email Notifications
* Advanced Analytics
* Progressive Web App (PWA)
* Product Comparison Feature

---

## 👨‍💻 Author

**Krishna Sharma**

**GitHub:** https://github.com/krishnash648

**LinkedIn:** https://www.linkedin.com/in/krishna-sharma-539184215/

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

---

## ⭐ Final Note

This project demonstrates:

* Full-Stack Development with React & Firebase
* Authentication & Authorization Systems
* Real-Time Database Integration (Firestore)
* Cloud Storage Management
* E-Commerce Functionality
* Shopping Cart & Wishlist Management
* User & Admin Dashboards
* Product Review & Rating System
* Order Tracking & Management
* AI Product Chat Integration
* Responsive UI/UX Design
* State Management with Context API
* Protected Routes & Role-Based Access Control
* Production Deployment with Vercel
* Real-World Debugging & Problem Solving
* Firebase Security Rules Implementation
* Scalable Frontend Architecture

Gymora was built to simulate a real-world fitness e-commerce platform and showcases modern web development practices, clean UI design, scalable architecture, and production-ready application development.
