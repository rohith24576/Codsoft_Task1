# ShopNest - Modern E-Commerce Platform

ShopNest is a full-stack, modern, and minimal e-commerce platform built with React, Node.js, Express, and MongoDB. It features a clean UI, smooth animations, and a comprehensive set of features for both users and administrators.

## 🚀 Features

### User Features
- **Modern UI**: Clean, minimal white-theme design with smooth transitions.
- **Authentication**: Secure JWT-based login and registration.
- **Product Discovery**: Browse by categories, search with autocomplete, and filter by price/sort.
- **Shopping Experience**: Add to cart, wishlist, and recently viewed tracking.
- **Checkout**: Integrated coupon system and secure checkout flow.
- **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.

### Admin Features
- **Dashboard**: Overview of sales analytics and store performance.
- **Inventory Management**: Add, edit, and delete products and categories.
- **Order Management**: Track and update order statuses.
- **User & Coupon Management**: Manage store users and active discount codes.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Zustand (State Management), Lucide React.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **Authentication**: JWT & Bcrypt.js.
- **Storage**: Cloudinary (Image Uploads).

## 📦 Getting Started

### Prerequisites
- Node.js installed.
- MongoDB Atlas account.
- Cloudinary account for images.

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ShopNest
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env from .env.example and fill in your credentials
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create .env from .env.example
   npm run dev
   ```

## 📄 Deployment Guide

Refer to the [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to Render.

## 📝 License
This project is licensed under the MIT License.
