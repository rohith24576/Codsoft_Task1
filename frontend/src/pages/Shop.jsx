import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, fetchProducts, loading, categories, fetchCategories } = useProductStore();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'createdAt:desc';

    useEffect(() => {
        fetchProducts({ search, category, sort });
        fetchCategories();
    }, [search, category, sort, fetchProducts, fetchCategories]);

    const handleSortChange = (e) => {
        setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value });
    };

    const handleCategoryChange = (catId) => {
        const params = Object.fromEntries(searchParams);
        if (catId === '') {
            delete params.category;
        } else {
            params.category = catId;
        }
        setSearchParams(params);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-primary">
                        {category ? categories.find(c => c._id === category)?.name : 'All Products'}
                    </h1>
                    <p className="text-secondary mt-2">Showing {products.length} products</p>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className="flex items-center space-x-2 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:border-primary transition-colors"
                    >
                        <SlidersHorizontal size={16} />
                        <span>Filters</span>
                    </button>

                    <div className="relative flex-grow md:flex-grow-0">
                        <select 
                            value={sort}
                            onChange={handleSortChange}
                            className="appearance-none w-full md:w-48 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:border-primary transition-colors bg-white pr-10"
                        >
                            <option value="createdAt:desc">Latest Arrivals</option>
                            <option value="price:asc">Price: Low to High</option>
                            <option value="price:desc">Price: High to Low</option>
                            <option value="ratings:desc">Top Rated</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" size={16} />
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            {(category || search) && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {search && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-primary">
                            <span>Search: {search}</span>
                            <button onClick={() => {
                                const params = Object.fromEntries(searchParams);
                                delete params.search;
                                setSearchParams(params);
                            }}><X size={12} /></button>
                        </span>
                    )}
                    {category && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-primary">
                            <span>Category: {categories.find(c => c._id === category)?.name}</span>
                            <button onClick={() => handleCategoryChange('')}><X size={12} /></button>
                        </span>
                    )}
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {loading ? (
                    [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
                ) : products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <h3 className="text-xl font-bold text-primary mb-2">No products found</h3>
                        <p className="text-secondary">Try adjusting your filters or search query</p>
                    </div>
                )}
            </div>

            {/* Filter Drawer */}
            <AnimatePresence>
                {isFilterOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[70] shadow-premium p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-bold">Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Categories</h4>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleCategoryChange('')}
                                            className={`block w-full text-left py-2 px-4 rounded-xl transition-colors ${category === '' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                                        >
                                            All Categories
                                        </button>
                                        {categories.map((cat) => (
                                            <button 
                                                key={cat._id}
                                                onClick={() => handleCategoryChange(cat._id)}
                                                className={`block w-full text-left py-2 px-4 rounded-xl transition-colors ${category === cat._id ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Price Range</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Min" className="input-field py-2" />
                                        <input type="number" placeholder="Max" className="input-field py-2" />
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8">
                                <button onClick={() => setIsFilterOpen(false)} className="w-full btn-primary py-4">
                                    Apply Filters
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
