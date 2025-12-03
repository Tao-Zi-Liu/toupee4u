import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { Clock, ArrowRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = KB_CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return <div className="p-8 text-white">Category not found</div>;
  }

  // Helper to strip HTML for previews
  const getExcerpt = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';
  };

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="flex items-center gap-4 border-b border-dark-700 pb-8">
        <div className="w-16 h-16 bg-dark-800 border border-dark-700 text-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/5">
            <category.icon className="w-8 h-8" />
        </div>
        <div>
            <h2 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-1">
                Physics Theme: {category.physicsTheme}
            </h2>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-slate-400 mt-1 max-w-2xl">{category.description}</p>
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {category.articles.map(article => (
          <Link 
            key={article.id} 
            to={`/kb/${category.id}/${article.id}`}
            className="group bg-dark-800 rounded-2xl border border-dark-700 p-6 hover:border-brand-blue hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-300 flex flex-col relative overflow-hidden"
          >
             {/* Decorative Gradient on Hover */}
             <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-gradient-to-r from-brand-blue to-brand-purple transition-all duration-300"></div>

             <div className="flex justify-between items-start mb-4 mt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider border border-dark-600 px-2 py-1 rounded bg-dark-900 group-hover:text-white transition-colors">
                    {article.category}
                </span>
                {article.tier !== 'Observer' && (
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${article.tier === 'Quantum State' ? 'text-brand-purple border-brand-purple/20 bg-brand-purple/10' : 'text-brand-blue border-brand-blue/20 bg-brand-blue/10'}`}>
                      {article.tier}
                    </span>
                 )}
             </div>

             <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                {article.title}
             </h3>
             
             <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                {getExcerpt(article.content)}
             </p>

             <div className="flex items-center justify-between border-t border-dark-700/50 pt-4 mt-auto">
                <div className="flex items-center text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {article.readTime}
                </div>
                <div className="flex items-center text-sm font-bold text-brand-blue group-hover:translate-x-1 transition-transform">
                    Read Protocol <ArrowRight className="w-4 h-4 ml-2" />
                </div>
             </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
