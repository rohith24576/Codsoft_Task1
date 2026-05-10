import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, ShieldCheck, ArrowLeft, Loader2, CheckCircle, Download, ChevronDown, Smartphone, Wallet, QrCode, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const { subtotal, total } = getCartTotal();

    const [address, setAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
    });
    
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    
    const [selectedAddressId, setSelectedAddressId] = useState(
        user?.addresses?.length > 0 ? (user.addresses.find(a => a.isDefault)?._id || user.addresses[0]._id) : 'new'
    );
    const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        let finalAddress = null;
        
        if (selectedAddressId !== 'new') {
            finalAddress = user.addresses.find(a => a._id === selectedAddressId);
        } else {
            finalAddress = address;
            // Auto-save new address to profile
            if (user) {
                useAuthStore.getState().addAddress({
                    ...address,
                    isDefault: !user.addresses || user.addresses.length === 0
                });
            }
        }

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
                address: finalAddress.street,
                city: finalAddress.city,
                postalCode: finalAddress.zipCode,
                country: finalAddress.country
            },
            paymentMethod: paymentMethod,
            itemsPrice: subtotal,
            taxPrice: 0,
            shippingPrice: 0,
            totalPrice: total
        };

        try {
            await axios.post('http://localhost:5000/api/v1/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLastOrder(orderData);
            setOrderSuccess(true);
            clearCart();
            toast.success('Order placed successfully!');
        } catch (error) {
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateInvoice = () => {
        if (!lastOrder) return;
        
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.setTextColor(20, 20, 20);
        doc.text("SHOPNEST", 105, 20, { align: "center" });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Premium E-Commerce Experience", 105, 27, { align: "center" });
        
        // Horizontal Line
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 35, 190, 35);
        
        // Order Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Invoice To: ${user?.fullName || 'Customer'}`, 20, 50);
        doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 20, 57);
        doc.text(`Payment: ${lastOrder.paymentMethod}`, 20, 64);
        
        // Table Header
        doc.setFillColor(245, 245, 245);
        doc.rect(20, 80, 170, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Item", 25, 87);
        doc.text("Qty", 120, 87);
        doc.text("Price", 145, 87);
        doc.text("Total", 170, 87);
        
        // Items
        doc.setFont("helvetica", "normal");
        let y = 97;
        lastOrder.orderItems.forEach((item) => {
            doc.text(item.name.substring(0, 30), 25, y);
            doc.text(item.qty.toString(), 122, y);
            doc.text(`$${item.price}`, 145, y);
            doc.text(`$${(item.price * item.qty).toFixed(2)}`, 170, y);
            y += 10;
        });
        
        // Footer Line
        doc.line(20, y + 5, 190, y + 5);
        
        // Totals
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total:", 140, y + 20);
        doc.text(`$${lastOrder.totalPrice.toFixed(2)}`, 170, y + 20);
        
        // Thank you
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing ShopNest!", 105, y + 50, { align: "center" });
        
        doc.save(`ShopNest_Invoice_${Date.now()}.pdf`);
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
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button onClick={() => navigate('/')} className="btn-primary w-full sm:w-auto">
                            Back to Home
                        </button>
                        <button 
                            onClick={generateInvoice} 
                            className="flex items-center justify-center space-x-2 px-8 py-3.5 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
                        >
                            <Download size={18} />
                            <span>Download Invoice</span>
                        </button>
                    </div>
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
                        {user?.addresses && user.addresses.length > 0 && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-secondary">Select Saved Address</label>
                                <div className="relative z-40">
                                    <div 
                                        onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
                                        className="input-field py-4 cursor-pointer flex items-center justify-between"
                                    >
                                        <span className="truncate pr-4 text-primary font-bold">
                                            {selectedAddressId === 'new' ? '+ Enter New Address' : (() => {
                                                const a = user.addresses.find(addr => addr._id === selectedAddressId);
                                                return a ? `${a.name ? a.name + ': ' : ''}${a.street}, ${a.city} ${a.isDefault ? '(Default)' : ''}` : '';
                                            })()}
                                        </span>
                                        <ChevronDown className={`text-gray-400 transition-transform ${isAddressDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                                    </div>

                                    <AnimatePresence>
                                        {isAddressDropdownOpen && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute w-full mt-2 bg-[#F9F9F9] border border-gray-200 rounded-2xl shadow-premium overflow-hidden"
                                            >
                                                {user.addresses.map(addr => (
                                                    <div 
                                                        key={addr._id}
                                                        onClick={() => { setSelectedAddressId(addr._id); setIsAddressDropdownOpen(false); }}
                                                        className={`px-6 py-4 cursor-pointer hover:bg-white hover:text-primary transition-colors ${selectedAddressId === addr._id ? 'bg-primary/5 font-bold text-primary' : 'text-secondary font-medium'}`}
                                                    >
                                                        {addr.name && <span className="font-bold mr-2 text-primary">{addr.name}:</span>}
                                                        {addr.street}, {addr.city}, {addr.state} {addr.zipCode} 
                                                        {addr.isDefault && <span className="text-green-500 text-[10px] ml-2 uppercase tracking-widest font-bold bg-green-50 px-2 py-0.5 rounded-md">Default</span>}
                                                    </div>
                                                ))}
                                                <div 
                                                    onClick={() => { setSelectedAddressId('new'); setIsAddressDropdownOpen(false); }}
                                                    className={`px-6 py-4 cursor-pointer hover:bg-white hover:text-primary transition-colors border-t border-gray-200 ${selectedAddressId === 'new' ? 'bg-primary/5 font-bold text-primary' : 'text-primary font-bold'}`}
                                                >
                                                    + Enter New Address
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {selectedAddressId === 'new' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6">
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Address Name (e.g. Home, Office)" 
                                        required
                                        value={address.name}
                                        onChange={(e) => setAddress({...address, name: e.target.value})}
                                        className="input-field pl-12 py-4 mb-6"
                                    />
                                    <MapPin className="absolute left-4 top-[5.25rem] text-gray-400" size={18} />
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
                                        placeholder="State" 
                                        required
                                        value={address.state}
                                        onChange={(e) => setAddress({...address, state: e.target.value})}
                                        className="input-field py-4"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <input 
                                        type="text" 
                                        placeholder="ZIP Code" 
                                        required
                                        value={address.zipCode}
                                        onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                                        className="input-field py-4"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Country" 
                                        required
                                        value={address.country}
                                        onChange={(e) => setAddress({...address, country: e.target.value})}
                                        className="input-field py-4"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <h2 className="text-3xl font-bold text-primary mb-10 pt-10">Payment Method</h2>
                        <div className="space-y-4">
                            {/* Option 1 */}
                            <div 
                                onClick={() => setPaymentMethod('Credit Card')}
                                className={`p-6 border-2 rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-300 ${paymentMethod === 'Credit Card' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'Credit Card' ? 'bg-primary text-white' : 'bg-gray-50 text-secondary'}`}>
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${paymentMethod === 'Credit Card' ? 'text-primary' : 'text-secondary'}`}>Credit / Debit Card</p>
                                        <p className="text-xs text-gray-400">Pay securely with Stripe</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === 'Credit Card' ? 'border-primary' : 'border-gray-200'}`}></div>
                            </div>

                            {/* Option 2 */}
                            <div 
                                onClick={() => setPaymentMethod('UPI')}
                                className={`p-6 border-2 rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-300 ${paymentMethod === 'UPI' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'UPI' ? 'bg-purple-500 text-white' : 'bg-gray-50 text-secondary'}`}>
                                        <QrCode size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${paymentMethod === 'UPI' ? 'text-primary' : 'text-secondary'}`}>UPI (GPay, PhonePe, Paytm)</p>
                                        <p className="text-xs text-gray-400">Scan & Pay securely</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === 'UPI' ? 'border-primary' : 'border-gray-200'}`}></div>
                            </div>

                            {/* Option 3 */}
                            <div 
                                onClick={() => setPaymentMethod('Cash on Delivery')}
                                className={`p-6 border-2 rounded-3xl flex items-center justify-between cursor-pointer transition-all duration-300 ${paymentMethod === 'Cash on Delivery' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${paymentMethod === 'Cash on Delivery' ? 'bg-green-500 text-white' : 'bg-gray-50 text-secondary'}`}>
                                        <Banknote size={20} />
                                    </div>
                                    <div>
                                        <p className={`font-bold ${paymentMethod === 'Cash on Delivery' ? 'text-primary' : 'text-secondary'}`}>Cash on Delivery</p>
                                        <p className="text-xs text-gray-400">Pay when your order arrives</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-4 ${paymentMethod === 'Cash on Delivery' ? 'border-primary' : 'border-gray-200'}`}></div>
                            </div>
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
