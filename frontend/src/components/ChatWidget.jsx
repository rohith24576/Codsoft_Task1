import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ChevronRight, MessageCircle, Sparkles, Bot, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatWidget = () => {
    const { user } = useAuthStore();
    const { isChatOpen, setIsChatOpen } = useChatStore();
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const chatEndRef = useRef(null);

    const quickQuestions = [
        // Original 4 questions
        { 
            id: 'q1', text: "How do I start a return?", 
            answer: "Starting a return is easy! Simply go to your **Order History** in your profile, find the order you'd like to return, and click the 'Return' button. You'll receive a prepaid shipping label via email within 24 hours. Pack the item in its original packaging and drop it off at any authorized shipping location. Refunds are processed within 5-7 business days after we receive the item." 
        },
        { 
            id: 'q2', text: "What is your return policy?", 
            answer: "At ShopNest, we offer a hassle-free **30-day return policy** on all items. Products must be in their original condition with tags attached. Sale items can be returned within 14 days for store credit. We cover return shipping costs for defective or incorrect items. For all other returns, a flat ₹99 return shipping fee applies." 
        },
        { 
            id: 'q3', text: "Can I track my order?", 
            answer: "Absolutely! Once your order ships, you'll receive a tracking link via email and SMS. You can also track your order anytime by visiting **My Orders** in your account dashboard. We provide real-time updates from dispatch to delivery, so you always know exactly where your package is." 
        },
        { 
            id: 'q4', text: "Show me trending items", 
            answer: "🔥 Here are our current trending items:\n\n• **Premium Cotton Tee** – ⭐ 4.8 | ₹45\n• **Velvet Evening Gown** – ⭐ 5.0 | ₹240\n• **Classic Leather Watch** – ⭐ 4.9 | ₹190\n• **Tan Trench Coat** – ⭐ 4.9 | ₹150\n\nHead over to the **Shop** page and filter by 'Featured' to see all our top-rated picks!" 
        },

        // 10 new questions
        { 
            id: 'q5', text: "What payment methods do you accept?", 
            answer: "We accept a wide range of payment methods for your convenience:\n\n💳 **Credit/Debit Cards** – Visa, Mastercard, RuPay\n📱 **UPI** – Google Pay, PhonePe, Paytm\n🏦 **Net Banking** – All major banks supported\n💰 **Cash on Delivery** – Available on orders under ₹5,000\n\nAll transactions are secured with 256-bit SSL encryption." 
        },
        { 
            id: 'q6', text: "How long does shipping take?", 
            answer: "Our shipping timelines depend on your location:\n\n🚀 **Metro Cities** – 2-3 business days\n🏙️ **Tier 2 Cities** – 3-5 business days\n🌄 **Remote Areas** – 5-7 business days\n\n**Free shipping** is available on all orders above ₹499! We also offer express delivery (next-day) for select pin codes at an additional charge." 
        },
        { 
            id: 'q7', text: "Do you have a size guide?", 
            answer: "Yes! Every product page includes a detailed **Size Guide** button. Our size charts cover measurements for chest, waist, hips, and length in both inches and centimeters. We recommend measuring yourself with a soft tape measure for the most accurate fit.\n\n💡 **Pro Tip:** If you're between sizes, we recommend going one size up for a comfortable fit!" 
        },
        { 
            id: 'q8', text: "How do I create an account?", 
            answer: "Creating a ShopNest account takes just a minute!\n\n1️⃣ Click the **Sign Up** button on the top right\n2️⃣ Enter your full name, email, and a password\n3️⃣ You're all set! 🎉\n\nWith an account, you can track orders, save your wishlist, write reviews, and enjoy a faster checkout experience." 
        },
        { 
            id: 'q9', text: "What categories do you offer?", 
            answer: "ShopNest has a curated collection across three main categories:\n\n👔 **Men** – Premium tees, denim, hoodies, linen shirts, trench coats, wool sweaters & more\n👗 **Women** – Silk dresses, cargo pants, maxi dresses, biker jackets, evening gowns & more\n🎒 **Accessories** – Leather watches, sunglasses, canvas backpacks, wallets, scarves & jewelry\n\nExplore each category from the navigation bar!" 
        },
        { 
            id: 'q10', text: "Can I cancel my order?", 
            answer: "Yes, you can cancel your order **before it has been shipped**. Here's how:\n\n1️⃣ Go to **My Orders** in your profile\n2️⃣ Find the order you want to cancel\n3️⃣ Click **Cancel Order**\n\nOnce cancelled, your refund will be processed within 3-5 business days to your original payment method. If the order has already shipped, you'll need to initiate a return instead." 
        },
        { 
            id: 'q11', text: "Do you offer discounts or coupons?", 
            answer: "We love rewarding our customers! 🎁\n\n🏷️ **First Order** – Use code **WELCOME10** for 10% off\n📧 **Newsletter** – Subscribe to get exclusive deals & early access to sales\n🎂 **Birthday Bonus** – Special discount on your birthday month\n⭐ **Loyalty Rewards** – Earn points on every purchase that can be redeemed later\n\nKeep an eye on our homepage banners for seasonal sales and flash deals!" 
        },
        { 
            id: 'q12', text: "How do I write a product review?", 
            answer: "Sharing your feedback is simple!\n\n1️⃣ Navigate to the **product page** of the item you purchased\n2️⃣ Scroll down to the **Reviews** section\n3️⃣ Click **Write a Review**, give a star rating, and share your thoughts\n\nYour reviews help other shoppers make informed decisions and help us improve our products. We truly value your feedback! 💬" 
        },
        { 
            id: 'q13', text: "Is my personal data safe?", 
            answer: "Your privacy and security are our top priorities! 🔒\n\n✅ **SSL Encryption** – All data is encrypted with industry-standard 256-bit SSL\n✅ **Secure Payments** – We never store your full card details\n✅ **Privacy Policy** – We never share your personal data with third parties\n✅ **Account Security** – Passwords are hashed and securely stored\n\nYou can shop with complete peace of mind at ShopNest." 
        },
        { 
            id: 'q14', text: "How do I contact customer support?", 
            answer: "We're always here to help! You can reach our support team through:\n\n📧 **Email** – support@shopnest.com (replies within 24 hours)\n📞 **Phone** – +91 1800-SHOP-NEST (Mon-Sat, 9 AM - 9 PM)\n💬 **Live Chat** – You're already using it! 😊\n📱 **Social Media** – DM us on Instagram or Twitter @ShopNest\n\nOur team typically responds within a few hours during business hours." 
        },
    ];

    const fallbackResponse = "Thank you for your question! 🙏 Our team is reviewing it and will get back to you shortly. In the meantime, feel free to browse our FAQ options above or reach out to us at **support@shopnest.com** for immediate assistance.";

    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setChatMessages([
                    { id: 1, text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I am your ShopNest ChatBot. How can I help you today?`, sender: 'bot' }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isChatOpen, chatMessages.length, user]);

    const handleQuickQuestion = async (question) => {
        setSelectedAnswer(null);
        setIsTyping(true);
        // Simulate a short thinking delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        setSelectedAnswer({ question: question.text, answer: question.answer });
        setIsTyping(false);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const messageText = userInput;
        const newUserMessage = { id: Date.now(), text: messageText, sender: 'user' };
        setChatMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        
        setIsTyping(true);
        // Simulate a short thinking delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setChatMessages(prev => [...prev, { id: Date.now() + 1, text: fallbackResponse, sender: 'bot' }]);
        setIsTyping(false);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isTyping, selectedAnswer]);

    // Format message text with basic markdown bold support
    const formatMessage = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <>
            {/* Toggle Button */}
            {!isChatOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-8 right-8 p-5 bg-primary text-white rounded-full shadow-premium z-[100] group"
                >
                    <div className="absolute -top-2 -right-2 bg-white text-primary p-1 rounded-full shadow-lg border border-gray-100 group-hover:scale-110 transition-transform">
                        <Sparkles size={12} className="fill-primary" />
                    </div>
                    <MessageCircle size={24} />
                </motion.button>
            )}

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-8 right-8 w-[calc(100vw-4rem)] max-w-[420px] bg-white rounded-[2.5rem] shadow-2xl z-[100] border border-gray-100 overflow-hidden flex flex-col h-[650px] max-h-[80vh]"
                    >
                        {/* Chat Header */}
                        <div className="p-6 bg-primary text-white flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/30 backdrop-blur-md">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight">ShopNest ChatBot</h4>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Always Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {chatMessages.map((msg) => (
                                <motion.div 
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.sender === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex items-start space-x-3 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-primary text-white shadow-lg' : 'bg-white border border-gray-100 text-primary shadow-sm'}`}>
                                            {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm whitespace-pre-line ${
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white text-secondary rounded-tl-none'
                                        }`}>
                                            {formatMessage(msg.text)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Quick Questions Chips */}
                            {!isTyping && (
                                <div className="pt-4 flex flex-wrap gap-2">
                                    {quickQuestions.map((q) => (
                                        <button 
                                            key={q.id}
                                            onClick={() => handleQuickQuestion(q)}
                                            className="px-4 py-2 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-secondary hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-sm flex items-center space-x-2 uppercase tracking-wider"
                                        >
                                            <span>{q.text}</span>
                                            <ChevronRight size={10} />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Selected Answer - displayed below the questions */}
                            {selectedAnswer && !isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 border border-primary/15 rounded-2xl bg-primary/[0.03] overflow-hidden"
                                >
                                    <div className="px-4 py-2.5 bg-primary/10 border-b border-primary/10">
                                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider">{selectedAnswer.question}</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 text-primary shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Bot size={13} />
                                            </div>
                                            <p className="text-[13px] leading-relaxed font-medium text-secondary whitespace-pre-line flex-1">
                                                {formatMessage(selectedAnswer.answer)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Typing indicator below questions */}
                            {isTyping && selectedAnswer === null && (
                                <div className="mt-4 flex justify-start">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 text-primary shadow-sm flex items-center justify-center">
                                            <Bot size={13} />
                                        </div>
                                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                            <Loader2 size={14} className="animate-spin text-primary" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thinking</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef} />

                        </div>

                        {/* Chat Input */}
                        <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-100">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask anything about style, orders, or ShopNest..." 
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-14 text-sm font-medium focus:ring-2 focus:ring-primary/5 transition-all shadow-inner"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!userInput.trim() || isTyping}
                                    className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-90 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <p className="text-[9px] text-center text-gray-400 mt-4 font-bold uppercase tracking-[0.2em]">Powered by ShopNest ChatBot</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
