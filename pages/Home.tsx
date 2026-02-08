import React from 'react';
import { TrendingUp, MessageSquare, Eye, ThumbsUp, Clock, Shield } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  author: string;
  authorTier: string;
  timestamp: string;
  replies: number;
  views: number;
  likes: number;
  category: string;
  excerpt: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Best adhesive for swimming? Walker Tape vs Ghost Bond comparison',
    author: 'SwimmerJake',
    authorTier: 'Galaxy',
    timestamp: '2 hours ago',
    replies: 23,
    views: 456,
    likes: 18,
    category: 'Adhesives',
    excerpt: 'I\'ve been testing both for 3 months in chlorinated pools...'
  },
  {
    id: '2',
    title: 'My 6-month transformation journey - Before/After with timeline',
    author: 'NewConfidence_2024',
    authorTier: 'Nova',
    timestamp: '5 hours ago',
    replies: 67,
    views: 1203,
    likes: 94,
    category: 'Success Stories',
    excerpt: 'Never thought I\'d have the courage to share this, but here goes...'
  },
  {
    id: '3',
    title: '[GUIDE] How to cut in your own hairline like a pro',
    author: 'StudioPro_Mike',
    authorTier: 'Supernova',
    timestamp: '1 day ago',
    replies: 45,
    views: 892,
    likes: 72,
    category: 'Tutorials',
    excerpt: 'After 10 years of cutting systems, here are my insider tips...'
  }
];

export const Home: React.FC = () => {
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Supernova': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'Galaxy': return 'bg-brand-purple/20 text-brand-purple border-brand-purple/30';
      case 'Nova': return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-brand-blue" />
              Community Feed
            </h2>
            <select className="bg-dark-800 border border-dark-700 text-slate-300 px-4 py-2 rounded-lg text-sm">
              <option>Hot</option>
              <option>New</option>
              <option>Top</option>
            </select>
          </div>

          {MOCK_POSTS.map((post) => (
            <div 
              key={post.id}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-brand-blue/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold">
                    {post.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{post.author}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getTierBadge(post.authorTier)}`}>
                        {post.authorTier}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.timestamp}</span>
                      <span>•</span>
                      <span className="text-brand-blue">{post.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                {post.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.replies}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Community Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Active Users</span>
                  <span className="text-white font-bold">1,247</span>
                </div>
                <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-blue w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Posts Today</span>
                  <span className="text-white font-bold">89</span>
                </div>
                <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-purple w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['adhesives', 'newbie', 'maintenance', 'styling', 'troubleshooting'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-dark-900 text-slate-300 rounded-lg text-sm hover:bg-brand-blue/20 hover:text-brand-blue transition-all cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-brand-blue" />
              <h3 className="text-lg font-bold text-white">Community Guidelines</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Be respectful, share knowledge, and help others on their journey.
            </p>
            <button className="text-brand-blue text-sm font-semibold hover:text-blue-400 transition-colors">
              Read Full Guidelines →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};