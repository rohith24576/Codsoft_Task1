import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        // Simulate API call for password reset
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
        toast.success('Password reset link sent to your email!');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#F9F9F9]">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] p-10 md:p-12 shadow-premium border border-gray-100"
            >
                {!submitted ? (
                    <>
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-primary mb-2">Forgot Password</h1>
                            <p className="text-secondary text-sm leading-relaxed">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary ml-2 group-focus-within:text-primary transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none text-sm font-medium"
                                        placeholder="name@example.com"
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
                                        <span className="uppercase tracking-widest text-xs font-bold">Send Reset Link</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6 space-y-6">
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="w-20 h-20 bg-green-50 border border-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                        >
                            <CheckCircle2 size={40} />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-primary">Check your inbox</h2>
                        <p className="text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                            We've sent password reset instructions to <span className="font-bold text-primary">{email}</span>. Please check your spam folder if you don't see it.
                        </p>
                        <button 
                            onClick={() => { setSubmitted(false); setEmail(''); }}
                            className="text-xs font-bold text-primary hover:underline uppercase tracking-widest block mx-auto pt-4"
                        >
                            Try another email
                        </button>
                    </div>
                )}

                <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                    <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors">
                        <ArrowLeft size={14} />
                        <span>Back to Sign In</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
