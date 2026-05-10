import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, ChevronRight, MessageCircle, Sparkles, Bot, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import axios from 'axios';

const ChatWidget = () => {
    const { user, token } = useAuthStore();
    const { isChatOpen, setIsChatOpen } = useChatStore();
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const quickQuestions = [
        { id: 'q1', text: "How do I start a return?", prompt: "How do I start a return at ShopNest?" },
        { id: 'q2', text: "What is your return policy?", prompt: "What is the ShopNest return policy?" },
        { id: 'q3', text: "Can I track my order?", prompt: "How can I track my order status?" },
        { id: 'q4', text: "Show me trending items", prompt: "What are some trending items or featured products available right now?" }
    ];

    useEffect(() => {
        if (isChatOpen && chatMessages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setChatMessages([
                    { id: 1, text: `Hi ${user?.fullName?.split(' ')[0] || 'there'}! 👋 I am your ShopNest AI Assistant. How can I help you today?`, sender: 'bot' }
                ]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isChatOpen, chatMessages.length, user]);

    const getAIResponse = async (message) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/v1/ai/chat', 
                { message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data.data.response;
        } catch (error) {
            return "I apologize, but I am having trouble connecting to my creative circuits. Please try again or contact our support team at support@shopnest.com.";
        }
    };

    const handleQuickQuestion = async (question) => {
        const newUserMessage = { id: Date.now(), text: question.text, sender: 'user' };
        setChatMessages(prev => [...prev, newUserMessage]);
        
        setIsTyping(true);
        const response = await getAIResponse(question.prompt);
        // Add a small delay to make it feel like it's thinking
        await new Promise(resolve => setTimeout(resolve, 2000));
        setChatMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
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
        const response = await getAIResponse(messageText);
        // Add a small delay to make it feel like it's thinking
        await new Promise(resolve => setTimeout(resolve, 2000));
        setChatMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
        setIsTyping(false);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, isTyping]);

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
                                    <h4 className="font-bold text-sm tracking-tight">ShopNest AI</h4>
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
                                        <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm ${
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white text-secondary rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 text-primary shadow-sm flex items-center justify-center">
                                            <Bot size={14} />
                                        </div>
                                        <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                            <Loader2 size={14} className="animate-spin text-primary" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thinking</span>
                                        </div>
                                    </div>
                                </div>
                            )}

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
                            <p className="text-[9px] text-center text-gray-400 mt-4 font-bold uppercase tracking-[0.2em]">Powered by ShopNest Gemini AI 1.5</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
