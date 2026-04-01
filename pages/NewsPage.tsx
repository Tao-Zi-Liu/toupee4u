// pages/NewsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, Search, Play, X, Loader } from 'lucide-react';
import { getPublishedVideos } from '../services/video.service';
import { VideoPost, VIDEO_PLATFORM_CONFIG } from '../types';
import { NewsArticle } from '../types';
import { useTodayArticles } from '../hooks/useNewsArticles';
import { NewsArticleModal } from '../components/news/NewsArticleModal';
import { NewsFeaturedCard } from '../components/news/NewsFeaturedCard';
import { NewsArticleCard } from '../components/news/NewsArticleCard';
import { NewsArchive } from '../components/news/NewsArchive';
import { CATEGORY_CONFIG } from '../components/news/NewsBadges';

const ALL_CATEGORIES = ['All', 'Market Trends', 'Technology', 'Products', 'Industry', 'Research'];

export const NewsPage: React.FC = () => {
  const { articles, loading } = useTodayArticles();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sideVideos, setSideVideos] = useState<VideoPost[]>([]);
  const [playingVideo, setPlayingVideo] = useState<VideoPost | null>(null);

  const [modalArticles, setModalArticles] = useState<NewsArticle[]>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  useEffect(() => {
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

  const featuredArticle = filtered.find(a => a.isFeatured) || null;
  const featured = featuredArticle || filtered[0] || null;
  const isTrulyFeatured = !!featuredArticle;
  const rest = filtered.filter(a => a.id !== featured?.id);

  const openModal = useCallback((articleList: NewsArticle[], index: number) => {
    setModalArticles(articleList);
    setModalIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setModalIndex(null);
    setModalArticles([]);
  }, []);

  const handlePrev = useCallback(() => {
    if (modalIndex !== null && modalIndex > 0) setModalIndex(modalIndex - 1);
  }, [modalIndex]);

  const handleNext = useCallback(() => {
    if (modalIndex !== null && modalIndex < modalArticles.length - 1) setModalIndex(modalIndex + 1);
  }, [modalIndex, modalArticles.length]);

  useEffect(() => {
    if (modalIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalIndex, handlePrev, handleNext, closeModal]);

  const selectedArticle = modalIndex !== null ? modalArticles[modalIndex] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {selectedArticle && modalIndex !== null && (
        <NewsArticleModal
          article={selectedArticle}
          currentIndex={modalIndex}
          total={modalArticles.length}
          onClose={closeModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

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
            placeholder="Search today's articles..."
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
                  selectedCategory === cat ? 'bg-dark-700 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {cfg && <cfg.icon className={`w-3 h-3 ${selectedCategory === cat ? cfg.color : ''}`} />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today label */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Today</span>
        <span className="text-xs text-slate-500 font-mono">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <div className="flex-1 h-px bg-dark-700" />
      </div>

      {/* Today's Articles */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader className="w-8 h-8 text-brand-blue animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500 space-y-3">
          <Newspaper className="w-12 h-12 mx-auto opacity-30" />
          <p className="text-sm">Today's briefing hasn't been generated yet.</p>
          <p className="text-xs text-slate-600">Check back soon or browse the archive below.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* 左栏：Featured */}
          <div className="lg:col-span-1 lg:self-start">
            {featured ? (
              <NewsFeaturedCard
                article={featured}
                isFeatured={isTrulyFeatured}
                onClick={() => openModal(filtered, filtered.indexOf(featured))}
              />
            ) : (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
                <p className="text-slate-600 text-sm text-center">No featured article today</p>
              </div>
            )}
          </div>

          {/* 中栏：奇数文章 */}
          <div className="lg:col-span-1 space-y-3">
            {rest.filter((_, i) => i % 2 === 0).map((article) => (
              <NewsArticleCard
                key={article.id}
                article={article}
                onClick={() => openModal(filtered, filtered.indexOf(article))}
              />
            ))}
          </div>

          {/* 右栏：偶数文章 + 视频侧边栏 */}
          <div className="lg:col-span-1 space-y-3">
            {rest.filter((_, i) => i % 2 === 1).map((article) => (
              <NewsArticleCard
                key={article.id}
                article={article}
                onClick={() => openModal(filtered, filtered.indexOf(article))}
              />
            ))}

            {sideVideos.length > 0 && (
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
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

      {/* Archive Section */}
      <NewsArchive onSelectArticle={openModal} />

    </div>
  );
};
