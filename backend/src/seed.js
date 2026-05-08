import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/product.model.js';
import { Category } from './models/category.model.js';

dotenv.config();

const categories = [
    {
        name: 'Men',
        slug: 'men',
        image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Women',
        slug: 'women',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Accessories',
        slug: 'accessories',
        image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Footwear',
        slug: 'footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    }
];

const products = [
    {
        name: 'Premium Cotton Tee',
        description: 'A high-quality, breathable cotton t-shirt for everyday comfort.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
        category: 'men',
        stock: 50,
        isFeatured: true
    },
    {
        name: 'Minimalist Silk Dress',
        description: 'Elegant silk dress with a modern silhouette.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1539008835279-4346984c1fca?auto=format&fit=crop&q=80&w=800',
        category: 'women',
        stock: 25,
        isFeatured: true
    },
    {
        name: 'Urban Sneakers',
        description: 'Lightweight sneakers designed for the city explorer.',
        price: 85,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
        category: 'footwear',
        stock: 30,
        isFeatured: true
    },
    {
        name: 'Classic Leather Watch',
        description: 'Timeless design with a genuine leather strap.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
        category: 'accessories',
        stock: 15,
        isFeatured: true
    }
];

const seedDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
        });
        console.log('SUCCESS: Connected to DB');

        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleaned existing data.');

        const createdCategories = await Category.insertMany(categories);
        console.log('SUCCESS: Categories seeded!');

        const productsWithIds = products.map(p => {
            const cat = createdCategories.find(c => c.slug === p.category);
            return { ...p, category: cat._id };
        });

        await Product.insertMany(productsWithIds);
        console.log('SUCCESS: Products seeded!');

        console.log('\n--- SEEDING COMPLETED SUCCESSFULLY ---');
        process.exit(0);
    } catch (error) {
        console.error('\n--- SEEDING FAILED ---');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        process.exit(1);
    }
};

seedDB();
