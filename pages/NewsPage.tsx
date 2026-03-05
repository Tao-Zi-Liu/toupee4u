// pages/NewsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Newspaper, ExternalLink, ChevronRight, ShieldCheck,
  AlertTriangle, Calendar, Tag, Filter, Loader,
  BookOpen, TrendingUp, Microscope, Package, Building2, Search, Play, X
} from 'lucide-react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { getPublishedVideos } from '../services/video.service';
import { VideoPost, VIDEO_PLATFORM_CONFIG } from '../types';
import { db } from '../firebase.config';
import { NewsArticle, NewsCategory } from '../types';

// ── 常量 ─────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'Market Trends': { icon: TrendingUp,  color: 'text-brand-blue',   bg: 'bg-brand-blue/10 border-brand-blue/20' },
  'Technology':    { icon: Microscope,  color: 'text-brand-purple', bg: 'bg-brand-purple/10 border-brand-purple/20' },
  'Products':      { icon: Package,     color: 'text-emerald-400',  bg: 'bg-emerald-400/10 border-emerald-400/20' },
  'Industry':      { icon: Building2,   color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20' },
  'Research':      { icon: BookOpen,    color: 'text-cyan-400',     bg: 'bg-cyan-400/10 border-cyan-400/20' },
};

const ALL_CATEGORIES = ['All', 'Market Trends', 'Technology', 'Products', 'Industry', 'Research'];

// ── 主组件 ────────────────────────────────────
export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sideVideos, setSideVideos] = useState<VideoPost[]>([]);
  const [playingVideo, setPlayingVideo] = useState<VideoPost | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'PUBLISHED'),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsArticle)));
      } finally {
        setLoading(false);
      }
    };
    load();
    getPublishedVideos(6).then(setSideVideos);
  }, []);

  const filtered = articles.filter(a => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // 第一篇作为 featured
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setPlayingVideo(null)}>
          <div className="relative w-full max-w-3xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-white text-sm truncate flex-1 pr-4">{playingVideo.title}</p>
              <button onClick={() => setPlayingVideo(null)} className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden">
              <iframe src={playingVideo.embedUrl} className="w-full h-full" allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title={playingVideo.title} />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Newspaper className="w-4 h-4" />
          <span>Industry Intelligence</span>
        </div>
        <h1 className="text-3xl font-bold text-white">News & Briefings</h1>
        <p className="text-slate-400 max-w-xl">
          Curated industry news from global sources — editorially reviewed, marketing-filtered, and independently analysed.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-dark-800 border border-dark-700 focus:border-brand-blue rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 overflow-x-auto">
          {ALL_CATEGORIES.map(cat => {
            const cfg = CATEGORY_CONFIG[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-dark-700 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cfg && <cfg.icon className={`w-3 h-3 ${selectedCategory === cat ? cfg.color : ''}`} />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader className="w-8 h-8 text-brand-blue animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-32 text-slate-500 space-y-2">
          <Newspaper className="w-12 h-12 mx-auto opacity-30" />
          <p>No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Featured + List */}
          <div className="lg:col-span-2 space-y-4">

            {/* Featured Article */}
            {featured && (
              <div
                onClick={() => setSelectedArticle(featured)}
                className={`cursor-pointer group bg-dark-800 border rounded-2xl overflow-hidden transition-all hover:border-dark-500 ${
                  selectedArticle?.id === featured.id ? 'border-brand-blue' : 'border-dark-700'
                }`}
              >
                <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-purple to-emerald-500" />
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                      Featured
                    </span>
                    <CategoryBadge category={featured.category} />
                    {!featured.isClean && <MarketingWarning />}
                  </div>
                  <h2 className="text-xl font-bold text-white leading-snug group-hover:text-brand-blue transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{featured.summary}</p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-400">{featured.sourceName}</span>
                      {featured.sourceDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {featured.sourceDate}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-blue group-hover:gap-2 transition-all">
                      Read analysis <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Article List */}
            <div className="space-y-3">
              {rest.map(article => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isSelected={selectedArticle?.id === article.id}
                  onClick={() => setSelectedArticle(article)}
                />
              ))}
            </div>
          </div>

          {/* Right: Detail Panel + Videos */}
          <div className="lg:col-span-1 space-y-4">
            {selectedArticle ? (
              <ArticleDetail article={selectedArticle} onClose={() => setSelectedArticle(null)} />
            ) : (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-center space-y-3 sticky top-6">
                <Newspaper className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-500 text-sm">Select an article to read the full analysis</p>
              </div>
            )}

            {/* Video Sidebar */}
            {sideVideos.length > 0 && (
              <div className="sticky top-6 bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold text-white">Related Videos</span>
                  </div>
                  <a href="/videos" className="text-[10px] text-brand-blue hover:underline font-bold">See all →</a>
                </div>
                <div className="divide-y divide-dark-700">
                  {sideVideos.map(v => {
                    const pCfg = VIDEO_PLATFORM_CONFIG[v.platform];
                    return (
                      <div key={v.id} onClick={() => setPlayingVideo(v)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-dark-700/50 transition-all group">
                        <div className="w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-dark-700 relative">
                          {v.thumbnailUrl
                            ? <img src={v.thumbnailUrl} alt={v.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-600"><Play className="w-5 h-5" /></div>
                          }
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                            <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded border ${pCfg.bg} ${pCfg.color} mb-1 inline-block`}>
                            {pCfg.label}
                          </span>
                          <p className="text-xs font-bold text-slate-300 line-clamp-2 leading-snug group-hover:text-white transition-colors">{v.title}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

// ── 文章卡片 ──────────────────────────────────
const ArticleCard: React.FC<{
  article: NewsArticle;
  isSelected: boolean;
  onClick: () => void;
}> = ({ article, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer group p-4 rounded-2xl border transition-all ${
      isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-dark-700 bg-dark-800 hover:border-dark-500'
    }`}
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
          {article.sourceDate && <span>{article.sourceDate}</span>}
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-all ${isSelected ? 'text-brand-blue' : 'text-slate-600 group-hover:text-slate-400'}`} />
    </div>
  </div>
);

// ── 文章详情 ──────────────────────────────────
const ArticleDetail: React.FC<{ article: NewsArticle; onClose: () => void }> = ({ article, onClose }) => (
  <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden sticky top-6">
    <div className="h-1 bg-gradient-to-r from-brand-blue to-brand-purple" />

    <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
      {/* Close + Category */}
      <div className="flex items-center justify-between">
        <CategoryBadge category={article.category} />
        <button onClick={onClose} className="text-slate-600 hover:text-slate-400 text-sm">✕</button>
      </div>

      {/* Title */}
      <h2 className="font-bold text-white text-base leading-snug">{article.title}</h2>

      {/* Summary */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Summary</p>
        <p className="text-sm text-slate-300 leading-relaxed">{article.summary}</p>
      </div>

      {/* Editorial Analysis */}
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

      {/* Marketing Warning */}
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

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-dark-700 border border-dark-600 rounded-full text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Source */}
      <div className="border-t border-dark-700 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">{article.sourceName}</p>
            {article.sourceDate && (
              <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> {article.sourceDate}
              </p>
            )}
          </div>
          {article.urlVerified && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-dark-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Read Original Article
        </a>
      </div>
    </div>
  </div>
);

// ── 小组件 ────────────────────────────────────
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const cfg = CATEGORY_CONFIG[category];
  if (!cfg) return <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-700 border border-dark-600 text-slate-400">{category}</span>;
  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
      <cfg.icon className="w-3 h-3" /> {category}
    </span>
  );
};

const MarketingWarning: React.FC = () => (
  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border text-orange-400 bg-orange-400/10 border-orange-400/20">
    <AlertTriangle className="w-3 h-3" /> Contains Promo
  </span>
);
