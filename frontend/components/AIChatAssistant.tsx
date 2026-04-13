
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiAssistantResponse } from '../services/geminiService';
import { Bot, Send, X, MessageSquare, Sparkles, ChevronRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const AIChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Greetings, researcher. I am the Campus Collab Oracle. How can I assist with your innovation journey today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Grant availability",
    "Find FYP partners",
    "Lab schedules",
    "Skill evaluation"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setIsLoading(true);

    const botResponse = await getGeminiAssistantResponse(userMsg);
    
    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-crimson text-white rounded-[28px] shadow-[0_20px_50px_rgba(146,39,36,0.4)] flex items-center justify-center relative group"
          >
            <Bot size={28} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className="bg-white dark:bg-midnight w-[400px] sm:w-[450px] h-[650px] rounded-[40px] shadow-[0_40px_120px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-crimson/10"
          >
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-crimson/30 rounded-full blur-3xl"></div>
              <div className="flex items-center space-x-5 relative z-10">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-[24px] flex items-center justify-center border border-white/10 shadow-inner">
                  <Sparkles className="text-crimson" size={28} />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-[0.3em]">Research Oracle</h3>
                  <div className="flex items-center text-[10px] text-emerald-400 font-bold mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                    Matrix Active
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-white/10 hover:bg-crimson p-3 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 bg-slate-50/30 dark:bg-white/[0.02] no-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[24px] text-sm font-bold leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                    ? 'bg-crimson text-white rounded-br-none' 
                    : 'bg-white dark:bg-white/5 text-slate-700 dark:text-white border border-slate-100 dark:border-white/10 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-white/5 p-5 rounded-[24px] rounded-bl-none shadow-sm border border-slate-100 dark:border-white/10">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-crimson rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-crimson rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-crimson rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Matrix Prompts */}
            <div className="px-8 py-5 bg-white dark:bg-midnight border-t border-slate-100 dark:border-white/10 flex overflow-x-auto gap-3 no-scrollbar">
              {quickPrompts.map(prompt => (
                <button 
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-crimson hover:border-crimson transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Matrix Input */}
            <div className="p-8 bg-white dark:bg-midnight border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl px-6 py-3 group focus-within:border-crimson transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Transmit query..."
                  className="flex-grow bg-transparent py-2.5 text-sm font-black outline-none text-slate-700 dark:text-white placeholder:text-slate-400 placeholder:font-bold"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="text-slate-400 group-focus-within:text-crimson disabled:text-slate-300 transition-all p-2.5 bg-white dark:bg-white/10 rounded-2xl shadow-sm hover:scale-110 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant;
