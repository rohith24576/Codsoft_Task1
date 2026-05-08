import React from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '../store/useProductStore';
import { Link } from 'react-router-dom';

const Categories = () => {
    const { categories, loading } = useProductStore();

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-4xl font-bold text-primary mb-4">Categories</h1>
            <p className="text-secondary mb-12">Discover products by their category.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <Link 
                        to={`/shop?category=${category.slug || category._id}`} 
                        key={category._id}
                        className="group relative h-80 rounded-3xl overflow-hidden bg-gray-100"
                    >
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <h2 className="text-3xl font-bold mb-2">{category.name}</h2>
                            <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Browse Products</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categories;
