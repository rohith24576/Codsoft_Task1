import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 overflow-hidden"
            >
                {/* Header */}
                <div className="h-32 bg-gray-50 border-b border-gray-100"></div>
                
                <div className="px-8 pb-12 relative">
                    <div className="absolute -top-16 left-8">
                        <img 
                            src={user.avatar} 
                            alt={user.fullName} 
                            className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-soft"
                        />
                    </div>

                    <div className="mt-20 flex flex-col md:row justify-between items-start md:items-end space-y-6 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">{user.fullName}</h1>
                            <p className="text-secondary">@{user.username}</p>
                        </div>
                        <button 
                            onClick={logout}
                            className="flex items-center space-x-2 px-6 py-2.5 border border-red-100 text-red-500 rounded-full font-bold hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Contact Info</h3>
                            <div className="flex items-center space-x-3 text-primary font-medium">
                                <Mail size={18} className="text-secondary" />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Account Security</h3>
                            <div className="flex items-center space-x-3 text-primary font-medium">
                                <Shield size={18} className="text-secondary" />
                                <span className="capitalize">{user.role} Account</span>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Member Since</h3>
                            <div className="flex items-center space-x-3 text-primary font-medium">
                                <Calendar size={18} className="text-secondary" />
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
