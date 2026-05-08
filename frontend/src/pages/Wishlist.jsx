import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const { wishlist } = useWishlistStore();

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-bold text-primary">My Wishlist</h1>
                <p className="text-secondary mt-2">You have {wishlist.length} items in your wishlist</p>
            </motion.div>

            {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft text-gray-300">
                        <Heart size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-2">Your wishlist is empty</h2>
                    <p className="text-secondary mb-8">Save items you love to your wishlist for later.</p>
                    <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
                        <ShoppingBag size={18} />
                        <span>Start Shopping</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
