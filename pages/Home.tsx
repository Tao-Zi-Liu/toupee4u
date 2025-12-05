import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INDUSTRY_NEWS } from '../constants';
import { findNearbyShops } from '../services/geminiService';
import { ArrowRight, ShieldCheck, Zap, Users, Star, MessageSquare, ThumbsUp, PenTool, Award, Sparkles, ChevronLeft, ChevronRight, Clock, PlayCircle, Film, Check, Send, Newspaper, ExternalLink, Globe, MapPin, Navigation, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

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

const COMMUNITY_GUIDES = [
  {
    id: 1,
    title: "How to achieve an undetectable hairline using Ghost Bond?",
    excerpt: "Ghost Bond is the industry standard for lace fronts, but humidity can ruin the hold. In this guide, we break down the 3-layer application method...",
    image: "https://placehold.co/600x400/1e293b/FFF?text=Hairline+Guide",
    type: "Article",
    typeColor: "bg-brand-purple/90",
    author: "Mike (Admin)",
    authorInitials: "M",
    authorColor: "bg-blue-500",
    likes: 67,
    comments: 12,
    gradient: "from-brand-blue to-brand-purple"
  },
  {
    id: 2,
    title: "Is C-22 Solvent safe for Swiss Lace bases?",
    excerpt: "Cleaning your system is crucial for longevity. While C-22 is effective, leaving it on too long can cause the knots to swell and loosen...",
    image: "https://placehold.co/600x400/1e293b/FFF?text=System+Cleaning",
    type: "Guide",
    typeColor: "bg-blue-600/90",
    author: "James W.",
    authorInitials: "J",
    authorColor: "bg-green-500",
    likes: 45,
    comments: 8,
    gradient: "from-blue-400 to-green-400"
  },
  {
    id: 3,
    title: "Sleeping with a System: Silk vs. Satin",
    excerpt: "Friction is the enemy. We tested 5 different pillowcase materials to see which one resulted in the least amount of hair shedding over a month.",
    image: "https://placehold.co/600x400/1e293b/FFF?text=Sleep+Protocol",
    type: "Experiment",
    typeColor: "bg-orange-500/90",
    author: "Sarah J.",
    authorInitials: "S",
    authorColor: "bg-purple-500",
    likes: 120,
    comments: 34,
    gradient: "from-orange-400 to-red-400"
  },
  {
    id: 4,
    title: "Color Correction: Removing Red Tones",
    excerpt: "Oxidation happens to everyone. Before you dye your system and risk damage, try these color-depositing shampoos first.",
    image: "https://placehold.co/600x400/1e293b/FFF?text=Color+Fix",
    type: "Tutorial",
    typeColor: "bg-teal-500/90",
    author: "David C.",
    authorInitials: "D",
    authorColor: "bg-yellow-500",
    likes: 89,
    comments: 21,
    gradient: "from-teal-400 to-emerald-400"
  },
  {
    id: 5,
    title: "Walker Tape: Minis vs. Rolls",
    excerpt: "Is there a difference in tackiness? We compare pre-cut minis to the roll version of Walker Ultra Hold tape.",
    image: "https://placehold.co/600x400/1e293b/FFF?text=Tape+Test",
    type: "Review",
    typeColor: "bg-pink-500/90",
    author: "Alex M.",
    authorInitials: "A",
    authorColor: "bg-red-500",
    likes: 56,
    comments: 15,
    gradient: "from-pink-400 to-rose-400"
  }
];

const RECENT_DISCUSSIONS = [
  {
    id: 1,
    author: "Daniel Smith",
    role: "Verified Wearer",
    avatarColor: "bg-purple-500",
    initials: "DS",
    time: "15 min ago",
    title: "My experience switching from 0.03mm Poly to French Lace",
    excerpt: "I've been wearing thin skin for 2 years, but the heat this summer was unbearable. I finally made the switch to lace and here is my breakdown...",
    tag: "Poly Skin",
    likes: 12,
    comments: 2
  },
  {
    id: 2,
    author: "James Wilson",
    role: "Newbie",
    avatarColor: "bg-blue-500",
    initials: "JW",
    time: "42 min ago",
    title: "Ghost Bond vs Walker Tape for swimming?",
    excerpt: "I swim 3 times a week. Ghost bond platinum seems to turn white after 20 mins in the pool. Is tape better for water exposure?",
    tag: "Adhesives",
    likes: 8,
    comments: 15
  },
  {
    id: 3,
    author: "Sarah Jenkins",
    role: "Dermatologist",
    avatarColor: "bg-pink-500",
    initials: "SJ",
    time: "1 hour ago",
    title: "Warning signs of scalp fungal infection",
    excerpt: "If you are experiencing persistent itchiness under your base that doesn't go away after washing, check for these red ring-like patterns...",
    tag: "Health",
    likes: 45,
    comments: 12
  },
  {
    id: 4,
    author: "Mike Ross",
    role: "DIY Pro",
    avatarColor: "bg-green-500",
    initials: "MR",
    time: "2 hours ago",
    title: "Template making: The saran wrap method",
    excerpt: "Stop paying $50 for a template. All you need is cling film and clear tape to create a perfect mold of your balding area.",
    tag: "Tutorial",
    likes: 32,
    comments: 6
  },
  {
    id: 5,
    author: "Alex Chen",
    role: "Stylist",
    avatarColor: "bg-orange-500",
    initials: "AC",
    time: "3 hours ago",
    title: "Color correction for oxidized systems",
    excerpt: "Your brown system turned orange? Don't throw it away. Here is a formula using blue shampoo and a specific toner to restore the ash tone.",
    tag: "Maintenance",
    likes: 56,
    comments: 8
  }
];

export const Home: React.FC = () => {
  // Expert Carousel State
  const [expertIndex, setExpertIndex] = useState(0);
  const [isExpertPaused, setIsExpertPaused] = useState(false);
  const [expertAnimPhase, setExpertAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  
  // News Ticker State
  const [newsIndex, setNewsIndex] = useState(0);
  const [isNewsPaused, setIsNewsPaused] = useState(false);

  // Guides Ticker State
  const [guideIndex, setGuideIndex] = useState(0);
  const [isGuidePaused, setIsGuidePaused] = useState(false);
  const [guideAnimPhase, setGuideAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');

  // Discussion Ticker State & Animation
  const [discussionIndex, setDiscussionIndex] = useState(0);
  const [animPhase, setAnimPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');

  const [requestTopic, setRequestTopic] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Location / Map State
  const [locationState, setLocationState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error',
    data: { text: string, chunks: any[] } | null,
    coords: { lat: number, lng: number } | null
  }>({ status: 'idle', data: null, coords: null });

  // Expert Carousel Logic (3D Scroll Left / Horizontal Flip)
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
      }, 500); // Duration of exit animation
    }, 5000);
    return () => clearInterval(timer);
  }, [isExpertPaused]);

  // CSS for horizontal 3D flip (Scroll Left effect)
  const getExpertTransformClass = (phase: 'idle' | 'exiting' | 'entering') => {
      switch(phase) {
          // RotateY -90deg simulates flipping/scrolling to the left
          case 'exiting': return '[transform:rotateY(-90deg)_translateX(-50px)] opacity-0 transition-all duration-500 ease-in';
          case 'entering': return '[transform:rotateY(90deg)_translateX(50px)] opacity-0 transition-none'; 
          case 'idle': return '[transform:rotateY(0deg)_translateX(0)] opacity-100 transition-all duration-500 ease-out';
      }
  };

  // News Ticker Logic (1.5s interval)
  const newsFeed = INDUSTRY_NEWS.slice(0, 5);
  useEffect(() => {
    if (isNewsPaused) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsFeed.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isNewsPaused, newsFeed.length]);
  
  const visibleNews = [0, 1, 2].map(offset => newsFeed[(newsIndex + offset) % newsFeed.length]);

  // Guides Ticker Logic (3D Flip)
  useEffect(() => {
    if (isGuidePaused) return;
    const interval = setInterval(() => {
        setGuideAnimPhase('exiting');
        setTimeout(() => {
            setGuideIndex((prev) => (prev + 1) % COMMUNITY_GUIDES.length);
            setGuideAnimPhase('entering');
            setTimeout(() => {
                setGuideAnimPhase('idle');
            }, 50);
        }, 500); // 500ms exit animation
    }, 4500); 
    return () => clearInterval(interval);
  }, [isGuidePaused]);

  // 3D Flip Ticker Logic for Discussions
  useEffect(() => {
    const interval = setInterval(() => {
        setAnimPhase('exiting');
        setTimeout(() => {
            setDiscussionIndex((prev) => (prev + 1) % RECENT_DISCUSSIONS.length);
            setAnimPhase('entering');
            setTimeout(() => {
                setAnimPhase('idle');
            }, 50);
        }, 500);
    }, 4000); // Cycle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const getDiscussionTransformClass = (phase: 'idle' | 'exiting' | 'entering') => {
      switch(phase) {
          case 'exiting': return '[transform:rotateX(90deg)_translateY(-20px)] opacity-0 transition-all duration-500 ease-in';
          case 'entering': return '[transform:rotateX(-90deg)_translateY(20px)] opacity-0 transition-none'; // Instant reset position
          case 'idle': return '[transform:rotateX(0deg)_translateY(0)] opacity-100 transition-all duration-500 ease-out';
      }
  };

  const nextSlide = () => {
    setExpertIndex((prev) => (prev + 1) % EXPERT_POSTS.length);
    setExpertAnimPhase('idle');
  };

  const prevSlide = () => {
    setExpertIndex((prev) => (prev - 1 + EXPERT_POSTS.length) % EXPERT_POSTS.length);
    setExpertAnimPhase('idle');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTopic.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
        setRequestSubmitted(false);
        setRequestTopic('');
    }, 3000);
  };

  const handleLocate = () => {
    setLocationState({ ...locationState, status: 'loading' });
    if (!navigator.geolocation) {
        setLocationState({ ...locationState, status: 'error' });
        return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await findNearbyShops(latitude, longitude);
        setLocationState({
            status: 'success',
            data: result,
            coords: { lat: latitude, lng: longitude }
        });
    }, (err) => {
        console.error(err);
        setLocationState({ ...locationState, status: 'error' });
    });
  };

  const activePost = EXPERT_POSTS[expertIndex];
  const activeDiscussion = RECENT_DISCUSSIONS[discussionIndex];
  const activeGuide = COMMUNITY_GUIDES[guideIndex];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
          <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome to Toupee4U 👋</h1>
              <p className="text-slate-400 text-sm">The internet's best resource for men's hair systems.</p>
          </div>
      </div>

      {/* Hero Section & Expert Carousel Consolidated */}
      <section className="bg-dark-800 rounded-2xl p-1 shadow-lg border border-dark-700 relative overflow-hidden group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 z-0"></div>
        
        {/* Top: Expert Insights Carousel (Moved Above) */}
        <div className="relative z-10 px-2 pt-2 [perspective:1000px]">
            <div className="flex items-center justify-between px-6 mb-3 mt-2">
                 <div className="flex items-center gap-2">
                     <Award className="w-4 h-4 text-yellow-500" />
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expert Insights</h3>
                 </div>
                 <Link to="/kb/foundations" className="text-xs font-medium text-brand-blue hover:text-white transition-colors">
                    View All Experts &rarr;
                 </Link>
            </div>

            {/* Carousel Container */}
            <div 
            className={`relative bg-dark-900/80 backdrop-blur-sm rounded-xl border border-dark-600/50 overflow-hidden min-h-[350px] flex flex-col md:flex-row group/carousel transform-style-3d ${getExpertTransformClass(expertAnimPhase)}`}
            onMouseEnter={() => setIsExpertPaused(true)}
            onMouseLeave={() => setIsExpertPaused(false)}
            >
                {/* Left Side: Visual / Author */}
                <div className="w-full md:w-1/3 bg-dark-950/50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-dark-700 relative z-10">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full"></div>
                        <img 
                            src={activePost.avatar} 
                            alt={activePost.author} 
                            className="w-24 h-24 rounded-full border-4 border-dark-800 relative z-10 shadow-xl object-cover" 
                        />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark-800 px-3 py-1 rounded-full border border-dark-700 z-20 whitespace-nowrap">
                            <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">{activePost.role}</span>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-0.5">{activePost.author}</h3>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center relative z-10">
                    <div className="mb-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 tracking-wide uppercase mb-3">
                            <Sparkles className="w-3 h-3" />
                            {activePost.category}
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                            {activePost.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {activePost.excerpt}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {activePost.readTime} read</span>
                            <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                            <span>{activePost.date}</span>
                        </div>
                        <button className="px-4 py-2 bg-white text-dark-900 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                            Read Article
                        </button>
                    </div>
                </div>

                {/* Navigation Controls */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue hover:text-white transition-colors border border-dark-700 backdrop-blur-sm z-20 opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-900/80 text-white hover:bg-brand-blue hover:text-white transition-colors border border-dark-700 backdrop-blur-sm z-20 opacity-0 group-hover/carousel:opacity-100"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {EXPERT_POSTS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setExpertIndex(idx); setExpertAnimPhase('idle'); }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                idx === expertIndex ? 'bg-yellow-500 w-4' : 'bg-dark-600 hover:bg-dark-500'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Bottom: Hero Content (Text) */}
        <div className="relative z-10 max-w-3xl p-8 pt-6">
          <div className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 font-semibold text-xs rounded-full mb-4">
            MANAGED DIY HAIR REPLACEMENT
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            From Anxious Novice to <span className="text-brand-blue">Confident Expert</span>.
          </h2>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Stop relying on generic manufacturer advice. Toupee4U combines the physics of hair, chemical engineering of adhesives, and community support into a single "Truth Engine".
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/knowledge-map" className="px-6 py-3 bg-brand-blue text-white font-medium rounded-xl hover:bg-blue-600 transition-all flex items-center shadow-lg shadow-blue-500/20">
              Start Learning
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link to="/consultations" className="px-6 py-3 bg-dark-700 border border-dark-600 text-slate-200 font-medium rounded-xl hover:bg-dark-600 transition-all">
              Book a Stylist
            </Link>
          </div>
        </div>

      </section>

      {/* Video Vault */}
      <section>
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-500">
                  <Film className="w-5 h-5" />
               </div>
               <div>
                  <h2 className="text-xl font-bold text-white">The Video Vault</h2>
                  <p className="text-xs text-slate-400">Interviews, lab tests, and visual masterclasses.</p>
               </div>
            </div>
            <button className="text-sm font-medium text-brand-blue hover:text-white transition-colors">
              Browse All Videos &rarr;
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_VIDEOS.map((video) => (
               <div key={video.id} className="group cursor-pointer">
                  {/* Thumbnail Container */}
                  <div className="relative rounded-2xl overflow-hidden border border-dark-700 aspect-video mb-4">
                     <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" 
                     />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                           <PlayCircle className="w-14 h-14 text-white fill-current opacity-90" />
                        </div>
                     </div>
                     <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {video.duration}
                     </div>
                  </div>

                  {/* Content */}
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/20">
                           {video.category}
                        </span>
                        <span className="text-xs text-slate-500">• {video.views} views</span>
                     </div>
                     <h3 className="text-base font-bold text-white mb-1 group-hover:text-brand-blue transition-colors line-clamp-2">
                        {video.title}
                     </h3>
                     <p className="text-xs text-slate-400">
                        with <span className="text-slate-300">{video.host}</span>
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Featured Content Grid - Vertical Ticker (Community Guides 3D Flip) */}
      <section 
        onMouseEnter={() => setIsGuidePaused(true)}
        onMouseLeave={() => setIsGuidePaused(false)}
        className="[perspective:1000px]"
      >
         <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Community Guides</h2>
            <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full text-xs animate-pulse">
                Rotating Selection
            </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
             {/* 3D Flip Container */}
             <div className={`transform-style-3d ${getDiscussionTransformClass(guideAnimPhase)}`}>
                <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700 hover:border-brand-blue transition group cursor-pointer relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activeGuide.gradient}`}></div>
                    <div className="h-40 w-full bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                        <img src={activeGuide.image} alt={activeGuide.type} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500" />
                        <span className={`absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded ${activeGuide.typeColor}`}>{activeGuide.type}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${activeGuide.authorColor}`}>{activeGuide.authorInitials}</div>
                        <span className="text-xs text-white font-medium">{activeGuide.author}</span>
                        <span className="text-xs text-brand-blue flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {activeGuide.likes}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-snug">{activeGuide.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">{activeGuide.excerpt}</p>
                    
                    <div className="mt-4 flex items-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {activeGuide.likes}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {activeGuide.comments}</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Industry News Section - Vertical Ticker */}
      <section 
        onMouseEnter={() => setIsNewsPaused(true)}
        onMouseLeave={() => setIsNewsPaused(false)}
      >
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                <Newspaper className="w-5 h-5" />
            </div>
            <div>
                <Link to="/news" className="group">
                    <h2 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors flex items-center gap-2">
                        Industry News <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h2>
                </Link>
                <p className="text-xs text-slate-400">Latest 5 updates • Auto-cycling</p>
            </div>
            </div>
            {isNewsPaused && <span className="text-xs text-slate-500 animate-pulse">Paused</span>}
        </div>

        <div className="grid grid-cols-1 gap-4">
            {visibleNews.map((news, idx) => (
                <a href={news.link} key={`${news.id}-${idx}`} className="block group bg-dark-800 rounded-xl p-5 border border-dark-700 hover:border-brand-blue/50 transition-all hover:bg-dark-700/50 animate-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-start gap-4">
                        <div className="hidden md:flex flex-col items-center justify-center p-3 rounded-lg bg-dark-900 border border-dark-700 text-slate-500 min-w-[80px]">
                           <span className="text-[10px] font-bold uppercase tracking-wider">{news.category}</span>
                           <Globe className="w-4 h-4 mt-2 mb-1" />
                        </div>
                        <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    {news.source} • {news.date}
                                </span>
                                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-brand-blue transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors leading-tight">
                                {news.title}
                            </h3>
                            <p className="text-sm text-slate-400 line-clamp-1">
                                {news.snippet}
                            </p>
                        </div>
                    </div>
                </a>
            ))}
        </div>
      </section>

      {/* Recent Discussions - 3D Flipping Ticker */}
      <div className="[perspective:1000px]">
         <div className="mb-4 flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Recent Discussions</h2>
            <span className="px-2 py-0.5 bg-dark-700 rounded-full text-xs text-slate-400 animate-pulse">Live Feed</span>
        </div>
        
        <div className="space-y-4">
             <div className={`bg-dark-800 rounded-xl p-5 border border-dark-700 hover:bg-dark-700/50 transition cursor-pointer transform-style-3d ${getDiscussionTransformClass(animPhase)}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold ${activeDiscussion.avatarColor}`}>
                                {activeDiscussion.initials}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium text-sm">{activeDiscussion.author}</span>
                                    <span className="text-[10px] text-slate-400 bg-dark-900 px-1.5 rounded border border-dark-700">{activeDiscussion.role}</span>
                                </div>
                                <span className="text-xs text-slate-500">{activeDiscussion.time}</span>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400 bg-dark-900 px-2 py-1 rounded border border-dark-700">Topic #{activeDiscussion.id}</span>
                    </div>
                    
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">{activeDiscussion.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{activeDiscussion.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <span className="text-xs px-2 py-1 rounded bg-dark-900 text-brand-blue border border-brand-blue/20">{activeDiscussion.tag}</span>
                        </div>
                        <div className="flex gap-4 text-slate-500 text-sm">
                            <span className="hover:text-white flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {activeDiscussion.likes}</span>
                            <span className="hover:text-white flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {activeDiscussion.comments}</span>
                        </div>
                    </div>
                </div>
        </div>
      </div>

      {/* Request Protocol Section */}
      <section className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 rounded-2xl p-8 border border-brand-blue/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12">
            <MessageSquare className="w-64 h-64 text-brand-blue" />
        </div>

        <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-blue/20 rounded-lg text-brand-blue border border-brand-blue/20">
                    <PenTool className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Request a Research Protocol</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
                The Toupee4U Knowledge Base is driven by community needs. Tell us what specific hair system physics, adhesive chemistry, or styling technique you want our experts to research next.
            </p>

            {requestSubmitted ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4 text-green-400 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-2 bg-green-500/20 rounded-full">
                        <Check className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Request Received</h3>
                        <p className="text-sm text-green-200/80">Your topic has been added to the research queue.</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-blue to-brand-purple rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative">
                            <textarea
                                value={requestTopic}
                                onChange={(e) => setRequestTopic(e.target.value)}
                                placeholder="e.g., I want a detailed breakdown of how swimming in chlorinated water affects poly skin bases vs lace..."
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-slate-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all resize-none h-32"
                            />
                            <div className="absolute bottom-3 right-3">
                                 <button 
                                    type="submit"
                                    disabled={!requestTopic.trim()}
                                    className="bg-brand-blue hover:bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4"
                                 >
                                    <Send className="w-3 h-3" /> Submit
                                 </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 ml-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Requests are prioritized by member tier.</span>
                    </div>
                </form>
            )}
        </div>
      </section>

      {/* --- NEW LOCAL NETWORK / MAP SECTION --- */}
      <section className="bg-dark-800 rounded-2xl border border-dark-700 p-1 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10 bg-gradient-to-b from-dark-900/50 to-dark-800 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-brand-blue" /> Local Network
                    </h2>
                    <p className="text-sm text-slate-400">
                        Find hair replacement specialists rated 4.5+ within a 5-mile radius.
                    </p>
                </div>
                {locationState.status === 'success' && (
                    <div className="text-xs text-brand-blue font-mono bg-brand-blue/10 px-2 py-1 rounded border border-brand-blue/20 flex items-center gap-2">
                        <Navigation className="w-3 h-3" />
                        LAT: {locationState.coords?.lat.toFixed(4)} • LNG: {locationState.coords?.lng.toFixed(4)}
                    </div>
                )}
            </div>

            {/* Map Interaction Area */}
            <div className="bg-dark-900 rounded-xl border border-dark-600 overflow-hidden relative min-h-[300px] flex flex-col">
                
                {/* Initial State */}
                {locationState.status === 'idle' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] bg-cover">
                        <div className="p-4 bg-dark-800/90 rounded-full border border-dark-600 mb-4 shadow-xl backdrop-blur-sm">
                            <Navigation className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Enable Location Services</h3>
                        <p className="text-sm text-slate-400 max-w-xs mb-6">
                            Allow access to your coordinates to triangulate verified salons nearby.
                        </p>
                        <button 
                            onClick={handleLocate}
                            className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
                        >
                            <MapPin className="w-4 h-4" /> Find Shops Near Me
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {locationState.status === 'loading' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <RefreshCw className="w-8 h-8 text-brand-blue animate-spin mb-4" />
                        <p className="text-sm text-slate-400 animate-pulse">Triangulating position via Truth Engine...</p>
                    </div>
                )}

                {/* Error State */}
                {locationState.status === 'error' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Signal Lost</h3>
                        <p className="text-sm text-slate-400 max-w-xs mb-4">
                            Unable to retrieve geolocation data. Please ensure location services are enabled in your browser.
                        </p>
                        <button 
                            onClick={() => setLocationState({...locationState, status: 'idle'})}
                            className="text-sm text-brand-blue hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Success State */}
                {locationState.status === 'success' && locationState.data && (
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Results List */}
                        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-dark-700 bg-dark-900/50 overflow-y-auto max-h-[400px]">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" /> Verified Locations
                            </h4>
                            
                            {locationState.data.chunks.length > 0 ? (
                                <div className="space-y-3">
                                    {locationState.data.chunks.map((chunk, idx) => (
                                        <a 
                                            key={idx}
                                            href={chunk.web?.uri || chunk.maps?.sourceConfig?.placeId ? `https://www.google.com/maps/place/?q=place_id:${chunk.maps?.sourceConfig?.placeId}` : '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block bg-dark-800 p-4 rounded-xl border border-dark-600 hover:border-brand-blue transition-all group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">
                                                    {chunk.web?.title || chunk.maps?.title || "Verified Salon"}
                                                </h5>
                                                <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-brand-blue" />
                                            </div>
                                            <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span className="font-bold">4.5+</span>
                                                <span className="text-slate-500 ml-1">(Google Verified)</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400 italic">
                                    No specific Google Maps entities returned in this sector. 
                                </div>
                            )}
                        </div>

                        {/* AI Summary */}
                        <div className="w-full md:w-1/2 p-6 bg-brand-blue/5">
                            <h4 className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Sparkles className="w-3 h-3" /> Intel Brief
                            </h4>
                            <div className="prose prose-sm prose-invert text-slate-300">
                                <p className="leading-relaxed">
                                    {locationState.data.text}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         </div>
      </section>
    </div>
  );
};