import { create } from 'zustand';

const EXCHANGE_RATE = 83.5; // 1 USD = 83.5 INR

export const useCurrencyStore = create((set, get) => ({
    currency: 'USD', // 'USD' or 'INR'
    
    toggleCurrency: () => {
        set((state) => ({
            currency: state.currency === 'USD' ? 'INR' : 'USD'
        }));
    },

    formatPrice: (priceInUSD) => {
        const { currency } = get();
        if (currency === 'INR') {
            const inrPrice = priceInUSD * EXCHANGE_RATE;
            return `₹${inrPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        }
        return `$${Number(priceInUSD).toFixed(2)}`;
    },
}));
