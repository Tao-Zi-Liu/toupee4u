import React from 'react';
import { MessageSquare, ThumbsUp, Clock, Hash, MoreHorizontal, Filter } from 'lucide-react';

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
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-dark-700 pb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
            <p className="text-slate-400">Join the "Quantum State" collective. Real talk, no judgment.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-slate-300 hover:text-white hover:border-brand-blue transition-colors text-sm">
                <Filter className="w-4 h-4" />
                Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
                Start Discussion
            </button>
        </div>
      </div>

      <div className="space-y-4">
        {TOPICS.map((topic) => (
            <div key={topic.id} className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-blue/50 transition cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${topic.id % 2 === 0 ? 'bg-brand-purple' : 'bg-brand-blue'}`}>
                            {topic.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm group-hover:text-brand-blue transition-colors">{topic.author}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${topic.role === 'Pro Stylist' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 'text-slate-400 bg-dark-900 border-dark-600'}`}>
                                    {topic.role}
                                </span>
                            </div>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {topic.time}
                            </span>
                        </div>
                    </div>
                    {topic.isHot && (
                         <span className="text-xs text-brand-purple bg-brand-purple/10 px-2 py-1 rounded border border-brand-purple/20 flex items-center gap-1">
                            <Hash className="w-3 h-3" /> Hot
                        </span>
                    )}
                </div>
                
                <div className="pl-13 md:pl-13">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-blue transition-colors">{topic.title}</h3>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            <span className="text-xs px-2.5 py-1 rounded bg-dark-900 text-slate-400 border border-dark-600 font-medium">
                                {topic.tag}
                            </span>
                        </div>
                        <div className="flex gap-6 text-slate-500 text-sm">
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><ThumbsUp className="w-4 h-4" /> {topic.likes}</span>
                            <span className="flex items-center gap-1.5 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /> {topic.replies}</span>
                            <span className="hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4" /></span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
      </div>
      
      <div className="flex justify-center pt-4">
        <button className="px-6 py-2 bg-dark-800 border border-dark-700 text-slate-400 rounded-lg hover:text-white hover:border-slate-500 transition-colors text-sm">
            Load More Discussions
        </button>
      </div>
    </div>
  );
};
