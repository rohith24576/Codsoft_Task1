import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Tag, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';

const Home = () => {
    const { featuredProducts, fetchFeaturedProducts, categories, fetchCategories, loading } = useProductStore();

    useEffect(() => {
        fetchFeaturedProducts();
        fetchCategories();
    }, [fetchFeaturedProducts, fetchCategories]);

    return (
        <div className="space-y-20 pb-20">
            {/* Premium Hero Section */}
            <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-black">
                {/* Background Image with Parallax-like Effect */}
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.7 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
                        alt="Luxury Store" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <span className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold tracking-[0.3em] text-white uppercase mb-8">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                <span>Curated Excellence 2026</span>
                            </span>
                            
                            <h1 className="text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
                                ELEVATE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white italic">EVERYDAY.</span>
                            </h1>
                            
                            <p className="text-xl text-gray-300 mb-12 max-w-lg leading-relaxed font-light">
                                Experience the intersection of artisanal craftsmanship and modern minimalism. Our 2026 collection defines the new standard of essential luxury.
                            </p>
                            
                            <div className="flex flex-wrap gap-6">
                                <Link to="/shop" className="group relative px-10 py-5 bg-white text-primary font-bold rounded-full overflow-hidden transition-all duration-500 hover:pr-14">
                                    <span className="relative z-10">Explore Collection</span>
                                    <ArrowRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </Link>
                                <Link to="/shop?category=featured" className="px-10 py-5 bg-transparent border border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all duration-300">
                                    View Lookbook
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Elements for "Wow" Factor */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute right-10 bottom-20 hidden lg:block"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-premium max-w-[280px]">
                        <div className="flex -space-x-3 mb-6">
                            {[1,2,3,4].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-black" alt="user" />
                            ))}
                            <div className="w-10 h-10 rounded-full bg-white text-primary text-[10px] font-bold flex items-center justify-center border-2 border-black">+2k</div>
                        </div>
                        <h4 className="text-white font-bold mb-2">Trusted by Trendsetters</h4>
                        <p className="text-gray-400 text-xs leading-relaxed">Join over 50,000 global customers who define their style with ShopNest.</p>
                    </div>
                </motion.div>

                {/* Bottom Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent mx-auto"></div>
                </motion.div>
            </section>

            {/* Features Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100">
                    <div className="flex flex-col items-center text-center space-y-3">
                        <Truck className="text-primary" size={24} />
                        <h3 className="text-sm font-bold">Free Shipping</h3>
                        <p className="text-xs text-secondary">On orders over $150</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <ShieldCheck className="text-primary" size={24} />
                        <h3 className="text-sm font-bold">Secure Payment</h3>
                        <p className="text-xs text-secondary">100% secure checkout</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <RotateCcw className="text-primary" size={24} />
                        <h3 className="text-sm font-bold">Easy Returns</h3>
                        <p className="text-xs text-secondary">30-day return policy</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <Star className="text-primary" size={24} />
                        <h3 className="text-sm font-bold">Premium Quality</h3>
                        <p className="text-xs text-secondary">Crafted with care</p>
                    </div>
                </div>
            </section>

            {/* Special Offers Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 to-black p-10 text-white group"
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 block">Tier 01</span>
                            <h3 className="text-3xl font-bold mb-4">Spend $300+ <br />Get 15% OFF</h3>
                            <p className="text-gray-400 text-sm mb-8 max-w-[200px]">Unlock exclusive savings on your premium essentials.</p>
                            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                <span className="text-xs font-medium opacity-60">Use Code:</span>
                                <span className="text-sm font-bold tracking-widest text-white">SAVE300</span>
                            </div>
                        </div>
                        <Tag className="absolute -right-4 -bottom-4 text-white/5 rotate-12" size={200} />
                    </motion.div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-black p-10 text-white group"
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 block">Tier 02</span>
                            <h3 className="text-3xl font-bold mb-4">Spend $500+ <br />Get 25% OFF</h3>
                            <p className="text-gray-100/60 text-sm mb-8 max-w-[200px]">The ultimate reward for the modern connoisseur.</p>
                            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-white text-primary rounded-xl">
                                <span className="text-xs font-medium opacity-60">Use Code:</span>
                                <span className="text-sm font-bold tracking-widest">VIP500</span>
                            </div>
                        </div>
                        <ShoppingBag className="absolute -right-4 -bottom-4 text-white/5 -rotate-12" size={200} />
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Browse Categories</h2>
                        <p className="text-secondary mt-2">Find what you're looking for</p>
                    </div>
                    <Link to="/categories" className="text-sm font-bold flex items-center space-x-1 group">
                        <span>View All</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.slice(0, 4).map((category, index) => (
                        <Link 
                            key={category._id} 
                            to={`/shop?category=${category._id}`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
                            >
                                <img 
                                    src={category.image || `https://source.unsplash.com/random/400x400?${category.name}`} 
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-lg font-bold">{category.name}</h3>
                                    <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">Explore Collection</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-primary">Featured Selection</h2>
                        <p className="text-secondary mt-2">Handpicked for your unique taste</p>
                    </div>
                    <Link to="/shop" className="text-sm font-bold flex items-center space-x-1 group">
                        <span>Browse Shop</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loading ? (
                        [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
                    ) : (
                        featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Join the Nest.</h2>
                        <p className="text-gray-400 mb-10 text-lg">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="flex flex-col sm:row space-y-4 sm:space-y-0 sm:space-x-4">
                            <input 
                                type="email" 
                                placeholder="Your email address" 
                                className="flex-grow px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                            <button type="submit" className="px-8 py-4 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                    {/* Decorative blurred circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
