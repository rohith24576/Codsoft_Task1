import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const useAuthStore = create((set, get) => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    loading: false,
    checkingAuth: true,

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const token = get().accessToken;
            if (!token) {
                set({ user: null, checkingAuth: false });
                return;
            }
            const response = await axios.get(`${API_URL}/users/current-user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ user: response.data.data, checkingAuth: false });
        } catch (error) {
            set({ user: null, checkingAuth: false, accessToken: null });
            localStorage.removeItem('accessToken');
        }
    },

    register: async (data) => {
        set({ loading: true });
        try {
            const response = await axios.post(`${API_URL}/users/register`, data);
            toast.success('Registration successful! Please login.');
            set({ loading: false });
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            set({ loading: false });
            return false;
        }
    },

    login: async (data) => {
        set({ loading: true });
        try {
            const response = await axios.post(`${API_URL}/users/login`, data);
            const { user, accessToken } = response.data.data;
            set({ user, accessToken, loading: false });
            localStorage.setItem('accessToken', accessToken);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            set({ loading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/users/logout`, {}, {
                headers: { Authorization: `Bearer ${get().accessToken}` }
            });
            set({ user: null, accessToken: null });
            localStorage.removeItem('accessToken');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    },

    updateAvatar: (newAvatar) => {
        set(state => ({
            user: state.user ? { ...state.user, avatar: newAvatar } : null
        }));
    },

    updateProfile: (updatedData) => {
        set(state => ({
            user: state.user ? { ...state.user, ...updatedData } : null
        }));
        toast.success('Profile updated successfully! ✨');
    },

    addAddress: async (addressData) => {
        try {
            const token = get().accessToken;
            const response = await axios.post(`${API_URL}/users/address`, addressData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({
                user: state.user ? { ...state.user, addresses: response.data.data } : null
            }));
            toast.success('Address saved successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address');
            return false;
        }
    },

    removeAddress: async (addressId) => {
        try {
            const token = get().accessToken;
            const response = await axios.delete(`${API_URL}/users/address/${addressId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set(state => ({
                user: state.user ? { ...state.user, addresses: response.data.data } : null
            }));
            toast.success('Address removed');
        } catch (error) {
            toast.error('Failed to remove address');
        }
    }
}));
