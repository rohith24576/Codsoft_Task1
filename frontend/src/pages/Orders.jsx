import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, ArrowLeft, CheckCircle2, Truck, Box, Home, X, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCurrencyStore } from '../store/useCurrencyStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Orders = () => {
    const { user, accessToken } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();
    const { formatPrice } = useCurrencyStore();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = accessToken || localStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/orders/mine`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (response.data && response.data.data) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Order fetch failed:", error);
                // Mock data if server fails
                setOrders([
                    {
                        _id: 'ord123',
                        createdAt: new Date().toISOString(),
                        totalPrice: 155.00,
                        status: 'Shipped',
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

    const trackingSteps = [
        { status: 'Placed', icon: <Box size={16} />, label: 'Placed' },
        { status: 'Processing', icon: <Package size={16} />, label: 'Processing' },
        { status: 'Shipped', icon: <Truck size={16} />, label: 'Shipped' },
        { status: 'Delivered', icon: <Home size={16} />, label: 'Delivered' }
    ];

    const getStatusIndex = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return 3;
        if (s === 'shipped') return 2;
        if (s === 'processing' || s === 'paid') return 1;
        return 0;
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-24">
            <button 
                onClick={() => navigate('/profile')} 
                className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors mb-12 font-bold text-sm group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Back to Profile</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] p-10 shadow-premium border border-gray-100"
            >
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary text-white rounded-2xl">
                            <Package size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-primary tracking-tight">Purchase History</h2>
                    </div>
                    <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em]">{orders.length} Collections</span>
                </div>

                {loading ? (
                    <div className="py-32 text-center">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-secondary font-medium tracking-wide">Fetching your orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-32 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                        <Package size={48} className="mx-auto text-gray-300 mb-6" />
                        <h3 className="text-xl font-bold text-primary mb-2">No orders yet</h3>
                        <p className="text-secondary mb-8">Your wardrobe is waiting to be filled.</p>
                        <button onClick={() => navigate('/shop')} className="btn-primary">Start Shopping</button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order) => (
                            <div 
                                key={order._id} 
                                onClick={() => setSelectedOrder(order)}
                                className="group bg-white rounded-[2.5rem] border border-gray-100 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-xl overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center space-y-8 md:space-y-0 mb-8">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex -space-x-6">
                                                {order.orderItems.map((item, idx) => (
                                                    <img 
                                                        key={idx}
                                                        src={item.image} 
                                                        alt="" 
                                                        className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-premium relative transition-transform group-hover:-translate-y-1"
                                                        style={{ zIndex: 10 - idx }}
                                                    />
                                                ))}
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
                                                <p className="text-sm font-bold text-primary tracking-tight">#{order._id.toUpperCase()}</p>
                                                <div className="flex items-center space-x-2 mt-1 text-secondary">
                                                    <Clock size={10} />
                                                    <span className="text-[10px] font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between md:justify-end md:space-x-12">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-xl font-bold text-primary">{formatPrice(order.totalPrice)}</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-primary/5 text-primary'
                                            }`}>
                                                {order.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mini Progress Bar */}
                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex-grow max-w-md">
                                            <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(getStatusIndex(order.status) / 3) * 100}%` }}
                                                    className="absolute top-0 left-0 h-full bg-primary"
                                                />
                                            </div>
                                            <div className="flex justify-between mt-3 px-1">
                                                {trackingSteps.map((step, idx) => (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        <div className={`text-[8px] font-bold uppercase tracking-widest ${idx <= getStatusIndex(order.status) ? 'text-primary' : 'text-gray-300'}`}>
                                                            {step.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-widest hover:translate-x-1 transition-transform">
                                            <span>Details</span>
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Tracking Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">Live Tracking</h3>
                                        <p className="text-[10px] text-secondary font-bold tracking-widest mt-1 uppercase">Order #{selectedOrder._id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-10">
                                {/* Timeline */}
                                <div className="relative flex justify-between mb-16">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getStatusIndex(selectedOrder.status) / 3) * 100}%` }}
                                        className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0"
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />

                                    {trackingSteps.map((step, idx) => {
                                        const isCompleted = idx <= getStatusIndex(selectedOrder.status);
                                        return (
                                            <div key={idx} className="relative z-10 flex flex-col items-center">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-white shadow-premium transition-all duration-700 ${
                                                    isCompleted ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    {isCompleted ? <CheckCircle2 size={24} /> : step.icon}
                                                </div>
                                                <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Info Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <MapPin size={16} className="text-primary" />
                                            <h4 className="font-bold text-sm text-primary uppercase tracking-widest">Delivery Address</h4>
                                        </div>
                                        <p className="text-xs font-medium text-secondary leading-relaxed">
                                            {user.fullName}<br />
                                            123 Design Avenue, Creative Suite 404<br />
                                            ShopNest City, SN 90210
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Package size={16} className="text-primary" />
                                            <h4 className="font-bold text-sm text-primary uppercase tracking-widest">Package Items</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedOrder.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-[11px] font-bold text-primary truncate max-w-[120px]">{item.name}</span>
                                                    <span className="text-[11px] font-bold text-secondary">{formatPrice(item.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
