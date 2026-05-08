import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import Categories from './pages/Categories';
import Wishlist from './pages/Wishlist';
import { useAuthStore } from './store/useAuthStore';
import Skeleton from './components/Skeleton';

// Protected Route Component
const ProtectedRoute = ({ children, isAdmin = false }) => {
    const { user, checkingAuth } = useAuthStore();

    if (checkingAuth) return <div className="h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
    
    if (!user) return <Navigate to="/login" />;
    
    if (isAdmin && user.role !== 'ADMIN') return <Navigate to="/" />;

    return children;
};

function App() {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/admin/*" element={<ProtectedRoute isAdmin={true}><AdminDashboard /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Footer />
                <Toaster position="bottom-right" />
            </div>
        </Router>
    );
}

export default App;
