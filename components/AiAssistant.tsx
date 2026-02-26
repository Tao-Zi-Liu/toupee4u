
import React, { useState, useRef, useEffect } from 'react';
import { askTheTruthEngine } from '../services/geminiService';
import { Sparkles, Send, X, Bot, User } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Greetings. I am the Truth Engine. Ask me anything about hair system physics, adhesives, or maintenance protocols.' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    const response = await askTheTruthEngine(userText);
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setLoading(false);
  };

  const renderMessages = () => {
    const rendered = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      rendered.push(
        <div
          key={i}
          className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
              msg.role === 'ai' ? 'bg-dark-700 border-dark-600 text-brand-blue' : 'bg-brand-blue border-brand-blue text-white'
            }`}
          >
            {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <div
            className={`p-3.5 rounded-2xl text-sm max-w-[80%] leading-relaxed shadow-sm ${
              msg.role === 'ai'
                ? 'bg-dark-700 border border-dark-600 text-slate-200 rounded-tl-none'
                : 'bg-brand-blue text-white rounded-tr-none'
            }`}
          >
            {msg.text}
          </div>
        </div>
      );
    }
    return rendered;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 p-4 rounded-2xl shadow-lg shadow-brand-blue/30 transition-all duration-300 z-50 group ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-brand-blue text-white hover:bg-blue-600'
        }`}
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      <div
        className={`fixed bottom-8 right-8 w-96 max-w-[calc(100vw-48px)] bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden flex flex-col transition-all duration-300 z-50 ${
          isOpen ? 'opacity-100 translate-y-0 h-[600px]' : 'opacity-0 translate-y-10 h-0 pointer-events-none'
        }`}
      >
        <div className="bg-dark-900 border-b border-dark-700 p-5 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="bg-brand-blue/10 p-2 rounded-lg backdrop-blur-sm border border-brand-blue/20">
                <Bot className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
                <h3 className="font-bold text-sm">The Truth Engine</h3>
                <p className="text-slate-300 text-xs">Powered by Physics</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white hover:bg-dark-700 p-1 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-dark-800">
          {renderMessages()}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 ml-12">
              <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-brand-blue rounded-full animate-bounce delay-150"></span>
              <span>Analyzing Physics...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-dark-700 bg-dark-900">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about bonding, hygiene..."
              className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-dark-700 bg-dark-800 focus:bg-dark-800 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all text-sm placeholder-slate-500 text-white"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-brand-blue hover:bg-blue-600 rounded-lg disabled:opacity-50 disabled:bg-dark-600 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
