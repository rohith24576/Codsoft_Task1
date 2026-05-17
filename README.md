# 🛍️ ShopNest: The Future of Luxury E-Commerce

ShopNest is a premium, full-stack e-commerce ecosystem engineered for high-performance and sophisticated user experiences. This project transcends standard online stores by integrating a **Luxury Design Language** with a robust, scalable backend architecture.

---

## 🌐 Live Production Ecosystem

Experience the fully deployed ShopNest platform live. Our architecture is globally distributed across top-tier cloud providers for maximum speed, reliability, and zero cold-start latency.

| Architecture Layer | Cloud Provider | Live Endpoint / Status | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **🎨 Client Storefront** | **Vercel** | [https://codsoft-task1-lovat.vercel.app/](https://codsoft-task1-lovat.vercel.app/) | Global Edge CDN, instant page loads, and fully responsive luxury UI. |
| **⚙️ Core API Engine** | **Railway** | [https://codsofttask1-production.up.railway.app](https://codsofttask1-production.up.railway.app) | High-performance Express backend, automated CI/CD, and zero sleep latency. |
| **🗄️ Database Grid** | **MongoDB Atlas** | MongoDB Atlas Cloud Cluster | Fully managed cloud NoSQL database ensuring secure user and order persistence. |

> **💡 Demo Tip:** You can explore the storefront, apply the coupon code `WELCOME10` for an instant 10% discount, and complete a full checkout simulation instantly!

---

## 💎 Project Philosophy
ShopNest was built with three pillars in mind: **Performance, Elegance, and Resilience.**
- **Performance**: Optimized React rendering using virtual DOM efficiency and lightweight state management.
- **Elegance**: A bespoke design system inspired by high-fashion brands, utilizing glassmorphism, fluid motion, and high-fidelity typography.
- **Resilience**: A smart "Mock-Sync" backend mode that ensures the UI remains fully functional even during primary database maintenance or network interruptions.

---

## ✨ Extensive Feature Showcase

### 🎨 Elite Visual Experience
- **Luxury Hero Section**: An immersive, full-screen landing experience featuring layered parallax animations and high-fashion imagery that captures attention instantly.
- **Premium Design System**: Built with custom HSL color palettes and a focus on white space, creating a "breathable" and high-end aesthetic.
- **Responsive Fluidity**: Engineered with a mobile-first approach, ensuring that luxury is accessible on any device, from 4K monitors to smartphones.
- **Glassmorphism Components**: Utilizing modern backdrop-blur filters for navigation bars and product overlays, providing a futuristic and premium depth.

### 🛒 Advanced Commerce Intelligence
- **Intelligent Multi-Vector Search**: A high-performance search engine that utilizes regular expressions to scan product titles, categories, and descriptions simultaneously.
- **Persistent Shopping Ecosystem**: Integrated Zustand stores with middleware persistence ensure that a user's Cart and Wishlist are saved across browser sessions and device refreshes.
- **Tiered Discount Engine**: Automated real-time calculation of tiered discounts (15% off for $300+, 25% off for $500+) with visual feedback in the shopping bag.
- **Dynamic Category Hub**: A reactive filtering system that synchronizes URL parameters with the UI state, allowing for deep-linking into specific product collections.

---

## 🚀 Technical Deep-Dive

### 💻 Frontend Engineering
- **React 18**: Leveraging the latest concurrent features for ultra-smooth UI updates.
- **Zustand**: Chosen over Redux for its zero-boilerplate approach and high-performance state updates, essential for real-time cart calculations.
- **Tailwind CSS**: A utility-first styling engine used to build a consistent design system without the overhead of heavy CSS files.
- **Framer Motion**: Orchestrated animations for every interaction—from page transitions to button hovers—creating a "living" interface.
- **Lucide React**: A lightweight icon library providing clean, pixel-perfect visuals.

### ⚙️ Backend Architecture
- **Node.js & Express**: A fast, event-driven runtime paired with a flexible routing middleware for high-concurrency request handling.
- **MongoDB Atlas**: A distributed NoSQL database providing high availability and flexible schema design for diverse product catalogs.
- **Mongoose ODM**: Implementing strict schema validation and powerful query building for data integrity.
- **JWT Security**: Implementing stateless authentication with industry-standard JSON Web Tokens for secure API access.
- **Bcrypt.js**: High-entropy password hashing for maximum user data protection.

---

## 🛠️ Installation & Expert Setup

### 1. Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn
- A MongoDB Atlas account
- A Cloudinary account (for image hosting)

### 2. Environment Configuration
Create a `.env` file in the `/backend` directory with the following keys:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=generate_a_long_random_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
USE_MOCK_DB=true # Set to false once your MongoDB is connected
```

### 3. Step-by-Step Installation
```bash
# Clone the master repository
git clone https://github.com/rohith24576/Codsoft_Task1.git
cd ShopNest

# Install Server-side dependencies
cd backend
npm install

# Seed the Database (Optional but Recommended)
# This populates categories and initial product data
npm run seed

# Install Client-side dependencies
cd ../frontend
npm install

# Launch the Ecosystem
# Open two terminals and run:
cd backend && npm run dev
cd frontend && npm run dev
```

---

## 🤝 How to Contribute

We love contributions! Follow these steps to help improve ShopNest:

1. **Fork the Project**: Click the Fork button at the top of the repository.
2. **Create a Feature Branch**: 
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit Your Changes**: Use descriptive commit messages:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. **Push to the Branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**: Submit your PR for review and we'll merge it after testing.

### 📜 Contribution Rules:
- Maintain consistent coding styles (ESLint/Prettier).
- Document any new API endpoints in the README.
- Ensure all new components are fully responsive.

---

## 📂 Project Architecture

```text
ShopNest/
├── frontend/
│   ├── public/              # Static assets and icons
│   └── src/
│       ├── components/      # UI components (Atomic design)
│       │   ├── ProductCard/ # Premium grid items
│       │   ├── Navbar/      # Glassmorphism header
│       │   └── Skeleton/    # Shimmer loading states
│       ├── pages/           # High-level route components
│       ├── store/           # Zustand state slices (Cart, Auth, Product)
│       └── utils/           # Axios interceptors and helper functions
└── backend/
    └── src/
        ├── controllers/     # MVC Logic: Handlers for API requests
        ├── models/          # Mongoose Schemas (Product, User, Category)
        ├── routes/          # Express Router definition
        ├── db/              # Database connection logic
        ├── middlewares/     # JWT Auth, File Upload, and Global Error handlers
        └── utils/           # Global response wrappers and error classes
```

---

## 👤 Developer Profile

**Rohith**  
*Lead Architect & Full Stack Developer*

- **GitHub**: [@rohith24576](https://github.com/rohith24576)
- **Portfolio**: [Coming Soon]
- **Email**: [your-email@example.com]

---
🏆 *Developed with passion for the Codsoft Web Development Fellowship.*
