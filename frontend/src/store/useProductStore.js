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
            set({ product: response.data.data, loading: false });
            return response.data.data;
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
    }
}));
