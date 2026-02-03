
import React, { useState } from 'react';
import { Article, UserTier, Expert } from '../types';
import { 
  Lock, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  ThumbsUp, 
  ThumbsDown,
  Share2,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleViewProps {
  article: Article;
  userTier?: UserTier;
  expert?: Expert;
  prevArticle?: { id: string; title: string; path: string };
  nextArticle?: { id: string; title: string; path: string };
}

export const ArticleView: React.FC<ArticleViewProps> = ({ 
  article, 
  userTier = UserTier.OBSERVER,
  expert,
  prevArticle,
  nextArticle
}) => {
  const [activeHeading, setActiveHeading] = useState<string>('intro');
  
  // Simulated Table of Contents based on typical article structure
  const toc = [
    { id: 'intro', title: 'Molecular Overview' },
    { id: 'mechanics', title: 'Adhesion Mechanics' },
    { id: 'application', title: 'Application Protocol' },
    { id: 'longevity', title: 'Longevity Variables' }
  ];

  const tiers = [UserTier.OBSERVER, UserTier.KINETIC, UserTier.QUANTUM];
  const articleTierIndex = tiers.indexOf(article.tier);
  const userTierIndex = tiers.indexOf(userTier);
  const isLocked = userTierIndex < articleTierIndex;

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* --- Left Column: Main Content --- */}
      <div className="flex-1 min-w-0 max-w-4xl">
        <article className="space-y-10">
          {/* Header Metadata */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
               <span className="text-brand-blue flex items-center gap-1.5 bg-brand-blue/10 px-2.5 py-1 rounded-md border border-brand-blue/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Physics Vetted
               </span>
               <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {article.readTime} Read
               </span>
               <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Module {article.id.split('-').pop()?.substring(0,2) || '01'}
               </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {article.title}
            </h1>

            {/* Mobile-only Author Card (Stacks below title on small screens) */}
            {expert && (
              <div className="lg:hidden flex items-center gap-4 p-4 bg-dark-800 rounded-2xl border border-dark-700">
                 <img src={expert.image} className="w-12 h-12 rounded-xl object-cover border border-dark-600" alt={expert.name} />
                 <div>
                    <p className="text-xs font-bold text-white">{expert.name}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{expert.role}</p>
                 </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="relative">
            {isLocked ? (
              <div className="relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/80 to-dark-900 z-10 pointer-events-none"></div>
                 <div className="prose prose-lg prose-invert max-w-none opacity-20 select-none blur-[2px]">
                    <h3>The Mechanics of Entropy</h3>
                    <p>When analyzing the molecular structure of Swiss lace versus French lace denier, we must first establish the baseline for refraction. The thinner the fiber, the less light is scattered, creating the "invisible" effect. However, this comes at a significant cost to tensile strength.</p>
                    <p>In this restricted module, we explore the specific heat-sealing protocols used by high-end manufacturers to prevent fiber fraying without increasing base density...</p>
                 </div>
                 
                 <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-dark-800 border-2 border-brand-purple/30 rounded-3xl p-8 shadow-2xl text-center backdrop-blur-md">
                        <div className="w-16 h-16 bg-brand-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-purple">
                             <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Quantum Protocol Restricted</h3>
                        <p className="text-slate-300 text-sm mb-8">
                          This technical module contains proprietary "Physics of Hair" research available exclusively to <strong>{article.tier}</strong> members.
                        </p>
                        <Link 
                            to="/membership" 
                            className="block w-full py-4 bg-brand-purple hover:bg-purple-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                        >
                          Unlock Tier Access
                        </Link>
                        <button className="mt-4 text-xs font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                            View Module Prerequisites
                        </button>
                    </div>
                 </div>
              </div>
            ) : (
              <div 
                className="prose prose-lg prose-invert max-w-none 
                  prose-headings:text-white prose-headings:tracking-tight prose-headings:font-extrabold
                  prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-strong:text-white prose-strong:font-bold
                  prose-code:text-brand-blue prose-code:bg-dark-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                  prose-a:text-brand-blue prose-a:no-underline hover:prose-a:underline
                  prose-ul:border-l prose-ul:border-dark-700 prose-ul:pl-6 prose-li:marker:text-brand-blue"
                dangerouslySetInnerHTML={{ __html: article.content }} 
              />
            )}
          </div>

          {/* Feedback Section */}
          {!isLocked && (
            <div className="mt-20 pt-10 border-t border-dark-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h4 className="text-white font-bold text-lg mb-1">Was this protocol helpful?</h4>
                  <p className="text-sm text-slate-500">Your feedback helps tune the Truth Engine algorithm.</p>
               </div>
               <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-800 border border-dark-700 text-slate-300 hover:text-white hover:border-brand-blue transition-all group">
                     <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                     <span className="text-sm font-bold">Validated</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-dark-800 border border-dark-700 text-slate-300 hover:text-white hover:border-red-500 transition-all group">
                     <ThumbsDown className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                     <span className="text-sm font-bold">Need Detail</span>
                  </button>
               </div>
            </div>
          )}

          {/* Navigation Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-12 border-t border-dark-700">
             {prevArticle ? (
               <Link to={prevArticle.path} className="group p-8 bg-dark-800 border border-dark-700 rounded-3xl hover:border-brand-blue transition-all">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> Previous Module
                  </p>
                  <h4 className="text-white font-bold text-lg group-hover:text-brand-blue transition-colors line-clamp-1">{prevArticle.title}</h4>
               </Link>
             ) : <div />}

             {nextArticle ? (
               <Link to={nextArticle.path} className="group p-8 bg-dark-800 border border-dark-700 rounded-3xl hover:border-brand-blue transition-all text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center justify-end gap-2">
                     Next Module <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </p>
                  <h4 className="text-white font-bold text-lg group-hover:text-brand-blue transition-colors line-clamp-1">{nextArticle.title}</h4>
               </Link>
             ) : <div />}
          </div>
        </article>
      </div>

      {/* --- Right Column: Desktop Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-80 space-y-8 sticky top-24 h-fit">
        {/* Author/Expert Metadata */}
        {expert && (
          <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-xl">
             <div className="h-24 bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 flex items-center justify-center">
                <div className="bg-dark-900 p-2 rounded-xl border border-white/5">
                    <ShieldCheck className="w-6 h-6 text-brand-blue" />
                </div>
             </div>
             <div className="px-6 pb-6 text-center -mt-12">
                <img 
                    src={expert.image} 
                    className="w-24 h-24 rounded-2xl border-4 border-dark-800 mx-auto object-cover mb-4 shadow-2xl" 
                    alt={expert.name} 
                />
                <h3 className="text-white font-bold text-lg">{expert.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1 mb-4">{expert.role}</p>
                <Link 
                    to={`/experts/${expert.id}`}
                    className="block w-full py-3 bg-dark-900 border border-dark-700 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:border-brand-blue transition-all"
                >
                    View Vetting Record
                </Link>
             </div>
          </div>
        )}

        {/* Table of Contents */}
        <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6">
           <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-1 h-4 bg-brand-blue rounded-full"></span>
              In this module
           </h3>
           <nav className="space-y-5">
              {toc.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveHeading(item.id)}
                  className={`flex items-start gap-4 w-full text-left text-sm transition-all group ${
                    activeHeading === item.id ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                   <div className={`mt-1.5 w-1.5 h-1.5 rounded-full transition-all flex-shrink-0 ${
                     activeHeading === item.id ? 'bg-brand-blue scale-150 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-dark-600 group-hover:bg-slate-500'
                   }`} />
                   <span className="leading-tight">{item.title}</span>
                </button>
              ))}
           </nav>

           <div className="mt-10 pt-6 border-t border-dark-700 space-y-4">
              <button className="w-full flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors group">
                 <span className="flex items-center gap-2"><ExternalLink className="w-3.5 h-3.5" /> Technical Spec PDF</span>
                 <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
              <button className="w-full flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors group">
                 <span className="flex items-center gap-2"><Share2 className="w-3.5 h-3.5" /> Share Signal</span>
                 <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
           </div>
        </div>

        {/* Action Callout */}
        <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-3xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <MessageSquare className="w-20 h-20" />
           </div>
           <h4 className="text-white font-bold text-sm mb-2 relative z-10">Complex Variables?</h4>
           <p className="text-xs text-slate-400 leading-relaxed mb-4 relative z-10">
              Book a tactical session with a Directorate member for a custom Cranial Analysis.
           </p>
           <Link to="/consultations" className="text-[10px] font-bold text-brand-blue uppercase tracking-widest hover:text-white flex items-center gap-2 relative z-10 group">
              Start Analysis <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
           </Link>
        </div>
      </aside>
    </div>
  );
};
