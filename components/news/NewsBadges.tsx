// components/news/NewsBadges.tsx
import React from 'react';
import { AlertTriangle, TrendingUp, Microscope, Package, Building2, BookOpen } from 'lucide-react';

export const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Market Trends': { icon: TrendingUp,  color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  'Technology':    { icon: Microscope,  color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
  'Products':      { icon: Package,     color: 'text-emerald-400',  bg: 'bg-emerald-400/10 border-emerald-400/20' },
  'Industry':      { icon: Building2,   color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20' },
  'Research':      { icon: BookOpen,    color: 'text-cyan-400',     bg: 'bg-cyan-400/10 border-cyan-400/20' },
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const cfg = CATEGORY_CONFIG[category];
  if (!cfg) return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 border border-dark-600 text-slate-400">
      {category}
    </span>
  );
  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <cfg.icon className="w-3 h-3" /> {category}
    </span>
  );
};

export const MarketingWarning: React.FC = () => (
  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border text-orange-400 bg-orange-400/10 border-orange-400/20">
    <AlertTriangle className="w-3 h-3" /> Contains Promo
  </span>
);
