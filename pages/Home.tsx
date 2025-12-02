import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Users, Star, MessageSquare, ThumbsUp, PenTool, Award, Sparkles, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const EXPERT_POSTS = [
  {
    id: 1,
    author: "Dr. Aris Chronis",
    role: "Chemical Engineer",
    avatar: "https://placehold.co/150x150/334155/FFF?text=AC",
    title: "The pH Balance of Scalp Protectors: Why Your Bond Fails",
    excerpt: "Most scalp protectors are too acidic. Learn how alkalinity affects acrylic adhesion longevity and skin health. We analyzed the top 5 market brands in the lab.",
    date: "Oct 12",
    category: "Chemistry",
    readTime: "8 min"
  },
  {
    id: 2,
    author: "Elena Vance",
    role: "Celebrity Stylist",
    avatar: "https://placehold.co/150x150/4c1d95/FFF?text=EV",
    title: "Graduating Hairlines: The Art of Plucking",
    excerpt: "A factory hairline is a dense wall. Here is my technique for creating transitional density to mimic nature using a 1-strand ventilation needle.",
    date: "Oct 10",
    category: "Styling",
    readTime: "12 min"
  },
  {
    id: 3,
    author: "Mark 'The Knot' S.",
    role: "Ventilation Specialist",
    avatar: "https://placehold.co/150x150/0f766e/FFF?text=MS",
    title: "Single vs. Double Knots: Managing Shedding",
    excerpt: "Why bleaching knots weakens the structural integrity of French Lace systems and how to seal them properly without compromising the invisible grid.",
    date: "Oct 08",
    category: "Construction",
    readTime: "6 min"
  },
  {
    id: 4,
    author: "Dr. Sarah Jenkins",
    role: "Dermatologist",
    avatar: "https://placehold.co/150x150/be185d/FFF?text=SJ",
    title: "Contact Dermatitis: Identifying Acrylic Allergies",
    excerpt: "Redness isn't always normal. How to distinguish between traction alopecia, heat rash, and a severe allergic reaction to cyanoacrylate adhesives.",
    date: "Oct 05",
    category: "Health",
    readTime: "10 min"
  },
  {
    id: 5,
    author: "David Chen",
    role: "Material Scientist",
    avatar: "https://placehold.co/150x150/b45309/FFF?text=DC",
    title: "Polyurethane Thickness: 0.03mm vs 0.06mm Longevity",
    excerpt: "The trade-off between invisibility and durability is exponential. Our stress tests reveal exactly how many weeks you lose for that extra 0.03mm of thinness.",
    date: "Oct 01",
    category: "Materials",
    readTime: "7 min"
  }
];

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % EXPERT_POSTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % EXPERT_POSTS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + EXPERT_POSTS.length) % EXPERT_POSTS.length);
  };

  const activePost = EXPERT_POSTS[currentSlide];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
          <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome to Toupee4U 👋</h1>
              <p className="text-slate-400 text-sm">The internet's best resource for men's hair systems.</p>
          </div>
      </div>

      {/* Hero Section */}
      <section className="bg-dark-800 rounded-2xl p-8 shadow-lg border border-dark-700 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold text-xs rounded-full mb-4">
            MANAGED DIY HAIR REPLACEMENT
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            From Anxious Novice to <span className="text-brand-blue">Confident Expert</span>.
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Stop relying on generic manufacturer advice. Toupee4U combines the physics of hair, chemical engineering of adhesives, and community support into a single "Truth Engine".
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/kb/foundations" className="px-6 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-all flex items-center shadow-lg shadow-blue-500/20">
              Start Learning
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/consultations" className="px-6 py-3 bg-dark-700 border border-dark-600 text-slate-200 font-medium rounded-xl hover:bg-dark-600 transition-all">
              Book a Stylist
            </Link>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Expert Contributors Carousel */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-500">
                <Award className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">Expert Insights</h2>
                <p className="text-xs text-slate-400">Technical deep-dives from invited industry professionals.</p>
             </div>
          </div>
          <Link to="/kb/foundations" className="text-sm font-medium text-brand-blue hover:text-white transition-colors">
            View All Experts &rarr;
          </Link>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden min-h-[400px] flex flex-col md:flex-row group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 z-0 pointer-events-none">
                <PenTool className="w-64 h-64 text-slate-500 transform rotate-12" />
            </div>

            {/* Left Side: Visual / Author */}
            <div className="w-full md:w-1/3 bg-dark-900/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-dark-700 relative z-10">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                    <img 
                        src={activePost.avatar} 
                        alt={activePost.author} 
                        className="w-32 h-32 rounded-full border-4 border-dark-800 relative z-10 shadow-xl object-cover" 
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark-800 px-3 py-1 rounded-full border border-dark-700 z-20 whitespace-nowrap">
                        <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">{activePost.role}</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{activePost.author}</h3>
                <p className="text-sm text-slate-500">Expert Contributor</p>
            </div>

            {/* Right Side: Content */}
            <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 tracking-wide uppercase mb-4">
                        <Sparkles className="w-3 h-3" />
                        {activePost.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                        {activePost.title}
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        {activePost.excerpt}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {activePost.readTime} read</span>
                        <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                        <span>{activePost.date}</span>
                    </div>
                    <button className="px-6 py-2.5 bg-white text-dark-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                        Read Article
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue hover:text-white transition-colors border border-dark-700 backdrop-blur-sm z-20 md:opacity-0 md:group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue hover:text-white transition-colors border border-dark-700 backdrop-blur-sm z-20 md:opacity-0 md:group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {EXPERT_POSTS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === currentSlide ? 'bg-yellow-500 w-6' : 'bg-dark-600 hover:bg-dark-500'
                        }`}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* Featured Content Grid */}
      <div>
         <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Community Guides</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700 hover:border-brand-blue transition group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue to-brand-purple"></div>
                <div className="h-40 w-full bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                    <img src="https://placehold.co/600x400/1e293b/FFF?text=Hairline+Guide" alt="Guide" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 right-3 bg-brand-purple/90 text-white text-xs font-bold px-2 py-1 rounded">Article</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">M</div>
                    <span className="text-xs text-white font-medium">Mike (Admin)</span>
                    <span className="text-xs text-brand-blue flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 541</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">How to achieve an undetectable hairline using Ghost Bond?</h3>
                <p className="text-sm text-slate-400 line-clamp-2">Ghost Bond is the industry standard for lace fronts, but humidity can ruin the hold. In this guide, we break down the 3-layer application method...</p>
                
                <div className="mt-4 flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 67</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 12</span>
                </div>
            </div>

            <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700 hover:border-brand-blue transition group cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-green-400"></div>
                <div className="h-40 w-full bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                    <img src="https://placehold.co/600x400/1e293b/FFF?text=System+Cleaning" alt="Cleaning" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs font-bold px-2 py-1 rounded">Guide</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold">J</div>
                    <span className="text-xs text-white font-medium">James W.</span>
                    <span className="text-xs text-green-400 flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> 138</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-snug">Is C-22 Solvent safe for Swiss Lace bases?</h3>
                <p className="text-sm text-slate-400 line-clamp-2">Cleaning your system is crucial for longevity. While C-22 is effective, leaving it on too long can cause the knots to swell and loosen...</p>
                
                <div className="mt-4 flex items-center gap-4 text-slate-500 text-sm">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 45</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 8</span>
                </div>
            </div>
        </div>
      </div>

      {/* Recent Discussions */}
      <div>
         <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Recent Discussions</h2>
            <span className="px-2 py-0.5 bg-dark-700 rounded-full text-xs text-slate-400">8,567 Posts</span>
        </div>
        
        <div className="space-y-4">
             <div className="bg-dark-800 rounded-xl p-5 border border-dark-700 hover:bg-dark-700/50 transition cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500 overflow-hidden flex items-center justify-center text-white text-xs font-bold">
                                DS
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">Daniel Smith</span>
                                    <span className="text-xs text-green-400 bg-green-400/10 px-1.5 rounded border border-green-400/20">Verified Wearer</span>
                                </div>
                                <span className="text-xs text-slate-500">15 min ago</span>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 bg-dark-900 px-2 py-1 rounded border border-dark-700">Discussion</span>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2">My experience switching from 0.03mm Poly to French Lace</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">I've been wearing thin skin for 2 years, but the heat this summer was unbearable. I finally made the switch to lace and here is my breakdown...</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-dark-900 text-brand-blue border border-brand-blue/20">Poly Skin</span>
                        </div>
                        <div className="flex gap-4 text-slate-500 text-sm">
                            <span className="hover:text-white flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 12</span>
                            <span className="hover:text-white flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 2</span>
                        </div>
                    </div>
                </div>
        </div>
      </div>
    </div>
  );
};
