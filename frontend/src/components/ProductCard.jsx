import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';

import { useWishlistStore } from '../store/useWishlistStore';

const ProductCard = ({ product }) => {
    const { addToCart } = useCartStore();
    const { addToWishlist, isInWishlist } = useWishlistStore();
    const isFavorite = isInWishlist(product._id);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-2xl overflow-hidden card-hover"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <Link to={`/product/${product._id}`}>
                    <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                
                {/* Overlay Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                        onClick={() => addToWishlist(product)}
                        className={`p-3 rounded-full shadow-soft transition-colors ${isFavorite ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary hover:text-white'}`}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    <button 
                        onClick={() => addToCart(product)}
                        className="p-3 bg-white text-primary rounded-full shadow-soft hover:bg-primary hover:text-white transition-colors"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>

                {/* Badge */}
                {product.discountPrice > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        Sale
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-secondary uppercase tracking-widest mb-1">{product.category?.name}</p>
                        <Link to={`/product/${product._id}`}>
                            <h3 className="text-sm font-semibold text-primary group-hover:text-gray-600 transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium text-secondary">{product.ratings}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">
                        ${product.discountPrice > 0 ? product.discountPrice : product.price}
                    </span>
                    {product.discountPrice > 0 && (
                        <span className="text-sm text-secondary line-through opacity-50">
                            ${product.price}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
