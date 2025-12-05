import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  CheckCircle, Clock, Star, Video, ArrowLeft, FlaskConical, 
  Award, Instagram, Facebook, Youtube, Linkedin, Twitter, 
  MapPin, Link as LinkIcon, MessageCircle, Share2, MoreHorizontal,
  ThumbsUp, BookOpen, Calendar, Quote, ShieldCheck, X
} from 'lucide-react';

export const ExpertProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { experts, categories, consultations } = useData();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'reviews' | 'credentials'>('posts');
  const [showBooking, setShowBooking] = useState(false);

  const expert = experts.find(e => e.id === id);

  if (!expert) {
    return <Navigate to="/experts" />;
  }

  // Use categories from context to find some featured topics
  const expertTopics = categories.flatMap(c => c.topics).slice(0, 3);

  // Mock Reviews Data
  const REVIEWS = [
      { id: 1, user: "Michael T.", avatar: "MT", color: "bg-blue-500", rating: 5, date: "2 weeks ago", comment: `Dr. ${expert.name.split(' ')[1]} helped me identify that my pH balance was destroying the bond. Switched to the recommended protocol and now I get 3 weeks hold.` },
      { id: 2, user: "Sarah J.", avatar: "SJ", color: "bg-pink-500", rating: 5, date: "1 month ago", comment: "The graduation technique taught in the consultation changed my life. My hairline is finally undetectable." },
      { id: 3, user: "David B.", avatar: "DB", color: "bg-green-500", rating: 4, date: "2 months ago", comment: "Very knowledgeable but the booking availability is scarce. Worth the wait though." }
  ];

  // Mock Credentials Data
  const CREDENTIALS = [
      { id: 1, title: "Board Certification", issuer: "American Board of Dermatology", year: "2015", verified: true },
      { id: 2, title: "PhD in Chemical Engineering", issuer: "MIT", year: "2012", verified: true },
      { id: 3, title: "Master Barber License", issuer: "State Cosmetology Board", year: "2010", verified: true }
  ];

  const getThemeGradient = (theme: string) => {
     switch(theme) {
       case 'purple': return 'from-indigo-900 via-purple-900 to-slate-900';
       case 'blue': return 'from-blue-900 via-cyan-900 to-slate-900';
       case 'teal': return 'from-teal-900 via-emerald-900 to-slate-900';
       case 'pink': return 'from-rose-900 via-pink-900 to-slate-900';
       default: return 'from-slate-800 via-slate-900 to-black';
     }
  };

  const getThemeColor = (theme: string) => {
    switch(theme) {
        case 'purple': return 'text-purple-400';
        case 'blue': return 'text-blue-400';
        case 'teal': return 'text-teal-400';
        case 'pink': return 'text-pink-400';
        default: return 'text-slate-400';
      }
  };

  const getCategoryId = (categoryName: string) => {
      const cat = categories.find(c => c.name === categoryName);
      return cat ? cat.id : 'foundations';
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      {/* Top Nav / Breadcrumb */}
      <div className="mb-4">
        <Link to="/experts" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      {/* --- HERO SECTION (Cover & Profile Header) --- */}
      <div className="bg-dark-800 rounded-b-3xl border border-dark-700 shadow-2xl overflow-hidden mb-6 relative">
          
          {/* Cover Photo Area */}
          <div className={`h-64 md:h-80 w-full bg-gradient-to-r ${getThemeGradient(expert.colorTheme)} relative`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              {/* Cover Photo Actions */}
              <div className="absolute bottom-4 right-4 z-10 hidden md:block">
                  <button className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white rounded-lg text-sm font-bold transition-colors border border-white/10">
                      <Share2 className="w-4 h-4" /> Share Profile
                  </button>
              </div>
          </div>

          {/* Profile Header Info */}
          <div className="px-6 md:px-10 pb-6 relative">
              <div className="flex flex-col md:flex-row items-start">
                  
                  {/* Avatar - Overlapping */}
                  <div className="-mt-20 md:-mt-24 relative mb-4 md:mb-0 mr-0 md:mr-8 flex-shrink-0 mx-auto md:mx-0">
                      <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-dark-800 relative z-20">
                          <img 
                            src={expert.image} 
                            alt={expert.name} 
                            className="w-full h-full rounded-full object-cover border-4 border-dark-700 bg-dark-900"
                          />
                          {/* Availability Indicator */}
                          <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-dark-800 ${expert.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`} title={expert.availability}></div>
                      </div>
                  </div>

                  {/* Name & Actions */}
                  <div className="flex-1 pt-4 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                          <div>
                              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                                  {expert.name} 
                                  <CheckCircle className="w-6 h-6 text-brand-blue fill-current text-white bg-white rounded-full" />
                              </h1>
                              <p className={`text-lg font-medium mt-1 ${getThemeColor(expert.colorTheme)}`}>{expert.role}</p>
                              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-slate-400 text-sm">
                                  <span className="flex items-center gap-1">
                                      <Star className="w-4 h-4 text-yellow-500 fill-current" /> 
                                      <span className="font-bold text-white">{expert.stats.rating}</span> Rating
                                  </span>
                                  <span className="hidden md:inline">•</span>
                                  <span>{expert.stats.consultations} Consultations</span>
                              </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setShowBooking(true)}
                                className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                              >
                                  <Video className="w-4 h-4" /> Book Now
                              </button>
                              <button className="px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-200 font-bold rounded-lg transition-colors border border-dark-600">
                                  <MessageCircle className="w-4 h-4" />
                              </button>
                              <button className="px-3 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-200 font-bold rounded-lg transition-colors border border-dark-600">
                                  <MoreHorizontal className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Navigation Tabs */}
              <div className="mt-8 border-t border-dark-700 pt-1">
                  <div className="flex gap-1 overflow-x-auto">
                      <button 
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'posts' ? 'text-brand-blue border-brand-blue' : 'text-slate-400 border-transparent hover:text-white'}`}
                      >
                        Posts & Research
                      </button>
                      <button 
                        onClick={() => setActiveTab('about')}
                        className={`px-4 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'about' ? 'text-brand-blue border-brand-blue' : 'text-slate-400 border-transparent hover:text-white'}`}
                      >
                        About
                      </button>
                      <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reviews' ? 'text-brand-blue border-brand-blue' : 'text-slate-400 border-transparent hover:text-white'}`}
                      >
                        Reviews
                      </button>
                      <button 
                        onClick={() => setActiveTab('credentials')}
                        className={`px-4 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'credentials' ? 'text-brand-blue border-brand-blue' : 'text-slate-400 border-transparent hover:text-white'}`}
                      >
                        Credentials
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* LEFT COLUMN (Static Info - Always Visible) */}
          <div className="lg:col-span-2 space-y-6">
              
              {/* Intro Card */}
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Intro</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3 text-slate-300">
                          <FlaskConical className="w-5 h-5 text-slate-500" />
                          <span>Specializes in <strong className="text-white">{expert.role}</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                          <Calendar className="w-5 h-5 text-slate-500" />
                          <span>Active since <strong>2015</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                          <MapPin className="w-5 h-5 text-slate-500" />
                          <span>Based in <strong>New York, NY</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-300">
                          <LinkIcon className="w-5 h-5 text-slate-500" />
                          <a href="#" className="text-brand-blue hover:underline">toupee4u.com/experts/{expert.id}</a>
                      </div>
                  </div>
                  
                  {/* Socials */}
                  {expert.socials && (
                    <div className="mt-6 pt-4 border-t border-dark-700 flex gap-4">
                        {expert.socials.instagram && <a href={expert.socials.instagram} className="text-slate-400 hover:text-white"><Instagram className="w-5 h-5" /></a>}
                        {expert.socials.twitter && <a href={expert.socials.twitter} className="text-slate-400 hover:text-white"><Twitter className="w-5 h-5" /></a>}
                        {expert.socials.linkedin && <a href={expert.socials.linkedin} className="text-slate-400 hover:text-white"><Linkedin className="w-5 h-5" /></a>}
                        {expert.socials.youtube && <a href={expert.socials.youtube} className="text-slate-400 hover:text-white"><Youtube className="w-5 h-5" /></a>}
                    </div>
                  )}
              </div>

              {/* Skills Card */}
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-white">Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((spec, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 text-xs font-bold">
                              {spec}
                          </span>
                      ))}
                  </div>
              </div>

               {/* Stats Card */}
               <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Impact</h3>
                  <div className="grid grid-cols-2 gap-4">
                        <div className="bg-dark-900 rounded-xl p-3 text-center border border-dark-600">
                            <div className="text-2xl font-bold text-white">{expert.stats.experience}</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">Experience</div>
                        </div>
                        <div className="bg-dark-900 rounded-xl p-3 text-center border border-dark-600">
                            <div className="text-2xl font-bold text-white">4.9/5</div>
                            <div className="text-[10px] uppercase text-slate-500 font-bold">Cust. Sat.</div>
                        </div>
                  </div>
              </div>

          </div>

          {/* RIGHT COLUMN (Dynamic Content based on Active Tab) */}
          <div className="lg:col-span-3 space-y-6">
              
              {/* === TAB: POSTS === */}
              {activeTab === 'posts' && (
                <>
                    {/* Pinned Post (Methodology) */}
                    <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{expert.name}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="text-brand-blue font-bold">Pinned Methodology</span>
                                    <span>•</span>
                                    <Clock className="w-3 h-3" /> Updated 2 days ago
                                </div>
                            </div>
                            <MoreHorizontal className="ml-auto w-5 h-5 text-slate-500 cursor-pointer" />
                        </div>

                        <p className="text-slate-300 leading-relaxed mb-4 text-sm border-l-2 border-brand-blue pl-4 italic">
                            "{expert.bio}"
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {expert.methodology}
                        </p>

                        <div className="flex items-center gap-6 pt-4 border-t border-dark-700 text-slate-400 text-sm">
                            <button className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                                <ThumbsUp className="w-4 h-4" /> 124 Likes
                            </button>
                            <button className="flex items-center gap-2 hover:text-white transition-colors">
                                <MessageCircle className="w-4 h-4" /> 18 Comments
                            </button>
                        </div>
                    </div>

                    {/* Research Header */}
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-white text-lg">Published Research</h3>
                        <div className="flex items-center gap-2 bg-dark-800 rounded-lg p-1 border border-dark-700">
                            <button className="px-3 py-1 bg-dark-700 rounded-md text-xs font-bold text-white shadow">Recent</button>
                            <button className="px-3 py-1 text-slate-500 text-xs font-bold hover:text-white">Popular</button>
                        </div>
                    </div>

                    {/* Articles Feed */}
                    <div className="space-y-4">
                        {expertTopics.map((topic, idx) => (
                            <div key={topic.id} className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-lg hover:border-dark-500 transition-colors animate-in fade-in slide-in-from-bottom-2">
                                <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-white text-sm">{expert.name}</h4>
                                                    <span className="text-slate-500 text-xs">published a module</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock className="w-3 h-3" /> {idx + 1} days ago
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Link to={`/kb/${getCategoryId(topic.category)}/${topic.id}`} className="block group">
                                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">{topic.title}</h4>
                                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                                {topic.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                                            </p>
                                            
                                            <div className="relative h-48 rounded-xl overflow-hidden bg-dark-900 border border-dark-700 mb-4">
                                                <img 
                                                    src={`https://placehold.co/800x400/1e293b/FFF?text=${encodeURIComponent(topic.title)}`} 
                                                    alt={topic.title}
                                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute bottom-3 left-3 flex gap-2">
                                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded border border-white/10">
                                                        {topic.category}
                                                    </span>
                                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded border border-white/10 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {topic.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
                                            <div className="flex gap-4">
                                                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-brand-blue transition-colors">
                                                    <ThumbsUp className="w-4 h-4" /> Like
                                                </button>
                                                <button className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                                                    <MessageCircle className="w-4 h-4" /> Comment
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                                <BookOpen className="w-3 h-3" /> {topic.articles.length} sub-modules
                                            </div>
                                        </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
              )}

              {/* === TAB: ABOUT === */}
              {activeTab === 'about' && (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 shadow-lg animate-in fade-in slide-in-from-bottom-2">
                      <h2 className="text-2xl font-bold text-white mb-6">About {expert.name}</h2>
                      <div className="prose prose-invert max-w-none">
                          <p className="text-slate-300 leading-relaxed mb-6">{expert.bio}</p>
                          <h3 className="text-white font-bold text-lg mb-3">Scientific Methodology</h3>
                          <p className="text-slate-400 leading-relaxed mb-6">{expert.methodology}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-dark-900 p-4 rounded-xl border border-dark-600">
                                    <div className="text-brand-blue font-bold mb-1">Education</div>
                                    <div className="text-sm text-slate-300">PhD in Chemical Engineering</div>
                                    <div className="text-xs text-slate-500">Massachusetts Institute of Technology</div>
                                </div>
                                <div className="bg-dark-900 p-4 rounded-xl border border-dark-600">
                                    <div className="text-brand-purple font-bold mb-1">Focus</div>
                                    <div className="text-sm text-slate-300">Adhesive Thermodynamics</div>
                                    <div className="text-xs text-slate-500">Scalp Biomechanics</div>
                                </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* === TAB: REVIEWS === */}
              {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-white">Client Reviews</h2>
                          <div className="flex items-center gap-2">
                              <Star className="w-5 h-5 text-yellow-500 fill-current" />
                              <span className="text-2xl font-bold text-white">4.9</span>
                              <span className="text-slate-500 text-sm">(124 Reviews)</span>
                          </div>
                      </div>
                      
                      {REVIEWS.map((review) => (
                          <div key={review.id} className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${review.color}`}>
                                          {review.avatar}
                                      </div>
                                      <div>
                                          <div className="font-bold text-white text-sm">{review.user}</div>
                                          <div className="text-xs text-slate-500">{review.date}</div>
                                      </div>
                                  </div>
                                  <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-dark-600'}`} />
                                      ))}
                                  </div>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">"{review.comment}"</p>
                          </div>
                      ))}
                  </div>
              )}

              {/* === TAB: CREDENTIALS === */}
              {activeTab === 'credentials' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <h2 className="text-xl font-bold text-white mb-4">Verified Credentials</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {CREDENTIALS.map((cred) => (
                              <div key={cred.id} className="bg-dark-800 rounded-2xl border border-dark-700 p-1 shadow-lg group">
                                  <div className="bg-dark-900 rounded-xl p-6 h-full flex flex-col items-center text-center border border-dashed border-dark-700 group-hover:border-brand-blue/30 transition-colors">
                                      <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4 border border-dark-700 shadow-inner text-brand-blue">
                                          <Award className="w-8 h-8" />
                                      </div>
                                      <h3 className="font-bold text-white mb-1">{cred.title}</h3>
                                      <p className="text-sm text-slate-400 mb-4">{cred.issuer}</p>
                                      
                                      <div className="mt-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                                          <ShieldCheck className="w-3 h-3" /> Verified {cred.year}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

          </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-600 shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Video className="w-5 h-5 text-brand-blue" /> Book Consultation
                      </h3>
                      <button onClick={() => setShowBooking(false)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                      <p className="text-sm text-slate-400 mb-4">Select a session type to schedule with <span className="text-white font-bold">{expert.name}</span>.</p>
                      
                      {consultations.map(consult => (
                          <div key={consult.id} className="border border-dark-600 rounded-xl p-4 hover:border-brand-blue hover:bg-dark-700/30 transition-all cursor-pointer group">
                              <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-white group-hover:text-brand-blue transition-colors">{consult.title}</h4>
                                  <span className="text-white font-bold">${consult.price}</span>
                              </div>
                              <p className="text-xs text-slate-400 mb-3">{consult.description}</p>
                              <div className="flex items-center text-xs text-slate-500 gap-3">
                                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {consult.duration}</span>
                                  <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Zoom</span>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="p-4 border-t border-dark-700 bg-dark-900 text-center">
                      <button onClick={() => setShowBooking(false)} className="text-sm text-slate-500 hover:text-white">Cancel</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
