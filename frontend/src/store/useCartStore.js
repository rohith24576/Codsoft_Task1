import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            coupon: null,
            isCouponApplied: false,

            addToCart: (product, qty = 1) => {
                const cart = get().cart;
                const existItem = cart.find((x) => x._id === product._id);

                if (existItem) {
                    set({
                        cart: cart.map((x) =>
                            x._id === existItem._id ? { ...x, qty: x.qty + qty } : x
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, qty }] });
                }
                toast.success('Added to cart');
            },

            removeFromCart: (id) => {
                set({ cart: get().cart.filter((x) => x._id !== id) });
                toast.success('Removed from cart');
            },

            updateQty: (id, qty) => {
                set({
                    cart: get().cart.map((x) =>
                        x._id === id ? { ...x, qty: Math.max(1, qty) } : x
                    ),
                });
            },

            applyCoupon: (coupon) => {
                set({ coupon, isCouponApplied: true });
                toast.success('Coupon applied!');
            },

            removeCoupon: () => {
                set({ coupon: null, isCouponApplied: false });
            },

            clearCart: () => {
                set({ cart: [], coupon: null, isCouponApplied: false });
            },

            getCartTotal: () => {
                const subtotal = get().cart.reduce((acc, item) => acc + item.price * item.qty, 0);
                let total = subtotal;
                if (get().coupon) {
                    total = subtotal - (subtotal * get().coupon.discount) / 100;
                }
                return { subtotal, total };
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
