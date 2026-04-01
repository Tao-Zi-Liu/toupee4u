// components/news/NewsFeaturedCard.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { NewsArticle } from '../../types';
import { CategoryBadge, MarketingWarning } from './NewsBadges';

function formatNewsDate(val: any): string {
  if (!val) return '';
  let d: Date;
  if (val?.toDate) d = val.toDate();
  else if (typeof val === 'string') d = new Date(val);
  else if (val instanceof Date) d = val;
  else return String(val);
  if (isNaN(d.getTime())) return String(val);
  const date = d.toISOString().split('T')[0];
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${date} ${hh}:${mm}:${ss} UTC`;
}

export const NewsFeaturedCard: React.FC<{
  article: NewsArticle;
  isFeatured: boolean;
  onClick: () => void;
}> = ({ article, isFeatured, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden transition-all hover:border-brand-blue/50 flex flex-col"
  >
    <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-purple to-emerald-500" />
    <div className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
        {isFeatured ? 'Featured' : 'Top Story'}
      </span>
        <CategoryBadge category={article.category} />
        {!article.isClean && <MarketingWarning />}
      </div>
      <h2 className="text-base font-bold text-white leading-snug group-hover:text-brand-blue transition-colors">
        {article.title}
      </h2>
      <p className="text-slate-400 text-xs leading-relaxed line-clamp-4">{article.summary}</p>
      <div className="space-y-0.5">
        <p className="text-xs font-semibold text-slate-400">{article.sourceName}</p>
        {article.createdAt && (
          <p className="text-[10px] text-slate-500 font-mono">{formatNewsDate(article.createdAt)}</p>
        )}
      </div>
      <span className="flex items-center gap-1 text-xs font-bold text-brand-blue group-hover:gap-2 transition-all">
        Read analysis <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </div>
  </div>
);
