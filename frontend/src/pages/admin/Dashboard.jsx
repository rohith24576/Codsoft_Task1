import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Plus, Edit, Trash2, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalUsers: 12 });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const { products, fetchProducts, deleteProduct } = useProductStore();

    useEffect(() => {
        fetchProducts();
        
        const fetchAdminData = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                // Fetch stats
                const statsRes = await axios.get('http://localhost:5000/api/v1/orders/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(prev => ({ ...prev, ...statsRes.data.data }));

                // Fetch all orders
                const ordersRes = await axios.get('http://localhost:5000/api/v1/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(ordersRes.data.data);
            } catch (err) {
                console.error("Admin fetch failed", err);
            }
        };
        fetchAdminData();
    }, [fetchProducts]);

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.totalSales.toFixed(2)}`, trend: '+14.2%', icon: DollarSign, color: 'text-emerald-500', glow: 'shadow-emerald-200', bg: 'bg-emerald-50', gradient: 'from-emerald-400 to-teal-500' },
        { label: 'Total Orders', value: orders.length, trend: '+8.1%', icon: ShoppingBag, color: 'text-blue-500', glow: 'shadow-blue-200', bg: 'bg-blue-50', gradient: 'from-blue-400 to-indigo-500' },
        { label: 'Total Products', value: products.length, trend: 'Stable', icon: Package, color: 'text-fuchsia-500', glow: 'shadow-fuchsia-200', bg: 'bg-fuchsia-50', gradient: 'from-fuchsia-400 to-pink-500' },
        { label: 'Active Users', value: stats.totalUsers, trend: '+2.4%', icon: Users, color: 'text-orange-500', glow: 'shadow-orange-200', bg: 'bg-orange-50', gradient: 'from-orange-400 to-amber-500' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 space-y-6 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-black text-primary tracking-tight">Executive Dashboard</h1>
                    <p className="text-secondary mt-2 font-medium">Real-time enterprise overview and global commerce insights.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex bg-gray-100 p-1 rounded-[1.5rem]">
                        <button 
                            onClick={() => setActiveTab('products')}
                            className={`px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                        >
                            Inventory
                        </button>
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-8 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-primary'}`}
                        >
                            Sales
                        </button>
                    </div>
                    <button className="px-8 py-3.5 bg-primary text-white text-xs font-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl uppercase tracking-widest flex items-center space-x-3">
                        <Plus size={18} />
                        <span>Add Asset</span>
                    </button>
                </div>
            </div>

            {/* Ambient Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-emerald-500/5 rounded-full blur-[150px] animate-bounce-slow" />
            </div>

            {/* Futuristic Ambient Hub */}
            <div className="relative z-10 flex flex-col items-center mb-24">
                {/* Central Revenue Orb (The Sun) */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-80 h-80 flex items-center justify-center mb-20"
                >
                    <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-20 animate-pulse" />
                    <div className="absolute inset-0 border-[1px] border-primary/20 rounded-full animate-spin-slow" />
                    <div className="absolute inset-4 border-[1px] border-primary/10 rounded-full animate-reverse-spin" />
                    
                    <div className="w-64 h-64 bg-white/40 backdrop-blur-3xl rounded-full border border-white/60 shadow-2xl flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Total Revenue</p>
                        <h2 className="text-5xl font-black text-primary tracking-tighter mb-2">
                            ${stats.totalSales.toFixed(0)}
                        </h2>
                        <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                            +14.2% Trend
                        </div>
                    </div>
                </motion.div>

                {/* Satellite Orbs (The Planets) */}
                <div className="flex flex-wrap justify-center gap-12 max-w-4xl">
                    {[
                        { label: 'Sales', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500' },
                        { label: 'Asset', value: products.length, icon: Package, color: 'bg-fuchsia-500' },
                        { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-orange-500' }
                    ].map((orb, i) => (
                        <motion.div 
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            whileHover={{ y: -10 }}
                            className="flex flex-col items-center group"
                        >
                            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                <div className={`absolute inset-0 ${orb.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-all duration-500`} />
                                <div className="w-32 h-32 bg-white/60 backdrop-blur-2xl rounded-full border border-white shadow-xl flex flex-col items-center justify-center transition-all group-hover:bg-white">
                                    <orb.icon size={24} className="text-primary mb-2 opacity-40 group-hover:opacity-100 transition-all" />
                                    <h4 className="text-2xl font-black text-primary tracking-tight">{orb.value}</h4>
                                    <p className="text-secondary text-[8px] font-black uppercase tracking-widest">{orb.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'products' ? (
                    <motion.div 
                        key="products"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/40 backdrop-blur-2xl rounded-[4rem] border border-white/60 shadow-soft overflow-hidden"
                    >
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h2 className="text-2xl font-bold text-primary">Inventory Management</h2>
                            <span className="text-sm font-bold text-secondary">{products.length} Products Active</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Product Info</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Category</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Pricing</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Stock Level</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-primary">{product.name}</p>
                                                        <p className="text-xs text-secondary mt-1">ID: #{product._id.substring(0, 8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-secondary font-medium">{product.category?.name}</td>
                                            <td className="px-10 py-8">
                                                <p className="font-bold text-primary text-lg">${product.price}</p>
                                                {product.discountPrice > 0 && <p className="text-xs text-green-500 font-bold">On Sale</p>}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                                                    <span className={`text-sm font-bold ${product.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {product.stock} Units
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button 
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                        className="p-3 hover:bg-white rounded-2xl text-secondary hover:text-primary transition-all shadow-sm"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteProduct(product._id)}
                                                        className="p-3 hover:bg-white rounded-2xl text-secondary hover:text-red-500 transition-all shadow-sm"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="orders"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-[3rem] border border-gray-100 shadow-soft overflow-hidden"
                    >
                        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <h2 className="text-2xl font-bold text-primary">Master Order History</h2>
                            <span className="text-sm font-bold text-secondary">{orders.length} Total Sales</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Order ID</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Customer</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Date</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Revenue</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-secondary text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-3">
                                                    <div className="p-2 bg-primary/5 text-primary rounded-lg">
                                                        <ShoppingBag size={16} />
                                                    </div>
                                                    <span className="font-bold text-primary uppercase">#{order._id.substring(order._id.length - 8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="font-bold text-primary">{order.user?.fullName || 'Demo User'}</p>
                                                <p className="text-xs text-secondary mt-0.5">Premium Member</p>
                                            </td>
                                            <td className="px-10 py-8 text-secondary font-medium">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-10 py-8 font-bold text-primary text-lg">
                                                ${order.totalPrice.toFixed(2)}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                    <span className={`text-xs font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="text-primary hover:bg-primary/5 p-3 rounded-2xl transition-all">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
