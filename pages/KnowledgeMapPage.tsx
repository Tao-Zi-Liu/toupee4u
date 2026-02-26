
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Search, X, Clock, Loader, BookOpen } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { searchKBArticles, KBSearchResult } from '../services/kb.service';

const tierColors: { [k: string]: string } = {
  NEBULA: 'text-slate-400 bg-dark-900 border-dark-700',
  NOVA: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  GALAXY: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  SUPERNOVA: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

export const KnowledgeMapPage: React.FC = () => {
  const { categories } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<KBSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // Fixed debounceRef type to ensure compatibility with window.clearTimeout
  // FIX: Added 'undefined' as initial value to resolve argument count error
  const debounceRef = useRef<number | undefined>(undefined);

  // 防抖搜索
  useEffect(() => {
    // Corrected clearTimeout usage by handling potentially undefined value
    // FIX: Explicitly passed debounceRef.current to window.clearTimeout
    if (debounceRef.current !== undefined) window.clearTimeout(debounceRef.current);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = window.setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
      const results = await searchKBArticles(searchTerm);
      setSearchResults(results);
      setSearching(false);
    }, 400);

    return () => { if (debounceRef.current !== undefined) window.clearTimeout(debounceRef.current); };
  }, [searchTerm]);

  const highlightText = (text: string, keyword: string) => {
    if (!keyword.trim()) return <>{text}</>;
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part)
            ? <mark key={i} className="bg-brand-blue/30 text-brand-blue rounded px-0.5 not-italic">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto py-8">
        <div className="inline-flex items-center justify-center p-3 bg-brand-blue/10 rounded-2xl text-brand-blue mb-6 border border-brand-blue/20">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          The Knowledge Architecture
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed mb-8">
          A structured curriculum designed to take you from novice to mastery of hair system physics.
        </p>

        {/* ── Search Bar ── */}
        <div className="relative max-w-xl mx-auto">
          <div className="relative">
            {searching
              ? <Loader className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue animate-spin" />
              : <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            }
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles, topics, techniques..."
              className="w-full bg-dark-800 border border-dark-700 hover:border-dark-500 focus:border-brand-blue rounded-2xl py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none transition-colors text-base shadow-xl"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* ── Search Results Dropdown ── */}
          {hasSearched && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto text-left">
              {searching ? (
                <div className="p-6 text-center text-slate-500 text-sm">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-slate-400 font-medium">No results for "{searchTerm}"</p>
                  <p className="text-slate-600 text-xs mt-1">Try different keywords</p>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </span>
                    <button onClick={() => setSearchTerm('')} className="text-slate-600 hover:text-slate-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.categoryId}-${result.topicId}-${result.articleId}`}
                      to={`/kb/${result.categoryId}/${result.topicId}/${result.articleId}`}
                      onClick={() => setSearchTerm('')}
                      className="block px-4 py-4 hover:bg-dark-700 transition-colors border-b border-dark-700/50 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">
                            {highlightText(result.articleTitle, searchTerm)}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5 mb-2">
                            {result.categoryName} → {result.topicTitle}
                          </p>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                            {highlightText(result.excerpt, searchTerm)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tierColors[result.tier] || tierColors.NEBULA}`}>
                              {result.tier}
                            </span>
                            <span className="text-slate-600 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {result.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Knowledge Map（搜索时隐藏）── */}
      {!searchTerm && (
        <>
          <div className="relative max-w-5xl mx-auto">
            {/* Central Spine Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-dark-700 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-24 relative">
              {categories.map((category, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={category.id} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 w-full">
                      <Link to={`/kb/${category.id}`} className="block group">
                        <div className="bg-dark-800 p-8 rounded-3xl border border-dark-700 hover:border-brand-blue transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <category.icon className="w-32 h-32" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
                                Phase {index + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {category.physicsTheme}
                              </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">
                              {category.name}
                            </h2>
                            <p className="text-slate-300 mb-6">{category.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm font-bold text-white gap-2">
                                Access Module <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </div>
                              <span className="text-xs text-slate-500">
                                {category.topics.length} topics · {category.topics.reduce((a, t) => a + (t.articles?.length || 0), 0)} articles
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="relative hidden md:flex items-center justify-center w-12 flex-shrink-0 z-10">
                      <div className="w-4 h-4 bg-brand-blue rounded-full ring-4 ring-dark-900 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl p-12 text-center border border-dark-700 relative overflow-hidden mt-12">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to engineer your look?</h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Start with Phase 1 to understand the fundamentals of cap construction, or jump to specific modules if you are troubleshooting an active system.
              </p>
              {categories.length > 0 && (
                <Link
                  to={`/kb/${categories[0].id}`}
                  className="inline-flex items-center px-8 py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25"
                >
                  Begin Sequence <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
