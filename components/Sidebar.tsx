
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Newspaper, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  Crown, 
  Users, 
  BookOpen, 
  Sparkles,
  Layers,
  Microscope,
  PenTool,
  Terminal,
  Search,
  BookA,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  highlightGovernance?: boolean;
}

const AI_QUOTES = [
  "Swiss lace denier is thinner than French, decreasing lifespan but maximizing refraction.",
  "Ghost Bond Platinum requires exactly 4 thin layers to reach optimal tensile strength.",
  "UV oxidation at 450nm wavelength is the primary cause of red undertones in #1B hair.",
  "Poly skin thickness of 0.03mm reaches 'zero-perceptibility' at a distance of 12 inches.",
  "Sulfate-free hydration is not a suggestion; it is a molecular requirement for non-living fiber."
];

const SECRET_ADMIN_URL = "/terminal/x92-quantum-override";

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isKbExpanded, setIsKbExpanded] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % AI_QUOTES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = () => {
    if (window.innerWidth < 1024 && isOpen) {
      toggle();
    }
  };

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
    handleItemClick();
  };

  const baseClasses = `fixed inset-y-0 left-0 z-50 bg-dark-900 text-slate-300 transform transition-all duration-300 ease-in-out border-r border-dark-700 flex flex-col`;
  const mobileClasses = `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`;
  const desktopClasses = `lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`;

  return (
    <aside className={`${baseClasses} ${mobileClasses} ${desktopClasses}`}>
      {/* Brand Header */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-dark-700 transition-all duration-300`}>
        <Link to="/" onClick={handleItemClick} className="flex items-center gap-2 font-bold text-xl tracking-tight text-white overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-brand-blue bg-brand-blue/10 border border-brand-blue/20">
            <Terminal className="w-5 h-5" />
          </div>
          <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Toupee4U
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 custom-scrollbar">
        
        {/* ACTIONS (Pinned) */}
        <div>
          {!isCollapsed && <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Actions</p>}
          <div className="space-y-2">
            <Link 
              to="/forum/new" 
              onClick={handleItemClick}
              className={`w-full bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 ${isCollapsed ? 'p-3' : 'py-3 px-4'}`}
            >
              <Plus className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>New Post</span>}
            </Link>

            <button 
              onClick={triggerSearch}
              className={`w-full bg-dark-800 border border-dark-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${isCollapsed ? 'p-3' : 'py-3 px-4'}`}
            >
              <Search className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                    <span>Search</span>
                    <span className="text-[10px] opacity-40 font-mono">⌘K</span>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <div className="p-3 bg-dark-800 rounded-xl border border-dark-700 relative overflow-hidden group animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-purple uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> AI Insight
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300 italic font-medium">
                  "{AI_QUOTES[quoteIndex]}"
                </p>
                <div className="absolute -right-2 -bottom-2 opacity-5">
                   <Sparkles className="w-12 h-12" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DISCOVER */}
          <div>
            {!isCollapsed && <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Discover</p>}
            <nav className="space-y-1">
              <NavItem to="/for-you" icon={Sparkles} label="For You" isCollapsed={isCollapsed} onClick={handleItemClick} />
              <NavItem to="/forum" icon={MessageSquare} label="Forums" isCollapsed={isCollapsed} onClick={handleItemClick} />
              <NavItem to="/news" icon={Newspaper} label="News" isCollapsed={isCollapsed} onClick={handleItemClick} />
            </nav>
          </div>

        {/* LEARN */}
        <div>
          {!isCollapsed && <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Learn</p>}
          <nav className="space-y-1">
            {/* Knowledge Base Collapsible */}
            <div>
              <button 
                onClick={() => {
                   if (isCollapsed) {
                     setIsCollapsed(false);
                     setIsKbExpanded(true);
                   } else {
                     setIsKbExpanded(!isKbExpanded);
                   }
                }}
                className={`group w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden whitespace-nowrap text-slate-300 hover:bg-dark-800 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
              >
                <BookOpen className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">Knowledge Base</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isKbExpanded ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {!isCollapsed && isKbExpanded && (
                <div className="ml-9 border-l border-dark-700 pl-2 space-y-1 mt-1 animate-in slide-in-from-top-1 duration-200">
                  <SubNavItem to="/kb/foundations" icon={Layers} label="Fundamentals" onClick={handleItemClick} />
                  <SubNavItem to="/kb/base-fiber" icon={Microscope} label="Materials" onClick={handleItemClick} />
                  <SubNavItem to="/kb/maintenance" icon={PenTool} label="Maintenance" onClick={handleItemClick} />
                  <SubNavItem to="/kb/glossary" icon={BookA} label="Technical Glossary" onClick={handleItemClick} />
                </div>
              )}
            </div>

            <NavItem to="/consultations" icon={Users} label="Expert Consultations" isCollapsed={isCollapsed} onClick={handleItemClick} />
          </nav>
        </div>

        {/* PREMIUM */}
        <div>
          {!isCollapsed && <p className="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Premium</p>}
          <nav className="space-y-1">
            <Link 
              to="/membership" 
              onClick={handleItemClick}
              className={`group flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 relative overflow-hidden whitespace-nowrap bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-purple/20 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Crown className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span>Upgrade to Nova</span>}
            </Link>
          </nav>
        </div>

        {/* SYSTEM (Hidden Terminal) */}
        <div className="pt-4 border-t border-dark-700/50">
          <Link 
            to={SECRET_ADMIN_URL} 
            onClick={handleItemClick}
            className={`group flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 relative overflow-hidden whitespace-nowrap bg-brand-emerald/5 text-brand-emerald border border-brand-emerald/20 hover:bg-brand-emerald/20 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Cpu className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? 'animate-pulse' : 'mr-3'}`} />
            {!isCollapsed && <span>System Terminal</span>}
          </Link>
        </div>

      </div>

      {/* Collapse Toggle (Desktop Only) */}
      <div className="hidden lg:flex p-4 border-t border-dark-700">
        <button 
          onClick={toggleCollapse}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-end'} p-2 rounded-lg text-slate-500 hover:bg-dark-800 hover:text-white transition-colors`}
        >
           {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ 
  to: string; 
  icon: React.ElementType; 
  label: string; 
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ to, icon: Icon, label, isCollapsed, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden whitespace-nowrap ${
        isActive 
          ? 'bg-dark-800 text-brand-blue' 
          : 'text-slate-300 hover:bg-dark-800 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`
    }
    title={isCollapsed ? label : ''}
  >
    <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isCollapsed ? '' : 'mr-3'}`} />
    <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 flex-1'}`}>
      {label}
    </span>
  </NavLink>
);

const SubNavItem: React.FC<{ to: string; icon: React.ElementType; label: string; onClick: () => void }> = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 group ${
        isActive 
          ? 'text-brand-blue bg-brand-blue/5' 
          : 'text-slate-500 hover:text-slate-300 hover:bg-dark-800/50'
      }`
    }
  >
    <Icon className="w-3.5 h-3.5 mr-2 opacity-70 group-hover:opacity-100" />
    {label}
  </NavLink>
);
