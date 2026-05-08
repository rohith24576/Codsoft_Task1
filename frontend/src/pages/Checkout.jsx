import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const { subtotal, total } = getCartTotal();

    const [address, setAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: 'USA'
    });

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const token = localStorage.getItem('accessToken');
        const orderData = {
            orderItems: cart.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.images[0],
                price: item.price,
                product: item._id
            })),
            shippingAddress: {
                address: address.street,
                city: address.city,
                postalCode: address.postalCode,
                country: address.country
            },
            paymentMethod: 'Credit Card',
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total
        };

        try {
            await axios.post('http://localhost:5000/api/v1/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrderSuccess(true);
            clearCart();
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-4">Order Confirmed!</h1>
                    <p className="text-secondary mb-10">Thank you for your purchase. Your order is being processed.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button onClick={() => navigate('/cart')} className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors mb-12 font-bold text-sm">
                <ArrowLeft size={16} />
                <span>Return to Cart</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                {/* Form */}
                <div>
                    <h2 className="text-3xl font-bold text-primary mb-10">Shipping Details</h2>
                    <form onSubmit={handlePlaceOrder} className="space-y-8">
                        <div className="space-y-6">
                            <div className="relative">
                                <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Street Address" 
                                    required
                                    value={address.street}
                                    onChange={(e) => setAddress({...address, street: e.target.value})}
                                    className="input-field pl-12 py-4"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <input 
                                    type="text" 
                                    placeholder="City" 
                                    required
                                    value={address.city}
                                    onChange={(e) => setAddress({...address, city: e.target.value})}
                                    className="input-field py-4"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Postal Code" 
                                    required
                                    value={address.postalCode}
                                    onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                                    className="input-field py-4"
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-primary mb-10 pt-10">Payment Method</h2>
                        <div className="p-6 border-2 border-primary rounded-3xl flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <CreditCard className="text-primary" size={24} />
                                <div>
                                    <p className="font-bold text-primary">Credit / Debit Card</p>
                                    <p className="text-xs text-secondary">Pay securely with Stripe</p>
                                </div>
                            </div>
                            <div className="w-5 h-5 rounded-full border-4 border-primary"></div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || cart.length === 0}
                            className="w-full btn-primary py-5 text-lg shadow-premium flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>Place Order</span>
                                    <span>•</span>
                                    <span>${total.toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="bg-[#F9F9F9] rounded-[3rem] p-12 border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold mb-10">Order Summary</h3>
                    <div className="space-y-6 mb-10">
                        {cart.map((item) => (
                            <div key={item._id} className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-bold text-primary line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-secondary">{item.qty} x ${item.price}</p>
                                </div>
                                <p className="text-sm font-bold text-primary">${(item.price * item.qty).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="space-y-4 pt-10 border-t border-gray-200">
                        <div className="flex justify-between text-secondary">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                            <span>Shipping</span>
                            <span className="text-green-500 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-2xl font-bold text-primary pt-4">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-white rounded-3xl border border-gray-100 flex items-center space-x-4">
                        <div className="p-3 bg-gray-50 text-primary rounded-xl"><ShieldCheck size={20} /></div>
                        <p className="text-xs text-secondary leading-relaxed">
                            Your payment is 100% secure. We use industry-standard encryption to protect your data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
