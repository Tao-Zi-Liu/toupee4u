// components/news/NewsArticleModal.tsx
import React from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';
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

interface Props {
  article: NewsArticle;
  currentIndex: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const NewsArticleModal: React.FC<Props> = ({
  article, currentIndex, total, onClose, onPrev, onNext
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-2xl max-h-[90vh] bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      <div className="h-1 bg-gradient-to-r from-brand-blue to-brand-purple flex-shrink-0" />

      <div className="flex items-center justify-between px-5 py-3 border-b border-dark-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CategoryBadge category={article.category} />
          {!article.isClean && <MarketingWarning />}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-dark-700 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-5 space-y-4">
        <h2 className="font-bold text-white text-lg leading-snug">{article.title}</h2>

        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Summary</p>
          <p className="text-sm text-slate-300 leading-relaxed">{article.summary}</p>
        </div>

        {article.editorialNote && (article.editorialNote.standpoint || article.editorialNote.significance) && (
          <div className="bg-brand-purple/5 border border-brand-purple/15 rounded-xl p-3 space-y-3">
            <p className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Editorial Analysis</p>
            {article.editorialNote.standpoint && (
              <div>
                <p className="text-[10px] text-slate-500 mb-1">Source Perspective</p>
                <p className="text-xs text-slate-300 leading-relaxed">{article.editorialNote.standpoint}</p>
              </div>
            )}
            {article.editorialNote.significance && (
              <div>
                <p className="text-[10px] text-slate-500 mb-1">Why It Matters</p>
                <p className="text-xs text-slate-300 leading-relaxed">{article.editorialNote.significance}</p>
              </div>
            )}
            {article.editorialNote.caution && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-2">
                <p className="text-[10px] text-amber-400 font-bold mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Note of Caution
                </p>
                <p className="text-xs text-amber-300/80 leading-relaxed">{article.editorialNote.caution}</p>
              </div>
            )}
          </div>
        )}

        {!article.isClean && article.marketingFlags?.length > 0 && (
          <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Content Advisory
            </p>
            {article.marketingFlags.map((flag, i) => (
              <p key={i} className="text-xs text-orange-300/80">{flag.reason}</p>
            ))}
          </div>
        )}

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-dark-700 border border-dark-600 rounded-full text-slate-500">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-dark-700 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">{article.sourceName}</p>
              {article.createdAt && (
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  <span className="font-mono">{formatNewsDate(article.createdAt)}</span>
                </p>
              )}
            </div>
            {article.urlVerified && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Read Original Article
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-dark-700 flex-shrink-0 bg-dark-900/50">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <span className="text-[10px] text-slate-500 font-mono">
          {currentIndex + 1} / {total}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);
