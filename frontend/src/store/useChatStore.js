import { create } from 'zustand';

export const useChatStore = create((set) => ({
    isChatOpen: false,
    setIsChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
    openChat: () => set({ isChatOpen: true }),
    closeChat: () => set({ isChatOpen: false }),
}));
