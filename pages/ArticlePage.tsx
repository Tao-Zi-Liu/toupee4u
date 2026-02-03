
import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArticleView } from '../components/ArticleView';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { categoryId, topicId, articleId } = useParams<{ categoryId: string; topicId: string; articleId: string }>();
  const { categories, experts } = useData();
  
  const category = categories.find(c => c.id === categoryId);
  const topic = category?.topics.find(t => t.id === topicId);
  
  const articleIndex = topic?.articles.findIndex(a => a.id === articleId) ?? -1;
  const article = topic?.articles[articleIndex];

  // Logic to find adjacent modules for the navigation cards
  const prevArticle = useMemo(() => {
    if (!topic || articleIndex <= 0) return null;
    return topic.articles[articleIndex - 1];
  }, [topic, articleIndex]);

  const nextArticle = useMemo(() => {
    if (!topic || articleIndex === -1 || articleIndex >= topic.articles.length - 1) return null;
    return topic.articles[articleIndex + 1];
  }, [topic, articleIndex]);

  // Contextual author selection: Link specific categories to their respective domain experts
  const authoringExpert = useMemo(() => {
    if (categoryId === 'base-fiber') return experts.find(e => e.id === 'aris-chronis');
    if (categoryId === 'maintenance') return experts.find(e => e.id === 'mark-knot');
    if (categoryId === 'foundations') return experts.find(e => e.id === 'elena-vance');
    return experts[0]; // Fallback
  }, [categoryId, experts]);

  if (!category || !topic || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-dark-800 rounded-3xl border border-dark-700 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 bg-red-500/10 rounded-3xl animate-pulse"></div>
            <span className="text-5xl relative z-10">🕵️‍♂️</span>
        </div>
        <div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Module Signal Lost</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              The technical coordinates for this module could not be synthesized. It may have been re-indexed into a higher tier.
            </p>
        </div>
        <Link to="/knowledge-map" className="inline-flex items-center gap-3 px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all">
            <ArrowLeft className="w-5 h-5" /> Return to Map Architecture
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* --- Breadcrumb Architecture --- */}
      <nav className="flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 px-1 border-b border-dark-800/50">
        <Link to="/" className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-dark-800">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to="/knowledge-map" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
          Core Architecture
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to={`/kb/${categoryId}`} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
          {category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-dark-700 flex-shrink-0" />
        <Link to={`/kb/${categoryId}/${topicId}`} className="text-[10px] font-bold text-brand-blue transition-colors uppercase tracking-[0.2em]">
          {topic.title}
        </Link>
      </nav>
      
      {/* --- Main Entry Point --- */}
      <ArticleView 
        article={article as any} 
        expert={authoringExpert}
        prevArticle={prevArticle ? {
          id: prevArticle.id,
          title: prevArticle.title,
          path: `/kb/${categoryId}/${topicId}/${prevArticle.id}`
        } : undefined}
        nextArticle={nextArticle ? {
          id: nextArticle.id,
          title: nextArticle.title,
          path: `/kb/${categoryId}/${topicId}/${nextArticle.id}`
        } : undefined}
      />
    </div>
  );
};
