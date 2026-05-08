import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const { cart } = useCartStore();
    const navigate = useNavigate();

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl font-bold tracking-tight text-primary">Shop<span className="text-gray-400">Nest</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/shop" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Shop</Link>
                        <Link to="/categories" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Categories</Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-sm font-semibold text-primary px-3 py-1 bg-gray-100 rounded-full">Admin</Link>
                        )}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-5">
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <Search size={20} className="text-secondary" />
                        </button>
                        
                        <Link to="/wishlist" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                            <Heart size={20} className="text-secondary" />
                        </Link>

                        <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                            <ShoppingCart size={20} className="text-secondary" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <Link to="/profile" className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                </Link>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">Profile</Link>
                                    <Link to="/orders" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">My Orders</Link>
                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2">
                                        <LogOut size={14} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <User size={20} className="text-secondary" />
                            </Link>
                        )}

                        {/* Mobile menu button */}
                        <button className="md:hidden p-2 hover:bg-gray-50 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            <Link to="/shop" className="block px-3 py-4 text-base font-medium text-secondary" onClick={() => setIsMenuOpen(false)}>Shop</Link>
                            <Link to="/categories" className="block px-3 py-4 text-base font-medium text-secondary" onClick={() => setIsMenuOpen(false)}>Categories</Link>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className="block px-3 py-4 text-base font-semibold text-primary" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-soft py-6 px-4 z-40"
                    >
                        <div className="max-w-3xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search for products, brands and more..." 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-0 text-lg"
                                autoFocus
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/shop?search=${e.target.value}`);
                                        setIsSearchOpen(false);
                                    }
                                }}
                            />
                            <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
