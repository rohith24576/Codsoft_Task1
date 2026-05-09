import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, RefreshCw, Undo2, ArrowLeft, Search, ShoppingBag, CheckCircle2, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Returns = () => {
    const { user, accessToken } = useAuthStore();
    const { openChat } = useChatStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = accessToken || localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:5000/api/v1/orders/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.data) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Order fetch failed:", error);
                setOrders([
                    {
                        _id: 'ord123',
                        createdAt: new Date().toISOString(),
                        totalPrice: 155.00,
                        status: 'Delivered',
                        orderItems: [
                            { name: 'Premium Cotton Tee', price: 45, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800' },
                            { name: 'Derby Shoes', price: 110, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' }
                        ]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user, accessToken]);

    const handleAction = (type, productName) => {
        const message = type === 'return' 
            ? `Return request for ${productName} submitted successfully! 📦` 
            : `Exchange request for ${productName} initiated! 🔄`;
        
        toast.success(message, {
            duration: 4000,
            style: {
                background: '#1A1A1A',
                color: '#fff',
                borderRadius: '1rem',
                fontSize: '14px',
                fontWeight: '600'
            }
        });
    };

    if (!user) return (
        <div className="h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <Package size={48} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-primary mb-2">Please log in to manage returns</h3>
                <button onClick={() => navigate('/login')} className="btn-primary mt-4">Login Now</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/30 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-full text-primary mb-6"
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Self-Service Portal</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold text-primary tracking-tight"
                        >
                            Returns & <span className="text-gray-400 font-light italic">Exchanges.</span>
                        </motion.h1>
                    </div>
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-soft focus:ring-1 focus:ring-primary/20 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Orders List */}
                <div className="space-y-10">
                    {loading ? (
                        <div className="py-32 text-center bg-white rounded-[3rem] shadow-premium border border-gray-100">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-secondary font-medium tracking-wide">Syncing your order history...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-32 text-center bg-white rounded-[3rem] shadow-premium border border-gray-100">
                            <ShoppingBag size={48} className="mx-auto text-gray-200 mb-6" />
                            <h3 className="text-xl font-bold text-primary mb-2">No items to return</h3>
                            <p className="text-secondary mb-8 font-medium">Your purchase history is empty.</p>
                            <button onClick={() => navigate('/shop')} className="btn-primary">Start Shopping</button>
                        </div>
                    ) : (
                        orders.map((order, orderIdx) => (
                            <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: orderIdx * 0.1 }}
                                className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden"
                            >
                                <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                                            <p className="text-sm font-bold text-primary">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200" />
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                            <p className="text-sm font-bold text-primary">#{order._id.toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-sm font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="p-8 space-y-10">
                                    {order.orderItems.map((item, itemIdx) => (
                                        <div key={itemIdx} className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
                                            <div className="flex items-center space-x-6 w-full sm:w-auto">
                                                <div className="w-24 h-24 rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-primary mb-1">{item.name}</h4>
                                                    <p className="text-xs font-bold text-secondary uppercase tracking-widest">${item.price}</p>
                                                    <div className="mt-3 flex items-center space-x-2 text-green-500">
                                                        <CheckCircle2 size={12} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Eligible for return until {new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 30)).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 w-full sm:w-auto">
                                                <button onClick={() => handleAction('return', item.name)} className="flex-grow sm:flex-grow-0 px-6 py-4 border border-gray-200 rounded-2xl text-xs font-bold text-secondary hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center space-x-2">
                                                    <Undo2 size={14} />
                                                    <span>Return Item</span>
                                                </button>
                                                <button onClick={() => handleAction('exchange', item.name)} className="flex-grow sm:flex-grow-0 px-6 py-4 bg-primary text-white rounded-2xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center space-x-2">
                                                    <RefreshCw size={14} />
                                                    <span>Exchange</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-20 p-10 bg-gray-100 rounded-[3rem] text-center">
                    <h3 className="text-xl font-bold text-primary mb-2">Need help with your return?</h3>
                    <p className="text-secondary mb-6 text-sm font-medium">Our support team is available 24/7 to assist with your exchange process.</p>
                    <button 
                        onClick={openChat}
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <MessageCircle size={16} />
                        <span>Chat with Support</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Returns;
