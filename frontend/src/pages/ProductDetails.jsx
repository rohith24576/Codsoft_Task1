import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
    const { id } = useParams();
    const { product, fetchProductById, loading } = useProductStore();
    const { addToCart } = useCartStore();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        fetchProductById(id);
        window.scrollTo(0, 0);
    }, [id, fetchProductById]);

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
                        className="aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group"
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
                                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.floor(product.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                ))}
                                <span className="text-sm font-semibold ml-2">{product.ratings}</span>
                            </div>
                            <span className="text-sm text-secondary border-l border-gray-200 pl-4">{product.numReviews} Reviews</span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center space-x-4 mb-2">
                            <span className="text-3xl font-bold text-primary">${product.discountPrice || product.price}</span>
                            {product.discountPrice > 0 && (
                                <span className="text-xl text-secondary line-through opacity-50">${product.price}</span>
                            )}
                        </div>
                        <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                        </p>
                    </div>

                    <p className="text-secondary leading-relaxed mb-10 line-clamp-3">
                        {product.description}
                    </p>

                    <div className="flex flex-col sm:row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10">
                        <div className="flex items-center bg-gray-50 rounded-full px-6 py-3 border border-gray-100">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-1 hover:text-primary transition-colors">
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-bold">{quantity}</span>
                            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-1 hover:text-primary transition-colors">
                                <Plus size={18} />
                            </button>
                        </div>
                        <button 
                            disabled={product.stock === 0}
                            onClick={() => addToCart(product, quantity)}
                            className="w-full flex-grow btn-primary flex items-center justify-center space-x-3 py-4"
                        >
                            <ShoppingCart size={20} />
                            <span>Add to Cart</span>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-full hover:border-primary transition-colors">
                            <Heart size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-primary"><Truck size={24} /></div>
                            <div>
                                <h4 className="text-sm font-bold">Free Shipping</h4>
                                <p className="text-xs text-secondary">Delivery in 2-4 days</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gray-50 rounded-2xl text-primary"><ShieldCheck size={24} /></div>
                            <div>
                                <h4 className="text-sm font-bold">Secure Checkout</h4>
                                <p className="text-xs text-secondary">Guaranteed protection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-20">
                <div className="flex space-x-12 border-b border-gray-100 mb-10">
                    {['description', 'reviews', 'shipping'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary' : 'text-secondary hover:text-primary'}`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                    ))}
                </div>

                <div className="min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'description' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="prose max-w-none text-secondary leading-loose"
                            >
                                <p>{product.description}</p>
                            </motion.div>
                        )}
                        {activeTab === 'reviews' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {product.reviews.length > 0 ? product.reviews.map((review, i) => (
                                    <div key={i} className="flex space-x-4 pb-8 border-b border-gray-50">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-primary mb-1">{review.name}</h4>
                                            <div className="flex items-center space-x-1 mb-2">
                                                {[...Array(5)].map((_, j) => (
                                                    <Star key={j} size={12} className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                            <p className="text-secondary text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-secondary italic">No reviews yet. Be the first to review this product!</p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Recommended Products */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold text-primary mb-8">You May Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Filtered recommendations based on category would go here */}
                    {/* Placeholder using featured products for demo */}
                    <ProductCard product={product} /> {/* Self reference as placeholder */}
                </div>
            </section>

            {/* Recently Viewed */}
            <section>
                <h2 className="text-2xl font-bold text-primary mb-8">Recently Viewed</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logic to pull from recently viewed store */}
                    <ProductCard product={product} /> {/* Self reference as placeholder */}
                </div>
            </section>
        </div>
    );
};

export default ProductDetails;
