import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, LogOut, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useChatStore } from '../store/useChatStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    const { user, logout } = useAuthStore();
    const { cart, shippingThreshold, getCartTotal } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();
    const { currency, toggleCurrency, formatPrice } = useCurrencyStore();

    // Close search on route change
    useEffect(() => {
        setIsSearchOpen(false);
        setSearchTerm('');
    }, [location]);

    const { subtotal } = getCartTotal();
    const cartCount = cart?.reduce((acc, item) => acc + (item?.qty || 0), 0) || 0;
    const shippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);

    // Live Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/products?search=${searchTerm}`);
                if (response?.data?.data?.products) {
                    setSearchResults(response.data.data.products.slice(0, 5));
                }
            } catch (error) {
                console.error('Search error', error);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    return (
        <nav className="sticky top-0 z-50 flex flex-col">
            {/* Free Shipping Progress Bar */}
            {cartCount > 0 && user?.role !== 'ADMIN' && (
                <div className="bg-gray-50 h-8 flex flex-col relative overflow-hidden group">
                    <div className="flex-grow flex items-center justify-center px-4 relative z-10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center space-x-2">
                            {shippingProgress >= 100 ? (
                                <span className="text-green-600 flex items-center space-x-1">
                                    <CheckCircle size={12} />
                                    <span>🎉 Congratulations! Free Shipping applied.</span>
                                </span>
                            ) : (
                                <span>You're only { formatPrice(shippingThreshold - subtotal) } away from Free Shipping!</span>
                            )}
                        </p>
                    </div>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        className={`absolute bottom-0 left-0 h-1 transition-colors duration-500 ${shippingProgress >= 100 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary'}`}
                    />
                </div>
            )}

            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-bold tracking-tight text-primary">Shop<span className="text-gray-400">Nest</span></span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {user?.role !== 'ADMIN' && (
                                <>
                                    <Link to="/shop" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Shop</Link>
                                    <Link to="/categories" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Categories</Link>
                                    <Link to="/returns" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Returns & Exchanges</Link>
                                </>
                            )}
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className="text-sm font-semibold text-primary px-3 py-1 bg-gray-100 rounded-full">Admin Control Panel</Link>
                            )}
                        </div>

                        {/* Icons & Personalized Greeting */}
                        <div className="flex items-center space-x-5">
                            {user && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="hidden lg:block border-r border-gray-100 pr-5"
                                >
                                    <p className="text-xs font-medium text-secondary">
                                        Welcome back, <span className="font-bold text-primary">{user.fullName?.split(' ')[0]}!</span> 👋
                                    </p>
                                </motion.div>
                            )}

                            {user?.role !== 'ADMIN' && (
                                <>
                                    {/* Currency Toggle */}
                                    <button 
                                        onClick={toggleCurrency}
                                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-full transition-all text-sm font-bold text-primary"
                                        title={`Switch to ${currency === 'USD' ? 'INR (₹)' : 'USD ($)'}`}
                                    >
                                        <RefreshCw size={12} className="text-secondary" />
                                        <span>{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
                                    </button>

                                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                                        <Search size={20} className={isSearchOpen ? "text-primary" : "text-secondary"} />
                                    </button>
                                    
                                    <Link to="/wishlist" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
                                        <Heart size={20} className="text-secondary" />
                                    </Link>

                                    <div className="relative group/cart">
                                        <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative block">
                                            <ShoppingCart size={20} className="text-secondary" />
                                            {cartCount > 0 && (
                                                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Floating Cart Preview */}
                                        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-[2rem] shadow-premium opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 z-50 overflow-hidden">
                                            <div className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-sm font-bold text-primary">Your Bag</h4>
                                                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{cartCount} Items</span>
                                                </div>

                                                {cart && cart.length > 0 ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-3">
                                                            {cart.slice(-2).reverse().map((item) => (
                                                                <div key={item._id} className="flex items-center space-x-3">
                                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                                        <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-grow min-w-0">
                                                                        <p className="text-xs font-bold text-primary truncate">{item.name}</p>
                                                                        <p className="text-[10px] text-secondary font-medium">Qty: {item.qty} • {formatPrice(item.price)}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="pt-4 border-t border-gray-50 space-y-3">
                                                            <Link to="/cart" className="w-full bg-primary text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-2">
                                                                <span>View Cart</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-4 text-center">
                                                        <p className="text-xs text-secondary font-medium">Your bag is empty</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {user ? (
                                <div className="relative group">
                                    <Link to="/profile" className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                                        <img src={user.avatar || "/default-avatar.svg"} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                    </Link>
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">Profile</Link>
                                        {user?.role !== 'ADMIN' && (
                                            <Link to="/orders" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">My Orders</Link>
                                        )}
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

                            <button className="md:hidden p-2 hover:bg-gray-50 rounded-full" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search Overlay & Autocomplete */}
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
                                    placeholder="Search for products..." 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-1 focus:ring-primary/20 text-lg"
                                    autoFocus
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} className="text-gray-400" />
                                </button>

                                <AnimatePresence>
                                    {searchResults && searchResults.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 right-0 mt-4 bg-white rounded-[2rem] shadow-premium border border-gray-100 overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Matching Products</p>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {searchResults.map((product) => (
                                                    <Link 
                                                        key={product._id}
                                                        to={`/product/${product._id}`}
                                                        onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                                                        className="flex items-center p-4 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                                            <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        </div>
                                                        <div className="ml-4 flex-grow">
                                                            <h4 className="text-sm font-bold text-primary">{product.name}</h4>
                                                            <p className="text-xs text-secondary font-medium">{formatPrice(product.price)}</p>
                                                        </div>
                                                        <ArrowRight size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                            <Link to="/returns" className="block px-3 py-4 text-base font-medium text-secondary border-b border-gray-50" onClick={() => setIsMenuOpen(false)}>Returns & Exchanges</Link>
                            <Link to="/faqs" className="block px-3 py-4 text-base font-medium text-secondary border-b border-gray-100" onClick={() => setIsMenuOpen(false)}>FAQs</Link>
                            <button 
                                onClick={() => { setIsMenuOpen(false); openChat(); }}
                                className="w-full text-left px-3 py-4 text-base font-medium text-primary flex items-center justify-between"
                            >
                                <span>Support Chat</span>
                                <ArrowRight size={16} />
                            </button>
                            {user?.role === 'ADMIN' && (
                                <Link to="/admin" className="block px-3 py-4 text-base font-semibold text-primary" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
