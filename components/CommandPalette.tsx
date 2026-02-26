
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Newspaper, 
  Users, 
  Crown, 
  Layers, 
  Microscope, 
  PenTool, 
  Sparkles,
  Command,
  ArrowRight,
  Terminal,
  X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  category: 'Navigation' | 'Knowledge Base' | 'Actions';
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: 'home', title: 'Home', description: 'Return to mission control', icon: Terminal, action: () => navigate('/'), category: 'Navigation' },
    { id: 'forums', title: 'Community Forums', description: 'Discuss hair systems and protocols', icon: MessageSquare, action: () => navigate('/forum'), category: 'Navigation' },
    { id: 'news', title: 'Industry News', description: 'Latest supply chain and tech updates', icon: Newspaper, action: () => navigate('/news'), category: 'Navigation' },
    { id: 'kb-fund', title: 'KB: Fundamentals', description: 'Base construction and sizing 101', icon: Layers, action: () => navigate('/kb/foundations'), category: 'Knowledge Base' },
    { id: 'kb-mat', title: 'KB: Materials', description: 'Chemical engineering of fibers', icon: Microscope, action: () => navigate('/kb/base-fiber'), category: 'Knowledge Base' },
    { id: 'kb-maint', title: 'KB: Maintenance', description: 'Protocols for bond longevity', icon: PenTool, action: () => navigate('/kb/maintenance'), category: 'Knowledge Base' },
    { id: 'consults', title: 'Expert Consultations', description: 'Book a 1-on-1 analysis session', icon: Users, action: () => navigate('/consultations'), category: 'Navigation' },
    { id: 'membership', title: 'Upgrade Membership', description: 'Unlock Kinetic or Quantum tier', icon: Crown, action: () => navigate('/membership'), category: 'Actions' },
    { id: 'ai-truth', title: 'Ask Truth Engine', description: 'Initialize AI spectator mode', icon: Sparkles, action: () => { /* Triggered via AI Assistant toggle */ }, category: 'Actions' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase()) || 
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[activeIndex]) {
        filteredCommands[activeIndex].action();
        setIsOpen(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-start justify-center pt-[10vh] md:pt-[15vh] p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="w-full max-w-xl bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-dark-700 bg-dark-900/50">
          <Search className="w-5 h-5 text-slate-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search protocols, modules, and commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="w-full bg-transparent border-none outline-none text-white text-base font-medium placeholder-slate-600"
          />
          <div className="flex items-center gap-2 ml-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 -mr-2 text-slate-500 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="hidden md:inline-block px-1.5 py-0.5 rounded bg-dark-700 text-[10px] font-bold text-slate-400 border border-dark-600">ESC</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {filteredCommands.length > 0 ? (
            <div className="space-y-4">
              {['Navigation', 'Knowledge Base', 'Actions'].map(cat => {
                const catItems = filteredCommands.filter(c => c.category === cat);
                if (catItems.length === 0) return null;
                return (
                  <div key={cat} className="space-y-1">
                    <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cat}</p>
                    {catItems.map((cmd) => {
                      const overallIndex = filteredCommands.indexOf(cmd);
                      const isActive = activeIndex === overallIndex;
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setActiveIndex(overallIndex)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                            isActive ? 'bg-brand-blue text-white shadow-lg shadow-blue-500/10' : 'text-slate-300 hover:bg-dark-700 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-dark-900 border border-dark-700'}`}>
                              <cmd.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{cmd.title}</p>
                              <p className={`text-[11px] ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{cmd.description}</p>
                            </div>
                          </div>
                          {isActive && (
                            <div className="flex items-center gap-1.5 animate-in slide-in-from-right-1">
                                <span className="text-[10px] font-bold opacity-60">Go</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
              <p className="text-sm text-slate-500">No signals found matching <span className="text-brand-blue font-mono">"{query}"</span></p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-dark-700 bg-dark-900/30 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                <div className="flex items-center gap-1"><Command className="w-3 h-3" /> <span className="mx-1">+</span> K Search</div>
                <div className="flex items-center gap-1 hidden sm:flex">↑↓ Navigate</div>
                <div className="flex items-center gap-1">↵ Execute</div>
            </div>
            <div className="text-[10px] font-mono text-brand-blue opacity-50">v1.0.5-FINAL</div>
        </div>
      </div>
    </div>
  );
};
