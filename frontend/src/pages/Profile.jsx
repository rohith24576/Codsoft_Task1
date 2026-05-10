import React, { useRef, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, Calendar, LogOut, Camera, Edit3, Check, X, MapPin, Plus, Trash2, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout, updateAvatar, updateProfile } = useAuthStore();
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        username: user?.username || ''
    });

    // Address Book State
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        name: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false
    });
    const { addAddress, removeAddress } = useAuthStore();

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const success = await addAddress(addressForm);
        if (success) {
            setIsAddingAddress(false);
            setAddressForm({ name: '', street: '', city: '', state: '', zipCode: '', country: '', isDefault: false });
        }
    };

    if (!user) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateAvatar(reader.result);
                toast.success('Profile photo updated!');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user.fullName,
            email: user.email,
            username: user.username
        });
        setIsEditing(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-24">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden"
            >
                {/* Elegant Light Banner */}
                <div className="h-48 bg-gradient-to-r from-gray-50 to-gray-100 relative">
                    <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>
                
                <div className="px-10 pb-16 relative">
                    {/* Avatar Section */}
                    <div className="relative -mt-20 flex flex-col md:flex-row items-center md:items-end justify-between space-y-6 md:space-y-0 mb-16">
                        <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-10">
                            <div className="relative group">
                                <img 
                                    src={user.avatar || "/default-avatar.svg"} 
                                    alt={user.fullName} 
                                    className="w-44 h-44 rounded-[3rem] object-cover border-8 border-white shadow-premium relative z-20"
                                />
                                <button 
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-2 right-2 z-30 p-3 bg-primary text-white rounded-2xl shadow-premium transition-all duration-300 hover:scale-110 active:scale-95"
                                >
                                    <Camera size={20} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div className="text-center md:text-left pb-4">
                                {isEditing ? (
                                    <div className="space-y-4 w-full md:w-80">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Edit Full Name</label>
                                            <input 
                                                type="text" 
                                                className="text-2xl font-bold text-primary bg-primary/5 border border-primary/20 rounded-2xl px-5 py-3 w-full focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Edit Username</label>
                                            <input 
                                                type="text" 
                                                className="text-xs font-bold text-secondary tracking-widest uppercase bg-primary/5 border border-primary/10 rounded-xl px-5 py-2 w-full focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.username}
                                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-1">{user.fullName}</h1>
                                        <p className="text-secondary font-medium tracking-widest uppercase text-xs">@{user.username}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.div 
                                        key="editing-actions"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <button 
                                            onClick={handleCancel}
                                            className="p-4 bg-gray-100 text-secondary rounded-2xl hover:bg-gray-200 transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button 
                                            onClick={handleSave}
                                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center space-x-2 shadow-lg hover:bg-gray-800 transition-all"
                                        >
                                            <Check size={20} />
                                            <span>Save Changes</span>
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.button 
                                        key="view-actions"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onClick={() => setIsEditing(true)}
                                        className="px-8 py-4 border border-gray-200 text-primary rounded-2xl font-bold flex items-center space-x-2 hover:border-primary transition-all"
                                    >
                                        <Edit3 size={20} />
                                        <span>Edit Profile</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-100 flex flex-col md:row justify-between items-start md:items-center">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full">
                            {/* Contact Card */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</h3>
                                <div className="flex items-center space-x-3 text-primary font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                        <Mail size={16} className="text-primary" />
                                    </div>
                                    {isEditing ? (
                                        <div className="space-y-1 w-full">
                                            <label className="text-[10px] font-bold text-primary/40 uppercase tracking-widest ml-1">Update Email</label>
                                            <input 
                                                type="email" 
                                                className="bg-primary/5 border border-primary/10 rounded-xl px-4 py-2 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none w-full transition-all"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    ) : (
                                        <span>{user.email}</span>
                                    )}
                                </div>
                            </div>

                            {/* Birthday Card */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Date of Birth</h3>
                                <div className="flex items-center space-x-3 text-primary font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                                        <Calendar size={16} className="text-primary" />
                                    </div>
                                    <span>May 24, 2000</span>
                                </div>
                            </div>

                            {/* Security Card */}
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account Security</h3>
                                <div className="flex items-center space-x-3 text-primary font-bold">
                                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                                        <Shield size={16} className="text-green-600" />
                                    </div>
                                    <span className="text-green-600">Verified Member</span>
                                </div>
                            </div>

                            {/* Action Card */}
                            <div className="flex items-end lg:justify-end">
                                <button 
                                    onClick={logout}
                                    className="group flex items-center space-x-3 px-8 py-4 bg-red-50 text-red-500 rounded-2xl font-bold transition-all duration-300 hover:bg-red-500 hover:text-white"
                                >
                                    <LogOut size={20} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Address Book Section */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden mt-12 p-10"
            >
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-primary flex items-center space-x-3">
                            <MapPin size={28} className="text-primary" />
                            <span>Address Book</span>
                        </h2>
                        <p className="text-secondary mt-2">Manage your shipping and billing addresses.</p>
                    </div>
                    {!isAddingAddress && (
                        <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="btn-primary py-4 px-6 flex items-center space-x-2"
                        >
                            <Plus size={18} />
                            <span>Add New Address</span>
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isAddingAddress && (
                        <motion.form 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleAddAddress}
                            className="bg-gray-50 rounded-[2rem] p-8 mb-10 space-y-6 border border-gray-100"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">New Address</h3>
                                <button type="button" onClick={() => setIsAddingAddress(false)} className="p-2 hover:bg-gray-200 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" required placeholder="Address Name (e.g. Home, Office)" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="input-field py-4 col-span-full" />
                                <input type="text" required placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="input-field py-4" />
                                <input type="text" required placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="input-field py-4" />
                                <div className="grid grid-cols-2 gap-6">
                                    <input type="text" required placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="input-field py-4" />
                                    <input type="text" required placeholder="ZIP" value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} className="input-field py-4" />
                                </div>
                                <input type="text" required placeholder="Country" value={addressForm.country} onChange={e => setAddressForm({...addressForm, country: e.target.value})} className="input-field py-4" />
                            </div>
                            <div className="flex items-center space-x-3">
                                <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-5 h-5 accent-primary" />
                                <label htmlFor="isDefault" className="text-sm font-bold text-secondary">Set as default shipping address</label>
                            </div>
                            <button type="submit" className="btn-primary py-4 px-8 mt-4">Save Address</button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.addresses && user.addresses.length > 0 ? (
                        user.addresses.map((address) => (
                            <div key={address._id} className="border border-gray-100 rounded-[2rem] p-8 relative hover:border-primary transition-colors group">
                                {address.isDefault && (
                                    <span className="absolute top-6 right-6 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1">
                                        <Home size={12} />
                                        <span>Default</span>
                                    </span>
                                )}
                                <h4 className="text-lg font-bold mb-1 pr-20">{address.name || 'Saved Address'}</h4>
                                <h5 className="text-sm font-semibold mb-3 pr-20">{address.street}</h5>
                                <p className="text-secondary text-sm space-y-1">
                                    <span className="block">{address.city}, {address.state} {address.zipCode}</span>
                                    <span className="block font-medium">{address.country}</span>
                                </p>
                                <button 
                                    onClick={() => removeAddress(address._id)}
                                    className="absolute bottom-6 right-6 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                            <p className="text-secondary">You haven't saved any addresses yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
