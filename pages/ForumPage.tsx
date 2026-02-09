import { getPosts, getRelativeTime, Post } from '../services/post.service';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Clock, Hash, MoreHorizontal } from 'lucide-react';
import { Filter, X, Flame, ArrowDownUp } from 'lucide-react';

const TOPICS = [
    {
        id: 1,
        title: "My experience switching from 0.03mm Poly to French Lace (Summer Review)",
        author: "Daniel Smith",
        role: "Verified Wearer",
        time: "15 min ago",
        replies: 12,
        likes: 45,
        tag: "Poly Skin",
        isHot: true
    },
    {
        id: 2,
        title: "Help! My front hairline is lifting after 3 days. What am I doing wrong?",
        author: "Kevin Taylor",
        role: "Pro Stylist",
        time: "2 hours ago",
        replies: 24,
        likes: 89,
        tag: "Troubleshooting",
        isHot: true
    },
    {
        id: 3,
        title: "Walker Tape vs. Ghost Bond Platinum: The ultimate humidity test",
        author: "Jason Brown",
        role: "Member",
        time: "4 hours ago",
        replies: 56,
        likes: 112,
        tag: "Adhesives",
        isHot: false
    },
    {
        id: 4,
        title: "Is it possible to swim daily with a Swiss Lace system?",
        author: "Michael Chen",
        role: "Newbie",
        time: "5 hours ago",
        replies: 8,
        likes: 15,
        tag: "Lifestyle",
        isHot: false
    }
];

export const ForumPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  
  // 真实帖子数据
  const [realPosts, setRealPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 加载真实帖子
  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      const posts = await getPosts(20);
      setRealPosts(posts);
      setLoading(false);
    }
    loadPosts();
  }, []);
  
  // 决定使用哪个数据源
  const displayTopics = realPosts.length > 0 ? realPosts : TOPICS;

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
            <p className="text-slate-300">Join the "Quantum State" collective. Real talk, no judgment.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border ${showFilters ? 'bg-brand-blue text-white border-brand-blue' : 'bg-dark-800 border-dark-700 text-slate-300 hover:border-slate-500 hover:text-white'}`}
             >
                {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                {showFilters ? 'Close Filters' : 'Filter'}
            </button>
            <Link 
                to="/forum/new"
                className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
            >
                Start Discussion
            </Link>
        </div>
      </div>

      {/* Filter Control Panel */}
      {showFilters && (
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 animate-in slide-in-from-top-4 duration-300 shadow-xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Signal Type (Tags) */}
              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Hash className="w-3 h-3" /> Signal Type
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                       <button
                          key={tag}
                          onClick={() => setActiveTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                             activeTag === tag
                                ? 'bg-brand-blue text-white border-brand-blue'
                                : 'bg-dark-900 text-slate-300 border-dark-600 hover:border-brand-blue/50 hover:text-white'
                          }`}
                       >
                          {tag}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Sort Frequency */}
              <div>
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ArrowDownUp className="w-3 h-3" /> Sort Frequency
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {sorts.map(sort => (
                       <button
                          key={sort}
                          onClick={() => setActiveSort(sort)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${
                             activeSort === sort
                                ? 'bg-brand-purple text-white border-brand-purple'
                                : 'bg-dark-900 text-slate-300 border-dark-600 hover:border-brand-purple/50 hover:text-white'
                          }`}
                       >
                          {sort === 'Hottest' && <Flame className="w-3 h-3" />}
                          {sort}
                       </button>
                    ))}
                 </div>
              </div>

           </div>
           
           {/* Active Filters Summary */}
           <div className="mt-6 pt-4 border-t border-dark-700 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                 Showing <span className="text-white font-bold">{filteredTopics.length}</span> active signals for <span className="text-brand-blue font-bold">{activeTag}</span>
              </div>
              <button 
                onClick={() => { setActiveTag('All'); setActiveSort('Newest'); }}
                className="text-xs text-slate-300 hover:text-white underline"
              >
                 Reset Parameters
              </button>
           </div>
        </div>
      )}

      {/* Discussion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-400">Loading discussions...</div>
          </div>
        ) : filteredTopics.map((topic: any) => (
            <div key={topic.id} className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-blue/50 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${topic.id % 2 === 0 ? 'bg-brand-purple' : 'bg-brand-blue'}`}>
                            {topic.authorName ? topic.authorName.split(' ').map((n: string) => n[0]).join('') : topic.author.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm group-hover:text-brand-blue transition-colors">
                                  {topic.authorName || topic.author}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${topic.role === 'Pro Stylist' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 'text-slate-300 bg-dark-900 border-dark-600'}`}>
                                    {topic.authorGalaxyLevel || topic.role || 'Member'}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {topic.createdAt ? getRelativeTime(topic.createdAt) : topic.time}
                            </span>
                        </div>
                    </div>
                    {topic.isHot && (
                         <span className="text-xs text-brand-purple bg-brand-purple/10 px-2 py-1 rounded border border-brand-purple/20 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Hot
                        </span>
                    )}
                </div>
                
                <div className="pl-13 md:pl-13">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-blue transition-colors">{topic.title}</h3>
                    {/* 显示摘要 - 新增 */}
                    {topic.excerpt && (
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {topic.excerpt}
                    </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            <span className="text-xs px-2.5 py-1 rounded bg-dark-900 text-slate-300 border border-dark-600 font-medium">
                                {topic.category || topic.tag}
                            </span>
                        </div>
                        <div className="flex gap-6 text-slate-500 text-sm">
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><ThumbsUp className="w-4 h-4" /> {topic.likes}</span>
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /> {topic.comments || topic.replies}</span>
                            <span className="hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></span>
                        </div>
                    </div>
                </div>
            </div>
        ))}

        {filteredTopics.length === 0 && !loading && (
           <div className="p-8 text-center text-slate-500 bg-dark-800 rounded-xl border border-dark-700 border-dashed">
              No frequencies found matching these parameters.
           </div>
        )}
      </div>
      
      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 bg-dark-800 border border-dark-700 text-slate-300 rounded-lg hover:text-white hover:border-slate-500 transition-colors text-sm">
            Load More Discussions
        </button>
      </div>
    </div>
  );
};
