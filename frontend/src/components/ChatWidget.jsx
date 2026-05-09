import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ChevronRight, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const ChatWidget = () => {
    const { user } = useAuthStore();
    const { isChatOpen, setIsChatOpen } = useChatStore();
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const quickQuestions = [
        { id: 'q1', text: "How do I start a return?", answer: "To start a return, just head to your Returns & Exchanges portal in the menu! 📦" },
        { id: 'q2', text: "What is your return policy?", answer: "We offer a 30-day hassle-free return policy for all unworn items. 🛡️" },
        { id: 'q3', text: "How long does an exchange take?", answer: "Exchanges usually take 3-5 business days. We ship fast! 🔄" },
        { id: 'q4', text: "Can I track my order?", answer: "Yes! You can track your order status in the 'My Orders' section of your profile. 🛰️" }
    ];

    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setChatMessages([
                    { id: 1, text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I'm your ShopNest support assistant. How can I help you today?`, sender: 'bot' }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isChatOpen, chatMessages.length, user]);

    const handleQuickQuestion = (question) => {
        const newUserMessage = { id: Date.now(), text: question.text, sender: 'user' };
        setChatMessages(prev => [...prev, newUserMessage]);
        
        setIsTyping(true);
        setTimeout(() => {
            const botResponse = { id: Date.now() + 1, text: question.answer, sender: 'bot' };
            setChatMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1200);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const newUserMessage = { id: Date.now(), text: userInput, sender: 'user' };
        setChatMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        
        setIsTyping(true);
        setTimeout(() => {
            const botResponse = { 
                id: Date.now() + 1, 
                text: "I've received your inquiry! Our support team is currently reviewing your message and will respond shortly. 📦✨", 
                sender: 'bot' 
            };
            setChatMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isTyping]);

    return (
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
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">ShopNest Support</h4>
                                <div className="flex items-center space-x-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Online Agent</span>
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
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium ${
                                    msg.sender === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-white border border-gray-100 text-secondary shadow-sm rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}

                        {/* Quick Questions Chips */}
                        {!isTyping && chatMessages.length > 0 && (
                            <div className="pt-4 flex flex-wrap gap-2">
                                {quickQuestions.map((q) => (
                                    <button 
                                        key={q.id}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-secondary hover:border-primary hover:text-primary transition-all shadow-sm flex items-center space-x-2"
                                    >
                                        <span>{q.text}</span>
                                        <ChevronRight size={10} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={sendMessage} className="p-6 bg-white border-t border-gray-100 flex items-center space-x-4">
                        <input 
                            type="text" 
                            placeholder="Type your concern..." 
                            className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary/20"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="p-3 bg-primary text-white rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ChatWidget;
