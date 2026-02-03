
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  User, 
  Sparkles,
  X,
  Terminal,
  Zap
} from 'lucide-react';

const AI_QUOTES = [
  "Swiss lace denier is thinner than French, decreasing lifespan but maximizing refraction.",
  "Ghost Bond Platinum requires exactly 4 thin layers to reach optimal tensile strength.",
  "UV oxidation at 450nm wavelength is the primary cause of red undertones in #1B hair.",
  "Poly skin thickness of 0.03mm reaches 'zero-perceptibility' at a distance of 12 inches.",
  "Sulfate-free hydration is a molecular requirement for non-living fiber."
];

export const MobileBottomNav: React.FC = () => {
  const [showInsight, setShowInsight] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const triggerInsight = () => {
    setQuoteIndex(Math.floor(Math.random() * AI_QUOTES.length));
    setShowInsight(true);
  };

  return (
    <>
      {/* Insight Overlay */}
      {showInsight && (
        <div 
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 pb-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
          onClick={() => setShowInsight(false)}
        >
           <div 
             className="w-full max-w-sm bg-dark-800 border border-brand-purple/30 rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden cursor-default"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <Zap className="w-16 h-16 text-brand-purple" />
              </div>
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-brand-purple uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3" /> Truth Engine Insight
                 </div>
                 <button 
                   onClick={() => setShowInsight(false)} 
                   className="p-3 -mr-3 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-dark-700 active:scale-90"
                   aria-label="Close insight"
                 >
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <p className="text-sm text-slate-200 font-medium italic leading-relaxed pr-4">
                "{AI_QUOTES[quoteIndex]}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-brand-blue opacity-60">
                 <Terminal className="w-3 h-3" /> PROTOCOL_ALPHA_V4
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[110] bg-dark-900/90 backdrop-blur-xl border-t border-dark-700 pb-safe">
        <div className="flex items-center justify-between px-2 h-16 max-w-md mx-auto">
          <TabItem to="/" icon={Home} label="Home" />
          <TabItem to="/forum" icon={MessageSquare} label="Forums" />
          
          {/* AI Feature Trigger */}
          <div className="relative -mt-8 flex flex-col items-center">
             <button 
                onClick={triggerInsight}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 active:scale-90 transition-transform ring-4 ring-dark-900"
             >
                <Sparkles className="w-6 h-6 animate-pulse-fast" />
             </button>
             <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">AI Insight</span>
          </div>

          <TabItem to="/knowledge-map" icon={BookOpen} label="KB" />
          <TabItem to="/profile" icon={User} label="Profile" />
        </div>
      </nav>
    </>
  );
};

const TabItem: React.FC<{ to: string; icon: any; label: string }> = ({ to, icon: Icon, label }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative ${
          isActive ? 'text-brand-blue' : 'text-slate-500'
        }`
      }
    >
       {({ isActive }) => (
         <>
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
            {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-blue rounded-b-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            )}
         </>
       )}
    </NavLink>
  );
};
