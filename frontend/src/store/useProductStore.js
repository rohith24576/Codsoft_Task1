import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useProductStore = create((set, get) => ({
    products: [],
    featuredProducts: [],
    categories: [],
    loading: false,
    product: null,
    relatedProducts: [],
    recentlyViewed: [],

    fetchProducts: async (params = {}) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${API_URL}/products`, { params });
            set({ products: response.data.data.products, loading: false });
        } catch (error) {
            toast.error('Failed to fetch products');
            set({ loading: false });
        }
    },

    fetchFeaturedProducts: async () => {
        try {
            const response = await axios.get(`${API_URL}/products/featured`);
            set({ featuredProducts: response.data.data });
        } catch (error) {
            console.error('Failed to fetch featured products');
        }
    },

    fetchCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            set({ categories: response.data.data });
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    },

    fetchProductById: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            const fetchedProduct = response.data.data;
            set({ product: fetchedProduct, loading: false });
            
            // Add to recently viewed
            set((state) => {
                const exists = state.recentlyViewed.find(p => p._id === fetchedProduct._id);
                if (exists) {
                    // Move to front
                    const filtered = state.recentlyViewed.filter(p => p._id !== fetchedProduct._id);
                    return { recentlyViewed: [fetchedProduct, ...filtered].slice(0, 5) };
                }
                return { recentlyViewed: [fetchedProduct, ...state.recentlyViewed].slice(0, 5) };
            });

            // Fetch related products (same category, exclude current)
            if (fetchedProduct.category?._id) {
                try {
                    const relatedRes = await axios.get(`${API_URL}/products?category=${fetchedProduct.category._id}`);
                    const related = relatedRes.data.data.products
                        .filter(p => p._id !== fetchedProduct._id)
                        .slice(0, 4);
                    set({ relatedProducts: related });
                } catch (error) {
                    console.error('Failed to fetch related products', error);
                }
            }

            return fetchedProduct;
        } catch (error) {
            toast.error('Product not found');
            set({ loading: false });
            return null;
        }
    },

    createProduct: async (formData) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`${API_URL}/products`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });
            toast.success('Product created successfully');
            set({ loading: false });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product');
            set({ loading: false });
            return false;
        }
    },

    deleteProduct: async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`${API_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({
                products: state.products.filter(p => p._id !== id)
            }));
            toast.success('Product removed successfully');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    }
}));
