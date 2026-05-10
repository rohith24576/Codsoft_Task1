import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, ArrowLeft, Plus, Minus, Settings, X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, fetchProductById, loading, relatedProducts, recentlyViewed } = useProductStore();
    const { user } = useAuthStore();
    const { addToCart } = useCartStore();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    
    // Review States
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchProductById(id);
        window.scrollTo(0, 0);
    }, [id, fetchProductById]);

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) return;

        // Mock adding review locally
        const newReview = {
            name: user.fullName,
            rating: reviewRating,
            comment: reviewComment,
            createdAt: new Date().toISOString()
        };

        // Update local state (in a real app, this would be an API call)
        product.reviews = [newReview, ...(product.reviews || [])];
        product.numReviews += 1;
        
        toast.success('Thank you for your feedback! ⭐');
        setIsReviewModalOpen(false);
        setReviewComment('');
        setReviewRating(5);
    };

    if (loading || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                <Skeleton className="aspect-square rounded-3xl" />
                <div className="space-y-6">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
                {/* Gallery */}
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 group"
                    >
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-zoom-in"
                        />
                    </motion.div>
                    <div className="grid grid-cols-5 gap-4">
                        {product.images.map((img, i) => (
                            <button 
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <span className="text-sm font-bold uppercase tracking-widest text-secondary mb-2 block">{product.category?.name}</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight tracking-tight">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {(() => {
                                    const totalReviews = product.reviews?.length || 0;
                                    const averageRating = totalReviews > 0 
                                        ? (product.reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1)
                                        : 0;
                                    
                                    return (
                                        <>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                            ))}
                                            <span className="text-sm font-bold ml-2 text-primary">{averageRating}</span>
                                        </>
                                    );
                                })()}
                            </div>
                            <span className="text-xs font-bold text-secondary border-l border-gray-100 pl-4 uppercase tracking-widest">{product.reviews?.length || 0} Reviews</span>
                        </div>
                    </div>

                    <div className="mb-10 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-4xl font-bold text-primary">${product.discountPrice || product.price}</span>
                            {product.discountPrice > 0 && (
                                <span className="text-xl text-secondary line-through opacity-30 font-medium">${product.price}</span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {product.stock > 0 
                                    ? (user?.role === 'ADMIN' ? `In Stock (${product.stock} units)` : 'Available & Ready to ship') 
                                    : 'Out of Stock'}
                            </p>
                        </div>
                    </div>

                    <p className="text-secondary leading-relaxed mb-10 text-lg">
                        {product.description}
                    </p>

                    {user?.role !== 'ADMIN' ? (
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
                            <div className="flex items-center bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-primary transition-colors">
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-primary">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-1 hover:text-primary transition-colors">
                                    <Plus size={18} />
                                </button>
                            </div>
                            <button 
                                disabled={product.stock === 0}
                                onClick={() => addToCart(product, quantity)}
                                className="w-full flex-grow btn-primary flex items-center justify-center space-x-3 py-5 rounded-2xl shadow-xl hover:shadow-primary/20"
                            >
                                <ShoppingCart size={20} />
                                <span className="font-bold uppercase tracking-widest text-xs">Add to Cart</span>
                            </button>
                            <button className="p-5 border border-gray-100 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group">
                                <Heart size={20} className="text-gray-400 group-hover:text-primary" />
                            </button>
                        </div>
                    ) : (
                        <div className="mb-10 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-primary">
                                <Settings size={24} className="animate-spin-slow" />
                                <div>
                                    <p className="font-bold text-sm">Management Mode</p>
                                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Controls restricted for Admins</p>
                                </div>
                            </div>
                            <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">
                                Edit Product
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-gray-50 rounded-2xl text-primary"><Truck size={24} /></div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest">Elite Shipping</h4>
                                <p className="text-sm text-secondary font-medium">Delivery in 2-4 days</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-4 bg-gray-50 rounded-2xl text-primary"><ShieldCheck size={24} /></div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest">Buyer Protection</h4>
                                <p className="text-sm text-secondary font-medium">30-day hassle-free returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-20">
                <div className="flex space-x-12 border-b border-gray-100 mb-12 overflow-x-auto scrollbar-hide">
                    {['description', 'reviews', 'shipping'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-6 text-[10px] font-bold uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />}
                        </button>
                    ))}
                </div>

                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'description' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl text-secondary leading-loose text-lg"
                            >
                                <p>{product.description}</p>
                            </motion.div>
                        )}
                        {activeTab === 'reviews' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-12"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary mb-2">Customer Feedback</h3>
                                        <p className="text-sm text-secondary font-medium">Based on {product.reviews?.length || 0} verified purchases</p>
                                    </div>
                                    {user ? (
                                        user.role !== 'ADMIN' ? (
                                            <button 
                                                onClick={() => setIsReviewModalOpen(true)}
                                                className="px-8 py-4 bg-primary text-white text-xs font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-lg uppercase tracking-widest"
                                            >
                                                Write a Review
                                            </button>
                                        ) : (
                                            <div className="px-6 py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                                                Admin Management Mode
                                            </div>
                                        )
                                    ) : (
                                        <button 
                                            onClick={() => navigate('/login')}
                                            className="px-8 py-4 border border-gray-200 text-primary text-xs font-bold rounded-2xl hover:border-primary transition-all uppercase tracking-widest"
                                        >
                                            Login to Review
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {(product.reviews && product.reviews.length > 0) ? product.reviews.map((review, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ y: -8 }}
                                            className="p-10 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/50 relative group transition-all shadow-premium hover:bg-white hover:shadow-2xl overflow-hidden"
                                        >
                                            {/* Accent Pattern */}
                                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            
                                            <div className="flex flex-col space-y-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center space-x-5">
                                                        <div className="relative">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gray-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                                                                {review.name[0]}
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                <CheckCircle2 size={10} className="text-white" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-primary text-base tracking-tight">{review.name}</h4>
                                                            <div className="flex items-center space-x-1 mt-1.5">
                                                                {[...Array(5)].map((_, j) => (
                                                                    <Star key={j} size={12} className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100'} />
                                                                ))}
                                                                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-2">Verified Purchase</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                                                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9125 16 16.0171 16H19.0171C19.5694 16 20.0171 15.5523 20.0171 15V9C20.0171 8.44772 19.5694 8 19.0171 8H15.0171C14.4648 8 14.0171 7.55228 14.0171 7V5C14.0171 4.44772 14.4648 4 15.0171 4H17.0171C18.1217 4 19.0171 4.89543 19.0171 6V15C19.0171 16.1046 18.1217 17 17.0171 17H16.0171C14.9125 17 14.0171 17.8954 14.0171 19V21H14.0171ZM5.01711 21L5.01711 18C5.01711 16.8954 5.91255 16 7.01711 16H10.0171C10.5694 16 11.0171 15.5523 11.0171 15V9C11.0171 8.44772 10.5694 8 10.0171 8H6.01711C5.46483 8 5.01711 7.55228 5.01711 7V5C5.01711 4.44772 5.46483 4 6.01711 4H8.01711C9.12168 4 10.0171 4.89543 10.0171 6V15C10.0171 16.1046 9.12168 17 8.01711 17H7.01711C5.91255 17 5.01711 17.8954 5.01711 19V21H5.01711Z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <p className="text-secondary text-sm leading-loose font-medium italic relative z-10">
                                                        {review.comment}
                                                    </p>
                                                    <div className="w-8 h-1 bg-primary/10 mt-6 rounded-full group-hover:w-16 transition-all duration-500" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                            <Star size={48} className="mx-auto text-gray-200 mb-6" />
                                            <h3 className="text-xl font-bold text-primary mb-2">No reviews yet</h3>
                                            <p className="text-secondary">Be the first to share your thoughts on this product!</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        {activeTab === 'shipping' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-secondary"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                                        <h4 className="font-bold text-primary mb-6 uppercase text-xs tracking-widest">Delivery Experience</h4>
                                        <ul className="space-y-4 text-sm font-medium">
                                            <li className="flex items-center space-x-3"><CheckCircle2 size={16} className="text-green-500" /><span>Standard Delivery: 3-5 business days (FREE)</span></li>
                                            <li className="flex items-center space-x-3"><CheckCircle2 size={16} className="text-green-500" /><span>Express Delivery: 1-2 business days ($15.00)</span></li>
                                            <li className="flex items-center space-x-3"><CheckCircle2 size={16} className="text-green-500" /><span>Order processing: Within 24 hours</span></li>
                                        </ul>
                                    </div>
                                    <div className="p-10 bg-primary rounded-[3rem] text-white">
                                        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-white/70">Returns & Exchanges</h4>
                                        <ul className="space-y-4 text-sm font-medium">
                                            <li>• 30-day hassle-free return policy</li>
                                            <li>• Items must be in original condition</li>
                                            <li>• Pre-paid shipping labels available</li>
                                            <li>• Refunds processed in 5-7 business days</li>
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsReviewModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-xl font-bold text-primary">Share your thoughts</h3>
                                <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleAddReview} className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Overall Rating</label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setReviewRating(star)}
                                                className="transition-all duration-300 hover:scale-125"
                                            >
                                                <Star 
                                                    size={32} 
                                                    className={`${star <= (hoverRating || reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100'} transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Your Review</label>
                                    <textarea 
                                        rows="5"
                                        placeholder="What did you think of this product? Our team and other customers would love to hear your experience..."
                                        className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full btn-primary py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 group"
                                >
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    <span className="font-bold uppercase tracking-widest text-xs">Publish Review</span>
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Recommended Products */}
            {relatedProducts.length > 0 && (
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {relatedProducts.map(item => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </section>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 1 && (
                <section>
                    <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Recently Viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentlyViewed.filter(p => p._id !== product._id).map(item => (
                            <ProductCard key={item._id} product={item} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetails;
