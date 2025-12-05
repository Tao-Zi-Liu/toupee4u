import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Clock, Award, FileText, ChevronRight, Lock } from 'lucide-react';
import { UserTier } from '../types';

export const TopicPage: React.FC = () => {
  const { categoryId, topicId } = useParams<{ categoryId: string; topicId: string }>();
  const { categories } = useData();
  
  const category = categories.find(c => c.id === categoryId);
  const topic = category?.topics.find(t => t.id === topicId);

  if (!category || !topic) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Topic Not Found</h2>
        <Link to={`/kb/${categoryId || 'foundations'}`} className="text-brand-blue hover:underline">Return to Category</Link>
      </div>
    );
  }

  // Placeholder logic for visual lock
  const isLocked = (tier: UserTier) => {
      // Logic: Observer < Kinetic < Quantum
      // For demo, assume user is Kinetic.
      if (tier === UserTier.QUANTUM) return true;
      return false;
  };

  return (
    <div className="space-y-12 pb-12 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div>
        <Link 
          to={`/kb/${category.id}`}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {category.name}
        </Link>
      </div>

      {/* Header Section (Previously Article Content) */}
      <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden relative">
         <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/20 tracking-wide uppercase">
                    {topic.category}
                </span>
                <span className="flex items-center text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {topic.readTime} Overview
                </span>
                <span className={`flex items-center text-xs font-bold ${topic.tier === UserTier.QUANTUM ? 'text-brand-purple' : 'text-slate-500'}`}>
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    {topic.tier} Tier
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">
                {topic.title}
            </h1>

            {/* Description / Overview Content */}
            <div 
                className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-slate-400 prose-li:text-slate-400 prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: topic.description }} 
            />
         </div>
         
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>

      {/* Sub-Articles List */}
      <div>
         <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            Detailed Modules
         </h2>
         
         <div className="grid gap-4">
            {topic.articles.length > 0 ? (
                topic.articles.map((article, index) => {
                    const locked = isLocked(article.tier);
                    return (
                        <Link 
                            key={article.id}
                            to={`/kb/${category.id}/${topic.id}/${article.id}`}
                            className={`group relative flex items-center p-6 rounded-2xl border transition-all duration-300 ${
                                locked 
                                ? 'bg-dark-800/50 border-dark-700 opacity-75 hover:opacity-100 cursor-not-allowed' 
                                : 'bg-dark-800 border-dark-700 hover:border-brand-blue hover:shadow-lg hover:shadow-brand-blue/5'
                            }`}
                            onClick={(e) => locked && e.preventDefault()}
                        >
                            <div className="flex-shrink-0 mr-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border ${locked ? 'bg-dark-900 text-slate-600 border-dark-700' : 'bg-dark-900 text-slate-300 border-dark-600 group-hover:text-brand-blue group-hover:border-brand-blue transition-colors'}`}>
                                    {index + 1}
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={`text-lg font-bold truncate ${locked ? 'text-slate-500' : 'text-white group-hover:text-brand-blue transition-colors'}`}>
                                        {article.title}
                                    </h3>
                                    {locked && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                                    {article.tier === UserTier.QUANTUM && !locked && (
                                        <span className="text-[10px] bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-1.5 py-0.5 rounded font-bold uppercase">Quantum</span>
                                    )}
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                    <Clock className="w-3 h-3 mr-1" /> {article.readTime}
                                </div>
                            </div>

                            <div className="flex-shrink-0 ml-4">
                                <div className={`p-2 rounded-full ${locked ? 'text-slate-700' : 'bg-dark-900 text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-all'}`}>
                                    {locked ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <div className="p-8 text-center border-2 border-dashed border-dark-700 rounded-2xl text-slate-500">
                    No detailed modules available yet.
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
