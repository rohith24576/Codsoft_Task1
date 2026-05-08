import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],
            addToWishlist: (product) => {
                const { wishlist } = get();
                const isExist = wishlist.find((item) => item._id === product._id);

                if (isExist) {
                    set({
                        wishlist: wishlist.filter((item) => item._id !== product._id),
                    });
                    toast.success('Removed from wishlist');
                } else {
                    set({ wishlist: [...wishlist, product] });
                    toast.success('Added to wishlist');
                }
            },
            removeFromWishlist: (productId) => {
                set({
                    wishlist: get().wishlist.filter((item) => item._id !== productId),
                });
                toast.success('Removed from wishlist');
            },
            isInWishlist: (productId) => {
                return get().wishlist.some((item) => item._id === productId);
            },
            clearWishlist: () => set({ wishlist: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);
