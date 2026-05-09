import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../store/useChatStore';
import { Plus, Minus, HelpCircle, Truck, RefreshCw, CreditCard, User, ShieldCheck } from 'lucide-react';

const FAQItem = ({ question, answer, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between group"
            >
                <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-50 text-secondary group-hover:bg-gray-100'}`}>
                        <Icon size={20} />
                    </div>
                    <span className={`text-left font-bold transition-colors ${isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                        {question}
                    </span>
                </div>
                <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-primary/10 text-primary rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 pl-14 pr-4">
                            <p className="text-sm leading-relaxed text-secondary font-medium italic border-l-2 border-primary/20 pl-4">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQs = () => {
    const faqCategories = [
        {
            title: "Orders & Shipping",
            items: [
                {
                    icon: Truck,
                    question: "How long does shipping take?",
                    answer: "We offer lightning-fast shipping! Orders are typically processed within 24 hours. Standard shipping takes 3-5 business days, while Express shipping arrives in 1-2 days. You'll get a tracking link the moment it leaves our Nest!"
                },
                {
                    icon: CreditCard,
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, you'll receive an email with a tracking number. You can also track your order directly from your 'My Orders' section in your ShopNest profile."
                }
            ]
        },
        {
            title: "Payments & Discounts",
            items: [
                {
                    icon: ShieldCheck,
                    question: "How do I apply my VIP500 coupon?",
                    answer: "Easy! At checkout or in your Cart, simply type 'VIP500' in the promo code box. As a VIP member, you'll receive an instant 25% discount on your entire order. Note: This code is only for our premium members."
                },
                {
                    icon: CreditCard,
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, debit cards, and Stripe for secure transactions. Your payment information is encrypted and never stored on our servers for your total security."
                }
            ]
        },
        {
            title: "Returns & Support",
            items: [
                {
                    icon: RefreshCw,
                    question: "What is your return policy?",
                    answer: "Not happy with your nest? No problem! We offer a 30-day hassle-free return policy. Items must be in their original condition. Simply head to the returns center to print your prepaid label."
                },
                {
                    icon: HelpCircle,
                    question: "How can I contact customer support?",
                    answer: "We're here for you 24/7! You can reach us via the Live Chat icon in the corner of your screen, or email us at support@shopnest.com. Our typical response time is under 2 hours."
                }
            ]
        },
        {
            title: "Account & Security",
            items: [
                {
                    icon: User,
                    question: "Is my personal data safe with ShopNest?",
                    answer: "Absolutely. We use industry-leading encryption and advanced security protocols to protect your identity. Your profile photo and personal details are visible only to you."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/5 rounded-full text-primary mb-6"
                    >
                        <HelpCircle size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Help Center</span>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight"
                    >
                        Questions? <span className="text-gray-400 font-light italic">We've got answers.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-secondary max-w-lg mx-auto text-lg font-medium"
                    >
                        Everything you need to know about shopping at ShopNest, from shipping to VIP rewards.
                    </motion.p>
                </div>

                {/* FAQ List */}
                <div className="space-y-12">
                    {faqCategories.map((category, catIdx) => (
                        <motion.div 
                            key={catIdx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: catIdx * 0.1 }}
                        >
                            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 border-b border-gray-100 pb-4">
                                {category.title}
                            </h2>
                            <div className="bg-gray-50/50 rounded-[2.5rem] px-8 py-2 border border-gray-100">
                                {category.items.map((item, itemIdx) => (
                                    <FAQItem key={itemIdx} {...item} />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Still Need Help? */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 p-10 bg-primary rounded-[3rem] text-center text-white shadow-premium relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-3xl" />
                    
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-white/70 mb-8 max-w-md mx-auto text-sm font-medium">
                        Can't find the answer you're looking for? Our elite support team is ready to assist you personally.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <button 
                            onClick={() => useChatStore.getState().openChat()}
                            className="px-10 py-4 bg-white text-primary text-xs font-bold rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest shadow-lg"
                        >
                            Contact Support
                        </button>
                        <a 
                            href="mailto:support@shopnest.com"
                            className="px-10 py-4 border border-white/30 text-white text-xs font-bold rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-center"
                        >
                            Email Us
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQs;
