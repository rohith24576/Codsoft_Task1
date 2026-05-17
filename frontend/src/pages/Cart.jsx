import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, X, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCurrencyStore } from '../store/useCurrencyStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const Cart = () => {
    const { cart, removeFromCart, updateQty, coupon, applyCoupon, removeCoupon, getCartTotal } = useCartStore();
    const [couponCode, setCouponCode] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const { subtotal, total, isFreeShipping, shippingFee } = getCartTotal();
    const navigate = useNavigate();
    const { formatPrice } = useCurrencyStore();

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        setIsValidating(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`${API_URL}/coupons/validate`, 
                { code: couponCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            applyCoupon(response.data.data);
            setCouponCode('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon');
        } finally {
            setIsValidating(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                        <ShoppingBag size={40} className="text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary mb-4">Your cart is empty</h1>
                    <p className="text-secondary mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Let's find something special for you.</p>
                    <Link to="/shop" className="btn-primary">Start Shopping</Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-12">
                <h1 className="text-4xl font-bold text-primary">Your Shopping Bag</h1>
                <button 
                    onClick={() => {
                        useCartStore.getState().clearCart();
                        toast.success('Cart cleared');
                    }}
                    className="text-sm font-medium text-secondary hover:text-red-500 transition-colors flex items-center space-x-2"
                >
                    <Trash2 size={16} />
                    <span>Clear Bag</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div 
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="flex flex-col sm:row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8 border-b border-gray-100"
                            >
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="font-bold text-primary mb-1">{item.name}</h3>
                                    <p className="text-sm text-secondary mb-2">{item.category.name}</p>
                                    <div className="flex items-center justify-center sm:justify-start space-x-4">
                                        <div className="flex items-center bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100">
                                            <button onClick={() => updateQty(item._id, item.qty - 1)} className="p-1 hover:text-primary"><Minus size={14} /></button>
                                            <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                                            <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1 hover:text-primary"><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{formatPrice(item.price * item.qty)}</p>
                                    <p className="text-xs text-secondary">{formatPrice(item.price)} each</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="space-y-8">
                    <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                        <h2 className="text-xl font-bold mb-8">Order Summary</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-secondary">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-secondary">
                                <span>Shipping</span>
                                {isFreeShipping ? (
                                    <span className="text-green-500 font-medium">Free</span>
                                ) : (
                                    <span className="text-primary font-medium">{formatPrice(shippingFee)}</span>
                                )}
                            </div>
                            {coupon && (
                                <div className="flex justify-between text-green-500">
                                    <span>Discount ({coupon.code})</span>
                                    <span>-{formatPrice(coupon.type === 'flat' ? coupon.discount : ((subtotal * coupon.discount) / 100))}</span>
                                </div>
                            )}
                            <div className="pt-4 border-t border-gray-200 flex justify-between text-xl font-bold text-primary">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Coupon Form */}
                        {!coupon ? (
                            <div className="mb-8 space-y-3">
                                <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => setCouponCode('WELCOME10')}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg">🎉</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-amber-900">Don't leave without your discount!</p>
                                            <p className="text-[11px] text-amber-700 mt-0.5">
                                                Use code <span className="font-bold bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">WELCOME10</span> for 10% off
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-bold text-amber-600 uppercase">Tap to apply</span>
                                    </div>
                                </motion.div>
                                <form onSubmit={handleApplyCoupon} className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors text-sm"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isValidating || !couponCode}
                                        className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-opacity-90 disabled:opacity-50"
                                    >
                                        {isValidating ? '...' : 'Apply'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl p-4 mb-8">
                                <div className="flex items-center space-x-3">
                                    <Tag className="text-green-600" size={18} />
                                    <div>
                                        <p className="text-xs font-bold text-green-800">{coupon.code} Applied</p>
                                        <p className="text-[10px] text-green-600">
                                            {coupon.type === 'flat' ? formatPrice(coupon.discount) : `${coupon.discount}%`} discount
                                        </p>
                                    </div>
                                </div>
                                <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded-full text-green-800">
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={() => navigate('/checkout')}
                            className="w-full btn-primary py-4 flex items-center justify-center space-x-2 shadow-premium"
                        >
                            <span>Checkout Now</span>
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-xs text-secondary font-medium">
                        <div className="flex items-center space-x-1"><ShieldCheck size={14} /> <span>Secure Payment</span></div>
                        <div className="flex items-center space-x-1"><Truck size={14} /> <span>Fast Delivery</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
