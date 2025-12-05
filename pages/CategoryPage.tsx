import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Clock, ArrowRight, Layers, Lock, Sparkles, Book } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categories } = useData();
  
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return <div className="p-8 text-white">Category not found</div>;
  }

  // Helper to strip HTML for previews
  const getExcerpt = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '').substring(0, 180) + '...';
  };

  // Helper for placeholder images
  const getPlaceholderImage = (index: number, title: string) => {
      const bg = index % 2 === 0 ? '1e293b' : '0f172a';
      // Truncate title for url safety
      const safeTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
      return `https://placehold.co/800x600/${bg}/FFF?text=${encodeURIComponent(safeTitle)}`;
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-dark-700 pb-8">
        <div className="flex items-center gap-4">
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
      </div>

      {/* Topics Container - Zig Zag Layout */}
      <div className="space-y-16">
        {category.topics.map((topic, index) => {
            const isImageLeft = index % 2 === 0;

            return (
                <Link 
                    key={topic.id} 
                    to={`/kb/${category.id}/${topic.id}`}
                    className="group block"
                >
                    <div className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
                        
                        {/* Visual Side */}
                        <div className="w-full md:w-1/2 relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-dark-700 group-hover:border-brand-blue/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-500 relative bg-dark-800">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                                
                                {/* Abstract Geometric Decoration */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                    <img 
                                        src={getPlaceholderImage(index, topic.title)} 
                                        alt={topic.title}
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Tier Badge Floating */}
                                {topic.tier !== 'Observer' && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${
                                            topic.tier === 'Quantum State' 
                                                ? 'bg-brand-purple/90 text-white border border-brand-purple/50' 
                                                : 'bg-brand-blue/90 text-white border border-brand-blue/50'
                                        }`}>
                                            {topic.tier === 'Quantum State' ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                                            {topic.tier}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Side */}
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

                                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight group-hover:text-brand-blue transition-colors">
                                    {topic.title}
                                </h3>

                                <p className="text-slate-400 text-lg leading-relaxed line-clamp-3">
                                    {getExcerpt(topic.description)}
                                </p>

                                <div className="pt-4">
                                    <span className="inline-flex items-center text-sm font-bold text-white group-hover:text-brand-blue transition-colors gap-2 border-b-2 border-transparent group-hover:border-brand-blue pb-0.5">
                                        Open Topic <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </Link>
            );
        })}
      </div>
    </div>
  );
};
