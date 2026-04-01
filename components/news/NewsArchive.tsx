// components/news/NewsArchive.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Archive, Loader, Newspaper } from 'lucide-react';
import { NewsArticle } from '../../types';
import { useArchiveDates, useArchiveArticles } from '../../hooks/useNewsArticles';
import { CategoryBadge, MarketingWarning } from './NewsBadges';

function formatArchiveDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

const ArchiveDayRow: React.FC<{
  date: string;
  onSelectArticle: (articles: NewsArticle[], index: number) => void;
}> = ({ date, onSelectArticle }) => {
  const [expanded, setExpanded] = useState(false);
  const { articles, loading } = useArchiveArticles(expanded ? date : null);

  return (
    <div className="border border-dark-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-5 py-3 bg-dark-800 hover:bg-dark-700/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">{formatArchiveDate(date)}</span>
          {!expanded && (
            <span className="text-[10px] text-slate-500">click to expand</span>
          )}
        </div>
        {expanded
          ? <ChevronDown className="w-4 h-4 text-slate-500" />
          : <ChevronRight className="w-4 h-4 text-slate-500" />
        }
      </button>

      {expanded && (
        <div className="border-t border-dark-700 divide-y divide-dark-700/50">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 text-brand-blue animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm">No articles for this day.</div>
          ) : articles.map((article, i) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(articles, i)}
              className="flex items-start gap-3 px-5 py-3 cursor-pointer hover:bg-dark-700/30 transition-all group"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge category={article.category} />
                  {!article.isClean && <MarketingWarning />}
                </div>
                <p className="text-sm font-bold text-white group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </p>
                <p className="text-xs text-slate-500">{article.sourceName}</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0 mt-1 text-slate-600 group-hover:text-brand-blue transition-all" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Props {
  onSelectArticle: (articles: NewsArticle[], index: number) => void;
}

export const NewsArchive: React.FC<Props> = ({ onSelectArticle }) => {
  const { dates, loading } = useArchiveDates();

  return (
    <div className="space-y-4 pt-4 border-t border-dark-700">
      <div className="flex items-center gap-2">
        <Archive className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Archive</h2>
        <span className="text-[10px] text-slate-600">— past 14 days</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader className="w-6 h-6 text-brand-blue animate-spin" />
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-10 text-slate-500 space-y-2">
          <Newspaper className="w-8 h-8 mx-auto opacity-30" />
          <p className="text-sm">No archived articles yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map(date => (
            <ArchiveDayRow
              key={date}
              date={date}
              onSelectArticle={onSelectArticle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
