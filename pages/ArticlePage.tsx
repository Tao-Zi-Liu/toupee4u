
import React from 'react';
// Fixing react-router-dom named imports
import { Link, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { ArticleView } from '../components/ArticleView';
import { ArrowLeft } from 'lucide-react';

export const ArticlePage: React.FC = () => {
  // Updated params to include topicId
  const { categoryId, topicId, articleId } = useParams<{ categoryId: string; topicId: string; articleId: string }>();
  const { categories } = useData();
  
  const category = categories.find(c => c.id === categoryId);
  const topic = category?.topics.find(t => t.id === topicId);
  const article = topic?.articles.find(a => a.id === articleId);

  if (!category || !topic || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-slate-400">The protocol you are looking for has been moved or deleted.</p>
        <Link to={`/kb/${categoryId}/${topicId}`} className="text-brand-blue hover:underline">Return to Topic</Link>
      </div>
    );
  }

  // Enhance ArticleView with Breadcrumb logic or pass details
  // Note: ArticleView expects `Article` type which matches our new leaf node type mostly.
  // We might need to inject the topic name as 'Category' display in ArticleView if we want context.
  // Or modify ArticleView. For now, let's pass a modified article object for display purposes if needed, 
  // but ArticleView uses `article.category` string. Our new Article interface doesn't have `category` string property 
  // explicitly in the interface but we can mock it or update interface. 
  // Let's assume ArticleView uses what we pass. 
  
  const displayArticle = {
      ...article,
      category: topic.title // Show Topic Title as the "Category" badge in the view
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="mb-6">
        <Link 
          to={`/kb/${categoryId}/${topicId}`}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to {topic.title}
        </Link>
      </div>
      
      {/* Main Article Content */}
      <ArticleView article={displayArticle as any} />
      
      {/* Footer Navigation */}
      <div className="mt-12 pt-8 border-t border-dark-700 flex justify-between items-center text-slate-500 text-sm">
        <span>Module ID: {article.id}</span>
        <Link to={`/kb/${categoryId}`} className="hover:text-brand-blue transition-colors">
            Browse all topics in {category.name}
        </Link>
      </div>
    </div>
  );
};
