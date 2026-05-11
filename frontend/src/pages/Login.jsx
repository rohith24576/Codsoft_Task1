import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Quote } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData);
        if (success) {
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Side - Image & Branding (Hidden on mobile) */}
            <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative overflow-hidden bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Fashion Editorial" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="relative z-10 flex flex-col justify-between h-full p-16 text-white w-full">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-md mt-auto"
                    >
                        <Quote size={40} className="text-white/50 mb-6" />
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                            Elevate your everyday wardrobe.
                        </h2>
                        <p className="text-lg text-white/80">
                            Join ShopNest Elite to access curated collections, exclusive drops, and a personalized shopping experience designed just for you.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -z-10 blur-3xl opacity-50" />
                
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-primary mb-3">Welcome Back.</h1>
                        <p className="text-secondary text-lg">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2 group-focus-within:text-primary transition-colors">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary group-focus-within:text-primary transition-colors">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-900 active:scale-[0.98] transition-all shadow-xl hover:shadow-primary/20 disabled:opacity-70 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span className="uppercase tracking-widest text-sm">Sign In to Account</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary mb-4 flex items-center justify-center space-x-2">
                            <span>Demo Credentials</span>
                        </h3>
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs space-y-2 sm:space-y-0">
                                <span className="text-secondary font-bold uppercase tracking-wider">Admin</span>
                                <button 
                                    onClick={() => setFormData({ email: 'admin@gmail.com', password: 'admin1234' })}
                                    className="font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors text-left"
                                >
                                    admin@gmail.com / admin1234
                                </button>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs space-y-2 sm:space-y-0">
                                <span className="text-secondary font-bold uppercase tracking-wider">Test User</span>
                                <button 
                                    onClick={() => setFormData({ email: 'test@gmail.com', password: 'test1234' })}
                                    className="font-mono bg-white px-3 py-2 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors text-left"
                                >
                                    test@gmail.com / test1234
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-secondary text-sm">
                            New to ShopNest Elite?{' '}
                            <Link to="/register" className="font-bold text-primary hover:underline underline-offset-4">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
