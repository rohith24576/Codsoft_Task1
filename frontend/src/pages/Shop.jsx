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
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    
    // Form States
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [selectedSizes, setSelectedSizes] = useState(searchParams.get('size')?.split(',') || []);
    const [selectedColors, setSelectedColors] = useState(searchParams.get('color')?.split(',') || []);
    const [selectedBrands, setSelectedBrands] = useState(searchParams.get('brand')?.split(',') || []);
    
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'createdAt:desc';
    const currentMin = searchParams.get('minPrice') || '';
    const currentMax = searchParams.get('maxPrice') || '';
    const currentSize = searchParams.get('size') || '';
    const currentColor = searchParams.get('color') || '';
    const currentBrand = searchParams.get('brand') || '';

    const FILTER_SIZES = ['S', 'M', 'L', 'XL', '7', '8', '9', '10'];
    const FILTER_COLORS = ['Black', 'White', 'Navy', 'Grey', 'Red', 'Brown'];
    const FILTER_BRANDS = ['Elite', 'Nike', 'Zara', 'Gucci'];

    useEffect(() => {
        fetchProducts({ search, category, sort, minPrice: currentMin, maxPrice: currentMax, size: currentSize, color: currentColor, brand: currentBrand });
        fetchCategories();
    }, [search, category, sort, currentMin, currentMax, currentSize, currentColor, currentBrand, fetchProducts, fetchCategories]);

    const handleSortChange = (value) => {
        setSearchParams({ ...Object.fromEntries(searchParams), sort: value });
        setIsSortDropdownOpen(false);
    };

    const sortOptions = [
        { value: 'createdAt:desc', label: 'Latest Arrivals' },
        { value: 'price:asc', label: 'Price: Low to High' },
        { value: 'price:desc', label: 'Price: High to Low' },
        { value: 'ratings:desc', label: 'Top Rated' }
    ];

    const applyFilters = () => {
        const params = Object.fromEntries(searchParams);
        if (minPrice) params.minPrice = minPrice;
        else delete params.minPrice;
        
        if (maxPrice) params.maxPrice = maxPrice;
        else delete params.maxPrice;

        if (selectedSizes.length > 0) params.size = selectedSizes.join(',');
        else delete params.size;

        if (selectedColors.length > 0) params.color = selectedColors.join(',');
        else delete params.color;

        if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
        else delete params.brand;
        
        setSearchParams(params);
        setIsFilterOpen(false);
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

    const clearFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedBrands([]);
        setSearchParams({});
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

                    <div className="relative flex-grow md:flex-grow-0 z-40">
                        <div 
                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            className="flex items-center justify-between w-full md:w-48 px-5 py-2.5 border border-gray-200 rounded-full text-sm font-medium hover:border-primary transition-colors bg-white cursor-pointer"
                        >
                            <span className="truncate pr-2">
                                {sortOptions.find(opt => opt.value === sort)?.label || 'Latest Arrivals'}
                            </span>
                            <ChevronDown className={`text-secondary transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} size={16} />
                        </div>

                        <AnimatePresence>
                            {isSortDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute right-0 w-full md:w-48 mt-2 bg-white border border-gray-100 rounded-2xl shadow-premium overflow-hidden"
                                >
                                    {sortOptions.map(option => (
                                        <div 
                                            key={option.value}
                                            onClick={() => handleSortChange(option.value)}
                                            className={`px-5 py-3 cursor-pointer text-sm transition-colors hover:bg-gray-50 ${sort === option.value ? 'bg-primary/5 text-primary font-bold' : 'text-secondary font-medium'}`}
                                        >
                                            {option.label}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Active Filters Bar */}
            {(category || search || currentMin || currentMax) && (
                <div className="flex flex-wrap items-center gap-2 mb-8">
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
                    {(currentMin || currentMax) && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary border border-primary/10">
                            <span>Price: ${currentMin || 0} - ${currentMax || '∞'}</span>
                            <button onClick={() => {
                                const params = Object.fromEntries(searchParams);
                                delete params.minPrice;
                                delete params.maxPrice;
                                setMinPrice('');
                                setMaxPrice('');
                                setSearchParams(params);
                            }}><X size={12} /></button>
                        </span>
                    )}
                    {currentSize && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary border border-primary/10">
                            <span>Size: {currentSize}</span>
                            <button onClick={() => {
                                const params = Object.fromEntries(searchParams);
                                delete params.size;
                                setSelectedSizes([]);
                                setSearchParams(params);
                            }}><X size={12} /></button>
                        </span>
                    )}
                    {currentColor && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary border border-primary/10">
                            <span>Color: {currentColor}</span>
                            <button onClick={() => {
                                const params = Object.fromEntries(searchParams);
                                delete params.color;
                                setSelectedColors([]);
                                setSearchParams(params);
                            }}><X size={12} /></button>
                        </span>
                    )}
                    {currentBrand && (
                        <span className="flex items-center space-x-2 px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary border border-primary/10">
                            <span>Brand: {currentBrand}</span>
                            <button onClick={() => {
                                const params = Object.fromEntries(searchParams);
                                delete params.brand;
                                setSelectedBrands([]);
                                setSearchParams(params);
                            }}><X size={12} /></button>
                        </span>
                    )}
                    <button onClick={clearFilters} className="text-xs font-bold text-gray-400 hover:text-primary transition-colors ml-2">Clear All</button>
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
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
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
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min Price</label>
                                            <input 
                                                type="number" 
                                                placeholder="0" 
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20" 
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Price</label>
                                            <input 
                                                type="number" 
                                                placeholder="No limit" 
                                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20" 
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Size</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_SIZES.map(s => (
                                            <button 
                                                key={s} 
                                                onClick={() => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                                                className={`min-w-[2.5rem] px-3 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors border ${selectedSizes.includes(s) ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-secondary border-transparent hover:border-gray-200'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Color</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_COLORS.map(c => (
                                            <button 
                                                key={c} 
                                                onClick={() => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${selectedColors.includes(c) ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-secondary border-transparent hover:border-gray-200'}`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pb-24">
                                    <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Brand</h4>
                                    <div className="space-y-3">
                                        {FILTER_BRANDS.map(b => (
                                            <label key={b} className="flex items-center space-x-3 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedBrands.includes(b)}
                                                    onChange={() => setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium">{b}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 space-y-4">
                                <button onClick={clearFilters} className="w-full py-4 text-xs font-bold text-gray-400 hover:text-primary transition-colors">
                                    Clear All Filters
                                </button>
                                <button onClick={applyFilters} className="w-full btn-primary py-4 rounded-2xl shadow-lg">
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
