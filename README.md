# 🛍️ ShopNest - Premium E-Commerce Experience

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

ShopNest is a state-of-the-art, full-stack e-commerce platform designed with a **Luxury Minimalist** aesthetic. It provides a seamless shopping experience featuring dynamic product filtering, persistent state management, and a high-performance backend.

---

## ✨ Key Features

### 💎 Premium User Interface
- **Luxury Hero Section**: Immersive high-fashion visuals with layered parallax animations.
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop.
- **Glassmorphism UI**: Modern blurred-glass effects for a sophisticated "Elite" feel.

### 🛒 Advanced Shopping Experience
- **Dynamic Filtering**: Instant filtering by category (Men, Women, Accessories, Footwear).
- **Smart Search**: High-performance search that scans both product names and descriptions.
- **Persistent Cart & Wishlist**: Zustand-powered stores that save your items across browser refreshes.
- **Tiered Special Offers**: Automated discount banners for high-value orders ($300+ and $500+).

### ⚙️ Robust Architecture
- **Mock Database Mode**: Resilient development environment that works even during database downtime.
- **RESTful API**: Clean, scalable backend built with Node.js and Express.
- **Cloudinary Integration**: High-speed image hosting for crisp product visuals.

---

## 🚀 Tech Stack

**Frontend:**
- **React.js**: Component-based UI library.
- **Tailwind CSS**: Utility-first styling for premium design.
- **Zustand**: Lightweight, persistent state management.
- **Framer Motion**: Smooth, high-end micro-animations.
- **Lucide React**: Beautiful, consistent iconography.

**Backend:**
- **Node.js & Express**: Fast and scalable server-side environment.
- **Mongoose/MongoDB**: Powerful NoSQL database integration.
- **JWT Authentication**: Secure user sessions and role-based access.

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rohith24576/Codsoft_Task1.git
cd Codsoft_Task1
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
USE_MOCK_DB=true
```

### 4. Run Locally
```bash
# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev
```

---

## 📂 Project Structure

```text
ShopNest/
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Main views (Home, Shop, Cart)
│   │   └── store/       # Zustand state management
├── backend/
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Database schemas
│   │   └── routes/      # API endpoints
└── README.md
```

---

## 👤 Author

**Rohith**
- GitHub: [@rohith24576](https://github.com/rohith24576)

---
*Created as part of the Codsoft Web Development Internship.*
