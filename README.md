# 🛍️ ShopNest: The Future of Luxury E-Commerce

ShopNest is a premium, full-stack e-commerce ecosystem engineered for high-performance and sophisticated user experiences. This project transcends standard online stores by integrating a **Luxury Design Language** with a robust, scalable backend architecture.

---

## 💎 Project Philosophy
ShopNest was built with three pillars in mind: **Performance, Elegance, and Resilience.**
- **Performance**: Optimized React rendering and lightweight state management with Zustand.
- **Elegance**: A bespoke design system inspired by high-fashion brands, utilizing glassmorphism and fluid motion.
- **Resilience**: A smart "Mock-Sync" backend mode that ensures the UI remains fully functional even during primary database maintenance.

---

## 🚀 Technical Core Stack

### 💻 Frontend Architecture
- **Framework**: [React 18](https://reactjs.org/) (Hooks, Functional Components)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Persistent stores for Cart & Wishlist)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Design Tokens)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Orchestrated spring-based transitions)
- **Icons**: [Lucide React](https://lucide.dev/) (Consistent, accessible iconography)
- **Navigation**: [React Router DOM v6](https://reactrouter.com/)

### ⚙️ Backend Architecture
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (Middleware-first design)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (NoSQL storage)
- **ODM**: [Mongoose](https://mongoosejs.com/) (Schema-based modeling)
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) & [Bcrypt.js](https://github.com/kelektiv/node.bcrypt.js)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/) (Dynamic image optimization)

---

## ✨ Advanced Features & Implementation

### 🛡️ Secure User System
- **JWT-Powered Auth**: Secure, stateless authentication with Access & Refresh tokens.
- **Role-Based Access**: Specialized views and permissions for Admin and Regular Users.
- **Profile Management**: Dynamic avatar uploads and order history tracking.

### 🔍 Intelligence Search & Filter
- **Multi-Vector Search**: Regex-powered search across product titles and detailed descriptions.
- **Categorical Intelligence**: Real-time filtering with URL-state synchronization (deep linking support).
- **Sorting Engine**: Client-side sorting for price, ratings, and newest arrivals.

### 📦 Commerce Logic
- **Persistent Bag**: Automated local-storage synchronization ensures zero data loss on refresh.
- **Tiered Coupon System**: Logic-based discount engine (`SAVE300`, `VIP500`) applied based on real-time subtotal calculations.
- **Dynamic Wishlist**: Heart-toggle system integrated across Product Cards and individual Detail pages.

---

## 📡 API Endpoints (Documentation)

### 🛍️ Products
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/products` | Fetch all products (with filters) | Public |
| GET | `/api/v1/products/:id` | Get detailed product info | Public |
| POST | `/api/v1/products` | Create new product | Admin |
| GET | `/api/v1/products/featured` | Get top-rated featured items | Public |

### 📂 Categories
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/api/v1/categories` | List all product categories | Public |
| POST | `/api/v1/categories` | Create new category | Admin |

### 🎫 Coupons
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/v1/coupons/validate` | Check if a coupon is valid | User |

---

## 📂 Advanced Project Structure

```text
ShopNest/
├── frontend/
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Atomic UI components
│       │   ├── ProductCard/ # Reusable product grid item
│       │   ├── Navbar/      # Sticky blur-navigation
│       │   └── Skeleton/    # Shimmer loading states
│       ├── pages/           # Page-level components
│       ├── store/           # Zustand state slices
│       └── utils/           # API interceptors & formatters
└── backend/
    └── src/
        ├── controllers/     # MVC: Logic handlers
        ├── models/          # MongoDB Schema definitions
        ├── routes/          # Express Router endpoints
        ├── db/              # Database connection logic
        ├── middlewares/     # Auth, Upload, and Error handlers
        └── utils/           # Global API response/error wrappers
```

---

## 🛠️ Installation & Deployment

### Environment Variables (.env)
Required keys for full functionality:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_ultra_secret_key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
USE_MOCK_DB=true # Set to false for live DB connection
```

### Installation Steps
1. **Clone & Install**: `npm install` in both folders.
2. **Database Seed**: Run `npm run seed` in backend to populate categories.
3. **Development**: Use `npm run dev` for hot-reloading on both tiers.

---

## 👤 Author & Contribution

**Rohith**  
*Lead Developer - ShopNest Ecosystem*

- **GitHub**: [@rohith24576](https://github.com/rohith24576)
- **Project Link**: [ShopNest Repository](https://github.com/rohith24576/Codsoft_Task1)

---
🏆 *Developed as a high-fidelity project for the Codsoft Web Development Fellowship.*
