import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { ArticleView } from '../components/ArticleView';
import { ArrowLeft } from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { categoryId, articleId } = useParams<{ categoryId: string; articleId: string }>();
  
  const category = KB_CATEGORIES.find(c => c.id === categoryId);
  const article = category?.articles.find(a => a.id === articleId);

  if (!category || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-slate-400">The protocol you are looking for has been moved or deleted.</p>
        <Link to="/kb/foundations" className="text-brand-blue hover:underline">Return to Knowledge Base</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link 
          to={`/kb/${categoryId}`}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {category.name}
        </Link>
      </div>
      
      {/* Main Article Content */}
      <ArticleView article={article} />
      
      {/* Footer Navigation (Next Article Logic could go here) */}
      <div className="mt-12 pt-8 border-t border-dark-700 flex justify-between items-center text-slate-500 text-sm">
        <span>Article ID: {article.id}</span>
        <Link to="/kb/foundations" className="hover:text-brand-blue transition-colors">
            Browse all protocols
        </Link>
      </div>
    </div>
  );
};
