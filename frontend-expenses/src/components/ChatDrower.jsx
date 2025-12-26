// src/components/ChatDrawer.jsx
import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { useFinancialData } from "../hooks/financialData";

export default function ChatDrawer() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const { income, expense, balance, saving, monthCategories } = useFinancialData();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Add welcome message when drawer opens for first time
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                role: "bot", 
                text: "👋 Hi! I'm MoneyMate, your personal finance assistant. How can I help you today?"
            }]);
        }
    }, [open, messages.length]);

    async function sendMessage(text) {
        if (!text.trim()) return;
        
        const userMsg = { role: "user", text };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // Using axios with automatic cookie handling
            const response = await api.post('/chat', { 
                message: text,
                context: {
                    income: income,
                    balance: balance,
                    expenses: expense,
                    savings: saving,
                    monthCategories: monthCategories
                }
            });

            const botMsg = { 
                role: "bot", 
                text: response.data.success ? response.data.answer : "Sorry, I couldn't process that request."
            };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error('Chat error:', error);
            
            let errorMessage = "⚠️ Something went wrong. Please try again.";
            
            // Handle different error types
            if (error.response?.status === 401) {
                errorMessage = "🔐 Please log in to use MoneyMate.";
            } else if (error.response?.status === 429) {
                errorMessage = "⏱️ Too many requests. Please wait a moment.";
            } else if (!navigator.onLine) {
                errorMessage = "📶 Check your internet connection.";
            }

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: errorMessage }
            ]);
        } finally {
            setLoading(false);
        }
    }

    function handleSend(e) {
        e.preventDefault();
        sendMessage(input);
    }

    const quickReplies = [
        "How can I budget better?",
        "Tips to save money",
        "Track my spending",
        "Investment advice",
        "Emergency fund tips"
    ];

    return (
        <>
            {/* Floating bubble */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-50 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-110"
            >
                💬
            </button>

            {/* Drawer */}
            {open && (
                <div className="fixed bottom-20 right-5 z-50 md:w-100 w-80 max-h-[80vh] flex flex-col bg-white border border-gray-200 rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span className="font-semibold">MoneyMate</span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg max-w-[85%] ${
                                        m.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 shadow-sm border rounded-bl-sm"
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        
                        {/* Loading indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm border">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick Replies */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {quickReplies.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => sendMessage(q)}
                                    disabled={loading}
                                    className="px-3 py-1.5 text-xs cursor-pointer bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask MoneyMate anything..."
                                disabled={loading}
                                className="flex-1 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "..." : "Send"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}