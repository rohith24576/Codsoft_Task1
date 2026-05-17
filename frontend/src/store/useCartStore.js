import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            coupon: null,
            isCouponApplied: false,
            shippingThreshold: 100,
            shippingFee: 10,

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
                toast.success(`Added ${qty}x ${product.name || 'item'} to cart`);
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
                const { cart, coupon, shippingThreshold, shippingFee } = get();
                const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
                const isFreeShipping = subtotal >= shippingThreshold;
                const currentShippingFee = subtotal > 0 && !isFreeShipping ? shippingFee : 0;
                
                let total = subtotal + currentShippingFee;
                if (coupon) {
                    if (coupon.type === 'flat') {
                        total = Math.max(0, total - coupon.discount);
                    } else {
                        // Apply discount to subtotal only or subtotal + shipping? Usually just subtotal.
                        const discountAmount = (subtotal * coupon.discount) / 100;
                        total = Math.max(0, subtotal - discountAmount + currentShippingFee);
                    }
                }
                return { subtotal, total, isFreeShipping, shippingFee: currentShippingFee };
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);
