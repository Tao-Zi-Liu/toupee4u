
import React, { useState } from 'react';
import { INDUSTRY_NEWS } from '../constants';
import { Newspaper, Search, Globe, ArrowUpRight } from 'lucide-react';

export const IndustryNewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  /* FIX: Explicitly type categories as string array to resolve unknown type errors */
  const categories: string[] = ['All', ...Array.from(new Set(INDUSTRY_NEWS.map(n => n.category)))];

  const filteredNews = INDUSTRY_NEWS.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          news.snippet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || news.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-700 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                < Newspaper className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Market Intelligence</h4>
           </div>
           <h1 className="text-4xl font-bold text-white mb-2">Industry News</h1>
           <p className="text-slate-300 max-w-2xl">
             Stay updated with the latest supply chain shifts, product launches, and dermatological breakthroughs in the hair replacement sector.
           </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                  type="text" 
                  placeholder="Search headlines..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
              />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              /* FIX: Explicitly type cat as string to resolve Key and ReactNode unknown errors */
              {categories.map((cat: string) => (
                  <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border ${
                          filter === cat 
                          ? 'bg-brand-blue text-white border-brand-blue' 
                          : 'bg-dark-800 text-slate-300 border border-dark-700 hover:border-slate-500 hover:text-white'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
      </div>

      {/* News Grid - Single Column */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNews.map((news) => (
            <a 
                href={news.link} 
                key={news.id} 
                className="group bg-dark-800 rounded-2xl p-6 border border-dark-700 hover:border-brand-blue transition-all hover:bg-dark-700/50 flex flex-col h-full"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-dark-600 px-2 py-1 rounded bg-dark-900">
                            {news.source}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue border border-brand-blue/20 px-2 py-1 rounded bg-brand-blue/10">
                            {news.category}
                        </span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-600 group-hover:text-brand-blue transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                    {news.title}
                </h3>
                
                <p className="text-sm text-slate-300 line-clamp-3 mb-6 flex-1">
                    {news.snippet}
                </p>
                
                <div className="mt-auto pt-4 border-t border-dark-700/50 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                         <Globe className="w-3 h-3" />
                         {news.date}
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">Read Full Story &rarr;</span>
                </div>
            </a>
        ))}

        {filteredNews.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-dark-800/50 rounded-2xl border border-dark-700 border-dashed">
                No updates found matching your criteria.
            </div>
        )}
      </div>
    </div>
  );
};
