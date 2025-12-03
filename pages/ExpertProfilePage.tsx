import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { EXPERTS, KB_CATEGORIES } from '../constants';
import { CheckCircle, Clock, Star, MessageSquare, Video, ArrowLeft, FlaskConical, PenTool, Award, Briefcase, Instagram, Facebook, Youtube, Linkedin, Twitter } from 'lucide-react';

export const ExpertProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const expert = EXPERTS.find(e => e.id === id);

  if (!expert) {
    return <Navigate to="/experts" />;
  }

  // Mock finding articles by this expert (in a real app, articles would have author IDs)
  // For demo, just grabbing some random articles from KB
  const expertArticles = KB_CATEGORIES[0].articles.concat(KB_CATEGORIES[1].articles).slice(0, 3);

  const getThemeColor = (theme: string) => {
     switch(theme) {
       case 'purple': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
       case 'blue': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
       case 'teal': return 'text-teal-500 bg-teal-500/10 border-teal-500/20';
       case 'pink': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
       default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
     }
  };

  const getCategoryId = (categoryName: string) => {
      const cat = KB_CATEGORIES.find(c => c.name === categoryName);
      return cat ? cat.id : 'foundations';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation */}
      <Link to="/experts" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Research Team
      </Link>

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile Identity */}
        <div className="space-y-6">
           {/* Profile Card */}
           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="w-40 h-40 rounded-full p-1 bg-dark-900 border border-dark-700 mb-6 relative">
                 <img src={expert.image} alt={expert.name} className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                 <div className="absolute bottom-2 right-2 bg-dark-900 rounded-full p-2 border border-dark-700 text-brand-blue shadow-lg">
                    <CheckCircle className="w-5 h-5 fill-current" />
                 </div>
              </div>

              <h1 className="text-2xl font-bold text-white mb-1">{expert.name}</h1>
              <p className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${getThemeColor(expert.colorTheme)}`}>
                 {expert.role}
              </p>

              <div className="w-full grid grid-cols-2 gap-4 border-t border-dark-700 pt-6">
                 <div>
                    <div className="text-2xl font-bold text-white">{expert.stats.rating}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Rating</div>
                 </div>
                 <div>
                    <div className="text-2xl font-bold text-white">{expert.stats.experience}</div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Experience</div>
                 </div>
              </div>

              <button className="w-full mt-8 py-3 bg-brand-blue hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                 <Video className="w-4 h-4" />
                 Book Consultation
              </button>
              
              <p className="mt-3 text-xs text-slate-500">
                 {expert.availability === 'Available' ? 'Currently accepting new clients' : 'Currently booked solid'}
              </p>

              {/* Social Links */}
              {expert.socials && (
                 <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-dark-700 w-full">
                    {expert.socials.instagram && (
                       <a href={expert.socials.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-dark-900">
                          <Instagram className="w-5 h-5" />
                       </a>
                    )}
                    {expert.socials.facebook && (
                       <a href={expert.socials.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-dark-900">
                          <Facebook className="w-5 h-5" />
                       </a>
                    )}
                    {expert.socials.youtube && (
                       <a href={expert.socials.youtube} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-dark-900">
                          <Youtube className="w-5 h-5" />
                       </a>
                    )}
                    {expert.socials.linkedin && (
                       <a href={expert.socials.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-dark-900">
                          <Linkedin className="w-5 h-5" />
                       </a>
                    )}
                    {expert.socials.twitter && (
                       <a href={expert.socials.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-sky-500 transition-colors p-2 rounded-full hover:bg-dark-900">
                          <Twitter className="w-5 h-5" />
                       </a>
                    )}
                 </div>
              )}
           </div>

           {/* Skills Matrix */}
           <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Award className="w-4 h-4 text-slate-400" /> Technical Skills
              </h3>
              <div className="space-y-3">
                 {expert.specialties.map((skill, i) => (
                    <div key={i} className="group">
                       <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>{skill}</span>
                          <span className="text-slate-500">9{8-i}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-dark-900 rounded-full overflow-hidden">
                          <div style={{ width: `${98 - (i*5)}%` }} className={`h-full rounded-full bg-gradient-to-r ${i === 0 ? 'from-brand-blue to-cyan-400' : 'from-slate-600 to-slate-500'}`}></div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Col: Content & Philosophy */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* Philosophy / Bio Section */}
           <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 relative overflow-hidden">
              <FlaskConical className="absolute top-4 right-6 w-32 h-32 text-dark-900 opacity-50 rotate-12" />
              <div className="relative z-10">
                 <h2 className="text-2xl font-bold text-white mb-6">Expert Methodology</h2>
                 
                 <div className="space-y-6">
                    <div>
                       <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-2">The Philosophy</h3>
                       <p className="text-slate-300 leading-relaxed text-lg border-l-4 border-dark-600 pl-4 italic">
                          "{expert.bio}"
                       </p>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-brand-blue uppercase tracking-wider mb-2">Operational Protocol</h3>
                       <p className="text-slate-400 leading-relaxed">
                          {expert.methodology}
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Published Research (Articles) */}
           <div>
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-slate-400" /> Published Research
                 </h2>
                 <span className="text-xs font-mono text-slate-500">INDEX: {expert.id.toUpperCase()}_PUBS</span>
              </div>

              <div className="grid gap-4">
                 {expertArticles.map((article, idx) => (
                    <Link to={`/kb/${getCategoryId(article.category)}/${article.id}`} key={article.id} className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-blue transition-all group flex items-start gap-4">
                        <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-dark-900 border border-dark-700 text-slate-500">
                           <span className="text-xs font-bold uppercase">Oct</span>
                           <span className="text-xl font-bold text-white">{12 - idx}</span>
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase text-brand-blue bg-brand-blue/10 px-1.5 py-0.5 rounded">
                                 {article.category}
                              </span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                 <Clock className="w-3 h-3" /> {article.readTime}
                              </span>
                           </div>
                           <h3 className="text-lg font-bold text-white group-hover:text-brand-blue transition-colors mb-1">
                              {article.title}
                           </h3>
                           <p className="text-sm text-slate-400 line-clamp-2">
                              Scientific deep dive into the mechanics of...
                           </p>
                        </div>
                        <div className="self-center">
                           <div className="p-2 rounded-full bg-dark-900 text-slate-400 group-hover:text-white group-hover:bg-brand-blue transition-colors">
                              <ArrowLeft className="w-4 h-4 rotate-180" />
                           </div>
                        </div>
                    </Link>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};
