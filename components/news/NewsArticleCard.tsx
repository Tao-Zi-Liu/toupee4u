// components/news/NewsArticleCard.tsx
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

export const NewsArticleCard: React.FC<{
  article: NewsArticle;
  onClick: () => void;
}> = ({ article, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer group p-4 rounded-2xl border border-dark-700 bg-dark-800 hover:border-brand-blue/40 hover:bg-dark-700/50 transition-all"
  >
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={article.category} />
          {!article.isClean && <MarketingWarning />}
        </div>
        <h3 className="font-bold text-white text-sm leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold">{article.sourceName}</span>
          <span className="font-mono text-xs">{article.createdAt ? formatNewsDate(article.createdAt) : ''}</span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 text-slate-600 group-hover:text-brand-blue transition-all" />
    </div>
  </div>
);
