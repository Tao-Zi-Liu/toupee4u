
import React from 'react';
import { Link } from 'react-router-dom';
import { KB_CATEGORIES } from '../constants';
import { ArrowRight, Brain } from 'lucide-react';

export const KnowledgeMapPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto py-8">
        <div className="inline-flex items-center justify-center p-3 bg-brand-blue/10 rounded-2xl text-brand-blue mb-6 border border-brand-blue/20">
            <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Knowledge Architecture</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Toupee4U isn't just a list of tips. It's a structured curriculum designed to take you from a novice understanding of hair systems to mastery of the physics involved.
        </p>
      </div>

      {/* The Map */}
      <div className="relative max-w-5xl mx-auto">
        {/* Central Spine Line (Desktop) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-dark-700 -translate-x-1/2 hidden md:block"></div>

        <div className="space-y-12 md:space-y-24 relative">
          {KB_CATEGORIES.map((category, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={category.id} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Content Card */}
                <div className="flex-1 w-full">
                  <Link to={`/kb/${category.id}`} className="block group">
                    <div className="bg-dark-800 p-8 rounded-3xl border border-dark-700 hover:border-brand-blue transition-all duration-300 hover:shadow-2xl hover:shadow-brand-blue/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                          <category.icon className="w-32 h-32" />
                       </div>
                       
                       <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full border border-brand-blue/20">
                                Phase {index + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {category.physicsTheme}
                              </span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">
                            {category.name}
                          </h2>
                          <p className="text-slate-300 mb-6">
                            {category.description}
                          </p>
                          <div className="flex items-center text-sm font-bold text-white gap-2">
                             Access Module <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </div>
                       </div>
                    </div>
                  </Link>
                </div>

                {/* Center Node (Desktop) */}
                <div className="relative hidden md:flex items-center justify-center w-12 flex-shrink-0 z-10">
                    <div className="w-4 h-4 bg-brand-blue rounded-full ring-4 ring-dark-900 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                </div>

                {/* Empty Space for layout balance */}
                <div className="flex-1 hidden md:block"></div>

              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-dark-800 to-dark-900 rounded-3xl p-12 text-center border border-dark-700 relative overflow-hidden mt-12">
         <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to engineer your look?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Start with Phase 1 to understand the fundamentals of cap construction, or jump to specific modules if you are troubleshooting an active system.
            </p>
            <Link to="/kb/foundations" className="inline-flex items-center px-8 py-4 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25">
                Begin Sequence <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
         </div>
      </div>

    </div>
  );
};
