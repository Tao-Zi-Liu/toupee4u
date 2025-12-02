import React from 'react';
import { useParams } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { ArticleView } from '../components/ArticleView';
import { Layers } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = KB_CATEGORIES.find(c => c.id === categoryId);

  if (!category) {
    return <div className="p-8 text-white">Category not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 border-b border-dark-700 pb-8">
        <div className="w-16 h-16 bg-dark-800 border border-dark-700 text-brand-blue rounded-2xl flex items-center justify-center">
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

      <div className="grid gap-8">
        {category.articles.map(article => (
          <ArticleView key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};
