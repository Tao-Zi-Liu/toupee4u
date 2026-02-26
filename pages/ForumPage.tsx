
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  Hash, 
  MoreHorizontal, 
  Eye, 
  Search, 
  Filter, 
  X, 
  Flame, 
  ArrowDownUp, 
  UserPlus,
  // Added RefreshCw to fix line 265 error
  RefreshCw 
} from 'lucide-react';
import { searchPosts, SearchFilters, saveSearchHistory } from '../services/search.service';
import { getPosts, getRelativeTime, Post, checkUserLiked } from '../services/post.service';
import { getCurrentUser } from '../services/auth.service';
import { checkIsFollowing, followUser, unfollowUser } from '../services/follow.service';

export const ForumPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  
  // 真实帖子数据
  const [realPosts, setRealPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'mostComments'>('newest');
  const [isSearching, setIsSearching] = useState(false);

  // 高亮关键词函数
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === keyword.toLowerCase() 
        ? `<mark class="bg-brand-blue/30 text-brand-blue font-semibold px-1 rounded">${part}</mark>`
        : part
    ).join('');
  };

  const loadPosts = async () => {
    setLoading(true);
    const posts = await getPosts(20);
    setRealPosts(posts);
    
    const currentUser = getCurrentUser();
    if (currentUser && posts.length > 0) {
      const likes = new Set<string>();
      for (const post of posts) {
        const liked = await checkUserLiked(post.id, currentUser.uid);
        if (liked) {
          likes.add(post.id);
        }
      }
      setUserLikes(likes);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSearch = async () => {
    if (!searchKeyword.trim() && selectedCategory === 'all') {
      loadPosts();
      return;
    }
    
    setIsSearching(true);
    
    const filters: SearchFilters = {
      keyword: searchKeyword.trim(),
      category: selectedCategory,
      sortBy
    };
    
    const results = await searchPosts(filters);
    setRealPosts(results as Post[]);
    
    if (searchKeyword.trim()) {
      saveSearchHistory(searchKeyword.trim());
    }
    
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSelectedCategory('all');
    setSortBy('newest');
    loadPosts();
  }; 
        
  const displayTopics = realPosts;
  const tags = ['All', 'Troubleshooting', 'Poly Skin', 'Adhesives', 'Lifestyle', 'Review'];
  const sorts = ['Newest', 'Hottest', 'Most Replied'];

  const filteredTopics = activeTag === 'All' 
    ? displayTopics 
    : displayTopics.filter(t => (t as any).category === activeTag || (t as any).tag === activeTag);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-dark-700 pb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
            <p className="text-slate-300">The community for hair system enthusiasts. Real talk, real solutions.</p>
        </div>
        
          <div className="relative w-full md:w-auto md:min-w-[400px]">
            <div className="bg-dark-800 border border-dark-700 rounded-xl p-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-10 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-slate-500 focus:border-brand-blue focus:outline-none"
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => setSearchKeyword('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSearching ? '...' : 'Search'}
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-dark-900 border border-dark-600 hover:border-brand-blue text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {showFilters && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-slate-500 mb-2 block font-bold uppercase tracking-widest">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white focus:border-brand-blue focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="Troubleshooting">Troubleshooting</option>
                      <option value="Review">Review</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Science">Science</option>
                      <option value="Adhesives">Adhesives</option>
                      <option value="Newbie Help">Newbie Help</option>
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-slate-500 mb-2 block font-bold uppercase tracking-widest">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white focus:border-brand-blue focus:outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="mostComments">Most Comments</option>
                    </select>
                  </div>
                  
                  <div className="w-full flex justify-between items-center pt-4 border-t border-dark-700 mt-4">
                      <button
                        onClick={clearSearch}
                        className="px-4 py-2 text-slate-400 hover:text-white text-sm"
                      >
                        Reset All
                      </button>
                    <button
                      onClick={() => {
                        handleSearch();
                        setShowFilters(false);
                      }}
                      className="px-6 py-2 bg-brand-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        <div className="flex gap-3">
            <Link 
                to="/forum/new"
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-bold shadow-lg shadow-blue-500/20"
            >
                <MessageSquare className="w-4 h-4" /> Start Discussion
            </Link>
        </div>
      </div>

      {/* Popular Tags */}
      {(() => {
        const tagCounts: { [key: string]: number } = {};
        displayTopics.forEach((topic: any) => {
          if (topic.tags && Array.isArray(topic.tags)) {
            topic.tags.forEach((tag: string) => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });
        const sortedTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10);
        
        if (sortedTags.length === 0) return null;
        
        return (
          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
              <Hash className="w-3 h-3 text-brand-blue" /> Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortedTags.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setSearchKeyword(tag)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-dark-900 hover:bg-blue-400/10 text-slate-400 hover:text-blue-400 border border-dark-600 hover:border-blue-400/30 rounded-full text-xs transition-colors"
                >
                  #{tag}
                  <span className="text-slate-600 text-[10px]">{count}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Discussion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <RefreshCw className="w-10 h-10 text-brand-blue animate-spin" />
            <div className="text-slate-400 font-mono text-xs uppercase tracking-widest">Synchronizing community signals...</div>
          </div>
        ) : filteredTopics.map((topic: any) => (
            <Link 
                key={topic.id}
                to={`/forum/post/${topic.id}`} 
                className="block bg-dark-800 rounded-2xl p-5 border border-dark-700 hover:border-brand-blue/50 transition cursor-pointer group shadow-lg shadow-black/5">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold ${topic.id.charCodeAt(0) % 2 === 0 ? 'bg-brand-purple shadow-lg shadow-purple-500/10' : 'bg-brand-blue shadow-lg shadow-blue-500/10'}`}>
                            {topic.authorName ? topic.authorName.split(' ').map((n: string) => n[0]).join('') : '?'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-sm group-hover:text-brand-blue transition-colors">
                                  {topic.authorName || 'Anonymous'}
                                </span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${topic.authorGalaxyLevel === 'SUPERNOVA' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-slate-400 bg-dark-900 border-dark-600'}`}>
                                    {topic.authorGalaxyLevel || 'MEMBER'}
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {topic.createdAt ? getRelativeTime(topic.createdAt) : 'Recently'}
                            </span>
                        </div>
                    </div>
                    {topic.likes > 20 && (
                         <span className="text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2 py-1 rounded border border-brand-purple/20 flex items-center gap-1.5 uppercase tracking-widest">
                            <Flame className="w-3 h-3" /> Trending
                        </span>
                    )}
                </div>
                
                <div className="pl-0 md:pl-13">
                    <h3 
                      className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors tracking-tight"
                      dangerouslySetInnerHTML={{ 
                        __html: searchKeyword ? highlightKeyword(topic.title, searchKeyword) : topic.title 
                      }}
                    />
                    {topic.excerpt && (
                        <p 
                          className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: searchKeyword ? highlightKeyword(topic.excerpt, searchKeyword) : topic.excerpt 
                          }}
                        />
                      )}
                    <div className="flex items-center justify-between mt-6 border-t border-dark-700/50 pt-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-dark-900 text-slate-400 border border-dark-600 uppercase tracking-widest">
                                {topic.category}
                            </span>
                            {topic.tags && topic.tags.slice(0, 3).map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-brand-blue/5 text-brand-blue/60 border border-brand-blue/10 uppercase tracking-widest"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-4 text-slate-500 text-xs font-bold">
                            <span className={`flex items-center gap-1.5 transition-colors ${
                              userLikes.has(topic.id) ? 'text-red-500' : 'text-slate-500 hover:text-white'
                            }`}>
                              <ThumbsUp className={`w-3.5 h-3.5 ${userLikes.has(topic.id) ? 'fill-current' : ''}`} /> 
                              {topic.likes}
                            </span>
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageSquare className="w-3.5 h-3.5" /> {topic.comments}</span>
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /> {topic.views || 0}</span>
                        </div>
                    </div>
                </div>
            </Link>
        ))}

        {filteredTopics.length === 0 && !loading && (
            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-16 text-center shadow-xl">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-dark-900 rounded-3xl border border-dark-700 flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Zero Signals Detected</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  {searchKeyword 
                    ? `Our Truth Engine returned no matches for frequency "${searchKeyword}" in the community database.`
                    : "No discussions match your active filters. Try broadening your parameters."}
                </p>
                {(searchKeyword || selectedCategory !== 'all') && (
                  <button
                    onClick={clearSearch}
                    className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
      </div>
      
      <div className="flex justify-center pt-8">
        <button 
          onClick={loadPosts}
          className="px-8 py-3 bg-dark-800 border border-dark-700 text-slate-300 font-bold rounded-xl hover:text-white hover:border-slate-500 hover:bg-dark-700 transition-all text-xs uppercase tracking-widest"
        >
            Load Older Signals
        </button>
      </div>
    </div>
  );
};
