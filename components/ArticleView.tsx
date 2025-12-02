import React from 'react';
import { Article, UserTier } from '../types';
import { Lock, Clock, Award } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  userTier?: UserTier; // Mocking user tier for locking logic
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, userTier = UserTier.KINETIC }) => {
  // Simple logic to check if user has access. 
  // Order: Observer < Kinetic < Quantum
  const tiers = [UserTier.OBSERVER, UserTier.KINETIC, UserTier.QUANTUM];
  const articleTierIndex = tiers.indexOf(article.tier);
  const userTierIndex = tiers.indexOf(userTier);
  const isLocked = userTierIndex < articleTierIndex;

  return (
    <div className="bg-dark-800 rounded-2xl shadow-sm border border-dark-700 overflow-hidden">
      <div className="p-8 border-b border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-dark-900 text-brand-blue border border-brand-blue/20 tracking-wide uppercase">
            {article.category}
          </span>
          <span className="flex items-center text-xs font-medium text-slate-400">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {article.readTime}
          </span>
          {article.tier !== UserTier.OBSERVER && (
            <span className={`flex items-center text-xs font-bold ${article.tier === UserTier.QUANTUM ? 'text-brand-purple' : 'text-brand-blue'}`}>
               <Award className="w-3.5 h-3.5 mr-1.5" />
               {article.tier} Only
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{article.title}</h1>
      </div>

      <div className="p-8">
        {isLocked ? (
          <div className="text-center py-16 bg-dark-900/50 rounded-2xl border border-dark-700 border-dashed">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-dark-700">
                 <Lock className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Restricted Content</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              This article contains advanced "Physics of Hair" protocols available only to <strong>{article.tier}</strong> members.
            </p>
            <button className="px-6 py-3 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/10">
              Upgrade Membership
            </button>
          </div>
        ) : (
          <div 
            className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-400 prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline prose-li:text-slate-400 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        )}
      </div>
      
      {!isLocked && (
        <div className="bg-dark-900/30 px-8 py-6 border-t border-dark-700 flex justify-between items-center">
            <p className="text-sm text-slate-500 font-medium">Found this helpful?</p>
            <button className="text-sm font-bold text-brand-blue hover:text-white transition-colors">
                Discuss in The Lab &rarr;
            </button>
        </div>
      )}
    </div>
  );
};
