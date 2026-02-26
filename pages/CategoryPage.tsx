
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Clock, ArrowRight, Lock, Sparkles, Book } from 'lucide-react';
import { UserTier } from '../types';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories } = useData();
  
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return <div className="p-8 text-white">Category not found</div>;
  }

  const getExcerpt = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 180) + '...';
  };

  const getPlaceholderImage = (index: number, title: string) => {
      const bg = index % 2 === 0 ? '1e293b' : '0f172a';
      const safeTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
      return `https://placehold.co/800x600/${bg}/FFF?text=${encodeURIComponent(safeTitle)}`;
  };

  const renderTopics = () => {
    const topicElements = [];
    for (let i = 0; i < category.topics.length; i++) {
      const topic = category.topics[i];
      const isImageLeft = i % 2 === 0;
      topicElements.push(
        <Link 
            key={topic.id} 
            to={`/kb/${category.id}/${topic.id}`}
            className="group block"
        >
            <div className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 relative">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-dark-700 group-hover:border-brand-blue/50 transition-all duration-500 relative bg-dark-800">
                        <img src={getPlaceholderImage(i, topic.title)} alt={topic.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                        {/* Fix: Use UserTier.NEBULA instead of 'Observer' string literal */}
                        {topic.tier !== UserTier.NEBULA && (
                            <div className="absolute top-4 right-4 z-20">
                                {/* Fix: Use UserTier.SUPERNOVA instead of 'Quantum State' string literal */}
                                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
                                    topic.tier === UserTier.SUPERNOVA ? 'bg-brand-purple/90 text-white' : 'bg-brand-blue/90 text-white'
                                }`}>
                                    {/* Fix: Use UserTier.SUPERNOVA instead of 'Quantum State' string literal */}
                                    {topic.tier === UserTier.SUPERNOVA ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                    {topic.tier}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-brand-blue flex items-center gap-1 bg-brand-blue/10 px-2 py-0.5 rounded-full border border-brand-blue/20">
                                <Clock className="w-3 h-3" /> {topic.readTime}
                            </span>
                            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-dark-900 px-2 py-0.5 rounded-full border border-dark-600">
                                <Book className="w-3 h-3" /> {topic.articles.length} Modules
                            </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-brand-blue transition-colors">{topic.title}</h3>
                        <p className="text-slate-300 text-lg leading-relaxed line-clamp-3">{getExcerpt(topic.description)}</p>
                        <div className="pt-4">
                            <span className="inline-flex items-center text-sm font-bold text-white group-hover:text-brand-blue transition-colors gap-2">
                                Open Topic <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
      );
    }
    return topicElements;
  };

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-700 pb-8">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-dark-800 border border-dark-700 text-brand-blue rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/5">
                <category.icon className="w-8 h-8" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-1">Physics Theme: {category.physicsTheme}</h2>
                <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                <p className="text-slate-300 mt-1 max-w-2xl">{category.description}</p>
            </div>
        </div>
      </div>
      <div className="space-y-16">{renderTopics()}</div>
    </div>
  );
};