import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 });
    const { products, fetchProducts, deleteProduct } = useProductStore();

    useEffect(() => {
        fetchProducts();
        // Fetch stats from backend (placeholder)
        const fetchStats = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:5000/api/v1/orders/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(prev => ({ ...prev, ...res.data.data }));
            } catch (err) {}
        };
        fetchStats();
    }, [fetchProducts]);

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Total Products', value: products.length, icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Active Users', value: stats.totalUsers || 12, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
                <button className="btn-primary flex items-center space-x-2">
                    <Plus size={18} />
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {statCards.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-soft"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-secondary text-sm font-medium mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Recent Products Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Manage Products</h2>
                    <button className="text-sm font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Product</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Category</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Price</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Stock</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-secondary">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.slice(0, 5).map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-primary">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-secondary">{product.category?.name}</td>
                                    <td className="px-8 py-6 font-bold text-primary">${product.price}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {product.stock} units
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white rounded-lg text-secondary hover:text-primary transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-white rounded-lg text-secondary hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
