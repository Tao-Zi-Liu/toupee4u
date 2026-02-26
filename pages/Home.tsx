
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import { CompleteUserProfile } from '../types';
import { CommunityWidget } from '../components/CommunityWidget';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_NEWS } from '../constants';
import { 
  ArrowRight, 
  Star, 
  MessageSquare,
  ThumbsUp, 
  Award, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Clock, 
  PlayCircle, 
  Film, 
  Check, 
  Send, 
  Newspaper, 
  ExternalLink, 
  Globe,
  Flame,
  Activity,
  Zap,
  Hash,
  Share2
} from 'lucide-react';

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
  }
];

const FEATURED_VIDEOS = [
  {
    id: 1,
    title: "Ghost Bond vs. Walker Safe Grip: The Viscosity Test",
    thumbnail: "https://placehold.co/600x340/1e293b/FFF?text=Viscosity+Test",
    duration: "14:20",
    category: "Lab Tests",
    views: "12k",
    host: "Dr. Aris Chronis"
  },
  {
    id: 2,
    title: "Interview with Elena Vance: Hollywood Hair Systems",
    thumbnail: "https://placehold.co/600x340/4c1d95/FFF?text=Interview",
    duration: "45:00",
    category: "Expert Interviews",
    views: "8.5k",
    host: "Toupee4U Podcast"
  },
  {
    id: 3,
    title: "Masterclass: Creating the Perfect Graduated Hairline",
    thumbnail: "https://placehold.co/600x340/0f766e/FFF?text=Masterclass",
    duration: "22:15",
    category: "Tutorials",
    views: "34k",
    host: "Mark 'The Knot'"
  }
];

const TRENDING_SIGNALS = [
  {
    id: "f-102",
    title: "Summer DIY: Switching from 0.03mm Poly to French Lace",
    author: "Daniel Smith",
    tag: "Poly Skin",
    strength: 92,
    replies: 12,
    likes: 45,
    isHot: true
  },
  {
    id: "f-105",
    title: "Front hairline lifting after 3 days. What am I doing wrong?",
    author: "Kevin Taylor",
    tag: "Troubleshooting",
    strength: 88,
    replies: 24,
    likes: 89,
    isHot: true
  },
  {
    id: "f-108",
    title: "Walker Tape vs. Ghost Bond Platinum: Humidity Test",
    author: "Jason Brown",
    tag: "Adhesives",
    strength: 75,
    replies: 56,
    likes: 112,
    isHot: false
  },
  {
    id: "f-110",
    title: "Can I swim daily with a Swiss Lace system?",
    author: "Michael Chen",
    tag: "Lifestyle",
    strength: 64,
    replies: 8,
    likes: 15,
    isHot: false
  },
  {
    id: "f-115",
    title: "Knot sealing techniques for ultra-thin bases",
    author: "Aris C.",
    tag: "Lab Report",
    strength: 98,
    replies: 42,
    likes: 230,
    isHot: true
  }
];

const INDUSTRY_NEWS_FEED = INDUSTRY_NEWS.slice(0, 5);

export const Home: React.FC = () => {
  
  const [expertIndex, setExpertIndex] = useState(0);
  const [isExpertPaused, setIsExpertPaused] = useState(false);
  const [expertAnimPhase, setExpertAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [newsIndex, setNewsIndex] = useState(0);
  const [isNewsPaused, setIsNewsPaused] = useState(false);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [userProfile, setUserProfile] = useState<CompleteUserProfile | null>(null);

  useEffect(() => {
    if (isExpertPaused) return;
    const timer = setInterval(() => {
      setExpertAnimPhase('exiting');
      setTimeout(() => {
        setExpertIndex((prev) => (prev + 1) % EXPERT_POSTS.length);
        setExpertAnimPhase('entering');
        setTimeout(() => {
            setExpertAnimPhase('idle');
        }, 50);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, [isExpertPaused]);

  useEffect(() => {
    if (isNewsPaused) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % INDUSTRY_NEWS_FEED.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [isNewsPaused]);

  useEffect(() => {
    async function loadUserProfile() {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const profile = await getCompleteUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    }
    
    loadUserProfile();
  }, []);

  const getExpertTransformClass = (phase: 'idle' | 'exiting' | 'entering') => {
      switch(phase) {
          case 'exiting': return '[transform:rotateY(-90deg)_translateX(-50px)] opacity-0 transition-all duration-500 ease-in';
          case 'entering': return '[transform:rotateY(90deg)_translateX(50px)] opacity-0 transition-none'; 
          case 'idle': return '[transform:rotateY(0deg)_translateX(0)] opacity-100 transition-all duration-500 ease-out';
      }
  };

  const nextSlide = () => setExpertIndex((prev) => (prev + 1) % EXPERT_POSTS.length);
  const prevSlide = () => setExpertIndex((prev) => (prev - 1 + EXPERT_POSTS.length) % EXPERT_POSTS.length);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
        setRequestSubmitted(false);
        setRequestTopic('');
    }, 3000);
  };

  const renderVideos = () => {
    const list = [];
    for (let i = 0; i < FEATURED_VIDEOS.length; i++) {
      const video = FEATURED_VIDEOS[i];
      list.push(
        <div key={video.id} className="group cursor-pointer">
          <div className="relative rounded-2xl overflow-hidden border border-dark-700 aspect-video mb-4">
             <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                   <PlayCircle className="w-14 h-14 text-white fill-current opacity-90" />
                </div>
             </div>
             <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{video.duration}</div>
          </div>
          <div>
             <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">{video.category}</span>
                <span className="text-xs text-slate-500">• {video.views} views</span>
             </div>
             <h3 className="text-base font-bold text-white mb-1 group-hover:text-brand-blue transition-colors line-clamp-2">{video.title}</h3>
             <p className="text-xs text-slate-300">with <span className="text-slate-300">{video.host}</span></p>
          </div>
        </div>
      );
    }
    return list;
  };

  const renderNews = () => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      const idx = (newsIndex + i) % INDUSTRY_NEWS_FEED.length;
      const news = INDUSTRY_NEWS_FEED[idx];
      list.push(
        <a href={news.link} key={`${news.id}-${i}`} className="block group bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-blue/50 transition-all hover:bg-dark-700/50 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-4">
              <div className="hidden md:flex flex-col items-center justify-center p-3 rounded-lg bg-dark-900 border border-dark-700 text-slate-500 min-w-[80px]">
                 <span className="text-[10px] font-bold uppercase tracking-wider">{news.category}</span>
                 <Globe className="w-4 h-4 mt-2 mb-1" />
              </div>
              <div className="flex-1">
                   <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{news.source} • {news.date}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-brand-blue transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors leading-tight">{news.title}</h3>
                  <p className="text-sm text-slate-300 line-clamp-1">{news.snippet}</p>
              </div>
          </div>
        </a>
      );
    }
    return list;
  };

  const activePost = EXPERT_POSTS[expertIndex];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
          <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome to Toupee4U 👋</h1>
              <p className="text-slate-300 text-sm">The internet's best resource for men's hair systems.</p>
          </div>
      </div>

      <section className="bg-dark-800 rounded-2xl p-1 shadow-lg border border-dark-700 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="relative z-10 px-2 pt-2 [perspective:1000px]">
            <div className="flex items-center justify-between px-6 mb-3 mt-2">
                 <div className="flex items-center gap-2">
                     <Award className="w-4 h-4 text-yellow-500" />
                     <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Expert Insights</h3>
                 </div>
                 <Link to="/experts" className="text-xs font-medium text-brand-blue hover:text-white transition-colors">View All Experts &rarr;</Link>
            </div>

            <div 
              className={`relative bg-dark-900/80 backdrop-blur-sm rounded-xl border border-dark-600/50 overflow-hidden min-h-[350px] flex flex-col md:flex-row group/carousel transform-style-3d ${getExpertTransformClass(expertAnimPhase)}`}
              onMouseEnter={() => setIsExpertPaused(true)}
              onMouseLeave={() => setIsExpertPaused(false)}
            >
                <div className="w-full md:w-1/3 bg-dark-950/50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-dark-700 relative z-10">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full"></div>
                        <img src={activePost.avatar} alt={activePost.author} className="w-24 h-24 rounded-full border-4 border-dark-800 relative z-10 shadow-xl object-cover" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark-800 px-3 py-1 rounded-full border border-dark-700 z-20 whitespace-nowrap">
                            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">{activePost.role}</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{activePost.author}</h3>
                </div>

                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center relative z-10">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 tracking-wide uppercase mb-3">
                            <Sparkles className="w-3 h-3" />
                            {activePost.category}
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{activePost.title}</h2>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">{activePost.excerpt}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {activePost.readTime} read</span>
                            <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                            <span>{activePost.date}</span>
                        </div>
                        <button className="px-4 py-2 bg-white text-dark-900 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">Read Article</button>
                    </div>
                </div>

                <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue transition-colors border border-dark-700 backdrop-blur-sm z-20 opacity-0 group-hover/carousel:opacity-100"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue transition-colors border border-dark-700 backdrop-blur-sm z-20 opacity-0 group-hover/carousel:opacity-100"><ChevronRight className="w-5 h-5" /></button>
            </div>
        </div>

        <div className="relative z-10 max-w-3xl p-8 pt-6">
          <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold text-xs rounded-full mb-4">MANAGED DIY HAIR REPLACEMENT</div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">From Anxious Novice to <span className="text-brand-blue">Confident Expert</span>.</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">Stop relying on generic manufacturer advice. Toupee4U combines the physics of hair, chemical engineering of adhesives, and community support into a single "Truth Engine".</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/knowledge-map" className="px-6 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-all flex items-center shadow-lg shadow-blue-500/20">Start Learning <ArrowRight className="ml-2 w-4 h-4" /></Link>
            <Link to="/consultations" className="px-6 py-3 bg-dark-700 border border-dark-600 text-slate-200 font-medium rounded-xl hover:bg-dark-600 transition-all">Book a Stylist</Link>
          </div>
        </div>
      </section>

      {/* --- TRENDING FREQUENCIES (FORUM) --- */}
      <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-purple/10 rounded-lg border border-brand-purple/20 text-brand-purple">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-white">Trending Frequencies</h2>
                   <p className="text-xs text-slate-300">Live community engagement and troubleshooting signals.</p>
                </div>
            </div>
            <Link to="/forum" className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 group transition-colors">
               Enter Forum <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
             {TRENDING_SIGNALS.map((signal) => (
                <Link 
                  key={signal.id} 
                  to="/forum" 
                  className={`flex-shrink-0 w-[280px] md:w-[320px] p-5 rounded-2xl bg-dark-800 border transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden ${
                    signal.isHot ? 'border-brand-purple/30 hover:border-brand-purple' : 'border-dark-700 hover:border-brand-blue'
                  }`}
                >
                   {signal.isHot && (
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Flame className="w-12 h-12 text-brand-purple" />
                      </div>
                   )}
                   
                   <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Signal: {signal.id}</span>
                      <div className="flex gap-2">
                         {signal.isHot && (
                           <span className="px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple text-[8px] font-bold uppercase tracking-widest border border-brand-purple/20 flex items-center gap-1">
                              <Flame className="w-2 h-2" /> HOT
                           </span>
                         )}
                         <span className="px-1.5 py-0.5 rounded bg-dark-900 text-slate-300 text-[8px] font-bold uppercase tracking-widest border border-dark-600">
                            {signal.tag}
                         </span>
                      </div>
                   </div>

                   <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-brand-blue transition-colors">
                      {signal.title}
                   </h3>

                   <div className="space-y-4">
                      {/* Signal Strength Bar */}
                      <div>
                         <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Signal Strength</span>
                            <span className={`text-[9px] font-bold ${signal.strength > 90 ? 'text-brand-purple' : 'text-brand-blue'}`}>{signal.strength}%</span>
                         </div>
                         <div className="h-1 bg-dark-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${signal.strength > 90 ? 'bg-brand-purple shadow-[0_0_10px_rgba(139,92,246,0.4)]' : 'bg-brand-blue shadow-[0_0_10px_rgba(59,130,246,0.4)]'}`} 
                              style={{ width: `${signal.strength}%` }}
                            ></div>
                         </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-dark-700 pt-3">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-dark-700 flex items-center justify-center text-[8px] font-bold text-slate-300">
                               {signal.author[0]}
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{signal.author}</span>
                         </div>
                         <div className="flex items-center gap-3 text-slate-500">
                            <span className="flex items-center gap-1 text-[10px] font-bold"><MessageSquare className="w-3 h-3" /> {signal.replies}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold"><ThumbsUp className="w-3 h-3" /> {signal.likes}</span>
                         </div>
                      </div>
                   </div>
                </Link>
             ))}
          </div>
      </section>

      <section>
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500"><Film className="w-5 h-5" /></div>
               <div>
                  <h2 className="text-xl font-bold text-white">The Video Vault</h2>
                  <p className="text-xs text-slate-300">Interviews, lab tests, and visual masterclasses.</p>
               </div>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{renderVideos()}</div>
      </section>

      <section onMouseEnter={() => setIsNewsPaused(true)} onMouseLeave={() => setIsNewsPaused(false)}>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400"><Newspaper className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-white">Industry News</h2>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4">{renderNews()}</div>
      </section>

      <section className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 rounded-2xl p-8 border border-brand-blue/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Request a Research Protocol</h2>
            <p className="text-slate-300 mb-6">The Toupee4U Knowledge Base is driven by community needs. Tell us what you want our experts to research next.</p>
            {requestSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 text-green-400 animate-in fade-in">
                    <Check className="w-6 h-6" />
                    <h3 className="font-bold text-white">Request Received</h3>
                </div>
            ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <textarea value={requestTopic} onChange={(e) => setRequestTopic(e.target.value)} placeholder="Describe the topic..." className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white focus:border-brand-blue outline-none h-32 resize-none" />
                    <button type="submit" disabled={!requestTopic.trim()} className="bg-brand-blue hover:bg-blue-600 text-white p-2 rounded-lg px-6 font-bold flex items-center gap-2"><Send className="w-3 h-3" /> Submit</button>
                </form>
            )}
        </div>
      </section>
    </div>
  );
};
