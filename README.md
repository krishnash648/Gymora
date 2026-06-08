# 🏋️ Gymora - Modern Fitness E-Commerce Platform

![Gymora Banner](https://gymora-alpha.vercel.app/)

## 🚀 Live Demo

**Website:** https://gymora-alpha.vercel.app/

---

## 📖 Overview

Gymora is a modern fitness-focused e-commerce platform built for gym enthusiasts and athletes. The application provides a complete online shopping experience for fitness products, accessories, and gym essentials through a sleek dark-themed user interface and powerful admin management system.

The platform includes user authentication, product management, shopping cart functionality, order tracking, wishlist management, profile management, and a dedicated admin dashboard for complete store control.

---

## ✨ Features

### 👤 User Features

- Secure User Authentication
- User Dashboard
- Profile Management
- Upload Profile Picture
- Shopping Cart
- Wishlist Management
- Product Search
- Product Reviews & Ratings
- Order History
- Order Tracking
- Refund Requests
- Recently Viewed Products
- Address Management
- Responsive Design

### 🛒 Shopping Features

- Product Catalog
- Product Details Page
- Product Categories
- Product Search
- Product Reviews
- Wishlist System
- Cart Management
- Order Placement
- Order Tracking
- Rating System

### 🛠️ Admin Features

- Admin Dashboard
- User Management
- Product Management
- Order Management
- Message Management
- Store Settings
- Dashboard Analytics
- Real-Time Data Updates

---

## 🏗️ Tech Stack

### Frontend

- React.js
- React Router DOM
- React Icons
- CSS3
- Vite

### Backend & Database

- Firebase Authentication
- Firebase Firestore
- Firebase Storage

### Deployment

- Vercel

---

## 📂 Project Structure

```bash
src/
│
├── assets/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│
├── context/
│   ├── AuthContext.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── ProductDetails.jsx
│   ├── UserDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── Users.jsx
│   ├── Product.jsx
│   ├── Orders.jsx
│   ├── Messages.jsx
│   └── Settings.jsx
│
├── firebase-config.js
│
├── App.jsx
└── main.jsx
```

## 🔐 Authentication

Gymora uses Firebase Authentication to provide:

- Email & Password Authentication
- Persistent Login Sessions
- Role-Based Access Control
- Protected Routes
- Admin/User Authorization

---

## 🔥 Firebase Services Used

### Authentication

User registration and login management.

### Firestore Database

Stores:

- Users
- Products
- Orders
- Reviews
- Wishlist
- Recently Viewed Products

### Firebase Storage

Stores:

- Profile Images
- Product Images

---

## 📊 Admin Dashboard Modules

### Dashboard

- Total Users
- Total Products
- Total Orders

### Users

- View Users
- Delete Users

### Products

- Add Products
- Edit Products
- Delete Products

### Orders

- Manage Customer Orders
- Update Order Status

### Messages

- Manage Contact Requests

### Settings

- Store Configuration

---

## 🎨 UI Highlights

- Modern Dark Theme
- Neon Blue Accents
- Responsive Layout
- Interactive Dashboard
- Smooth User Experience
- Professional Admin Panel
- Mobile Friendly Design

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/krishnash648/gymora.git
```

### Move Into Project

```bash
cd gymora
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

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

- Stripe Payments
- Razorpay Integration
- Coupon System
- AI Product Recommendations
- Multi-Vendor Support
- Inventory Management
- Email Notifications
- Advanced Analytics
- PWA Support

---

## 👨‍💻 Developer

Built by Krishna Sharma

### Connect

- GitHub: https://github.com/
- LinkedIn: https://linkedin.com/

---

## ⭐ Support

If you like this project, give it a star on GitHub and share it with others.

---

## 👨‍💻 Author

**Krishna Sharma**

**GitHub:** https://github.com/krishnash648

**LinkedIn:** https://www.linkedin.com/in/krishna-sharma-539184215/

---

## ⭐ Final Note

This project demonstrates:

- Full-Stack Development with React & Firebase
- Authentication & Authorization Systems
- Real-Time Database Integration (Firestore)
- Cloud Storage Management
- E-Commerce Functionality
- Shopping Cart & Wishlist Management
- User & Admin Dashboards
- Product Review & Rating System
- Order Tracking & Management
- Responsive UI/UX Design
- State Management & Context API
- Protected Routes & Role-Based Access Control
- Production Deployment with Vercel
- Real-World Debugging & Problem Solving
- Firebase Security Rules Implementation
- Scalable Frontend Architecture

This project was built to simulate a real-world fitness e-commerce platform and showcases modern web development practices, clean UI design, and production-ready application development.
