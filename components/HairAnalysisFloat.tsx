import React, { useState } from 'react';
import { Scan, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HairAnalysisFloat: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/hair-analysis');
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-2 lg:bottom-10">
      {/* 展开的提示卡片 */}
      {expanded && (
        <div className="bg-dark-800 border border-brand-blue/30 rounded-2xl p-4 shadow-2xl w-52 animate-in slide-in-from-bottom-2 duration-200">
          <p className="text-white font-bold text-sm mb-1">Hair Scanner</p>
          <p className="text-slate-400 text-xs mb-3 leading-relaxed">
            AI-powered analysis of hair color, loss pattern & scalp health.
          </p>
          <button
            onClick={handleClick}
            className="w-full py-2 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            Start Analysis <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 悬浮球 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple shadow-lg shadow-brand-blue/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform relative"
      >
        {expanded
          ? <X className="w-5 h-5 text-white" />
          : <Scan className="w-6 h-6 text-white" />
        }
        {/* 脉冲动画 */}
        {!expanded && (
          <span className="absolute inset-0 rounded-full bg-brand-blue/40 animate-ping pointer-events-none" />
        )}
      </button>
    </div>
  );
};
