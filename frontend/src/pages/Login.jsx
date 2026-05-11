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
            <div className="flex-1 flex flex-col relative h-screen overflow-y-auto">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -z-10 blur-3xl opacity-50" />
                
                {/* Demo Credentials Top Bar */}
                <div className="w-full bg-primary/5 border-b border-primary/10 py-5 px-8 flex flex-col z-50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary">Demo Credentials</span>
                        <span className="text-xs font-medium text-primary/60 bg-white px-3 py-1 rounded-full border border-primary/10">✨ Click any box to auto-fill</span>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={() => setFormData({ email: 'admin@gmail.com', password: 'admin1234' })}
                            className="flex-1 flex flex-col items-start bg-white p-4 rounded-xl border border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all text-primary shadow-sm group"
                        >
                            <span className="font-bold text-xs uppercase tracking-wider mb-2 opacity-70 group-hover:text-white/90">Admin Access</span>
                            <span className="font-mono text-[13px] font-medium">Email: admin@gmail.com</span>
                            <span className="font-mono text-[13px] font-medium mt-1">Pass:  admin1234</span>
                        </button>
                        <button 
                            onClick={() => setFormData({ email: 'test@gmail.com', password: 'test1234' })}
                            className="flex-1 flex flex-col items-start bg-white p-4 rounded-xl border border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all text-primary shadow-sm group"
                        >
                            <span className="font-bold text-xs uppercase tracking-wider mb-2 opacity-70 group-hover:text-white/90">Test User Access</span>
                            <span className="font-mono text-[13px] font-medium">Email: test@gmail.com</span>
                            <span className="font-mono text-[13px] font-medium mt-1">Pass:  test1234</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
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
        </div>
    );
};

export default Login;
