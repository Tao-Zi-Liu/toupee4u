
import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Video, 
  ArrowLeft, 
  FlaskConical,
  Award, 
  Instagram, 
  Facebook, 
  Youtube, 
  Linkedin, 
  Twitter,
  MapPin, 
  Link as LucideLink, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  ThumbsUp, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  X
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

  const expertTopics = categories.flatMap(c => c.topics).slice(0, 3);

  const REVIEWS = [
      { id: 1, user: "Michael T.", avatar: "MT", color: "bg-blue-500", rating: 5, date: "2 weeks ago", comment: `Helpful expert.` },
      { id: 2, user: "Sarah J.", avatar: "SJ", color: "bg-pink-500", rating: 5, date: "1 month ago", comment: "Great technique." }
  ];

  const CREDENTIALS = [
      { id: 1, title: "Board Certification", issuer: "American Board of Dermatology", year: "2015", verified: true },
      { id: 2, title: "PhD in Chemical Engineering", issuer: "MIT", year: "2012", verified: true }
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
        default: return 'text-slate-300';
      }
  };

  const renderExpertiseTags = () => {
    const tags = [];
    for (let i = 0; i < expert.specialties.length; i++) {
      tags.push(
        <span key={i} className="px-3 py-1.5 rounded-lg bg-dark-900 border border-dark-600 text-slate-300 text-xs font-bold">
          {expert.specialties[i]}
        </span>
      );
    }
    return tags;
  };

  const renderResearchPosts = () => {
    const posts = [];
    for (let i = 0; i < expertTopics.length; i++) {
      const topic = expertTopics[i];
      posts.push(
        <div key={topic.id} className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-lg hover:border-dark-500 transition-colors">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                    <img src={expert.image} alt={expert.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <h4 className="font-bold text-white text-sm">{expert.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="w-3 h-3" /> {i + 1} days ago</div>
                    </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{topic.title}</h4>
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">{topic.description.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                <div className="flex items-center justify-between pt-2 border-t border-dark-700/50">
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-brand-blue"><ThumbsUp className="w-4 h-4" /> Like</button>
                        <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white"><MessageCircle className="w-4 h-4" /> Comment</button>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500"><BookOpen className="w-3 h-3" /> {topic.articles.length} sub-modules</div>
                </div>
            </div>
        </div>
      );
    }
    return posts;
  };

  const renderReviews = () => {
    const list = [];
    for (let i = 0; i < REVIEWS.length; i++) {
      const r = REVIEWS[i];
      list.push(
        <div key={r.id} className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${r.color}`}>{r.avatar}</div>
                    <div>
                        <div className="font-bold text-white text-sm">{r.user}</div>
                        <div className="text-xs text-slate-500">{r.date}</div>
                    </div>
                </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">"{r.comment}"</p>
        </div>
      );
    }
    return list;
  };

  const renderCredentials = () => {
    const list = [];
    for (let i = 0; i < CREDENTIALS.length; i++) {
      const cred = CREDENTIALS[i];
      list.push(
        <div key={cred.id} className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-lg h-full flex flex-col items-center text-center">
            <Award className="w-8 h-8 text-brand-blue mb-4" />
            <h3 className="font-bold text-white mb-1">{cred.title}</h3>
            <p className="text-sm text-slate-300 mb-4">{cred.issuer}</p>
            <div className="mt-auto flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Verified {cred.year}
            </div>
        </div>
      );
    }
    return list;
  };

  const renderConsultations = () => {
    const list = [];
    for (let i = 0; i < consultations.length; i++) {
      const consult = consultations[i];
      list.push(
        <div key={consult.id} className="border border-dark-600 rounded-xl p-4 hover:border-brand-blue hover:bg-dark-700/30 transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-white group-hover:text-brand-blue">{consult.title}</h4>
                <span className="text-white font-bold">${consult.price}</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">{consult.description}</p>
            <div className="flex items-center text-xs text-slate-500 gap-3">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {consult.duration}</span>
                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> Zoom</span>
            </div>
        </div>
      );
    }
    return list;
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      <div className="mb-4">
        <Link to="/experts" className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium"><ArrowLeft className="w-4 h-4" /> Back to Directory</Link>
      </div>
      <div className="bg-dark-800 rounded-b-3xl border border-dark-700 shadow-2xl overflow-hidden mb-6 relative">
          <div className={`h-64 md:h-80 w-full bg-gradient-to-r ${getThemeGradient(expert.colorTheme)} relative`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          </div>
          <div className="px-6 md:px-10 pb-6 relative">
              <div className="flex flex-col md:flex-row items-start">
                  <div className="-mt-20 md:-mt-24 relative mb-4 md:mb-0 mr-0 md:mr-8 flex-shrink-0 mx-auto md:mx-0">
                      <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-dark-800 relative z-20">
                          <img src={expert.image} alt={expert.name} className="w-full h-full rounded-full object-cover border-4 border-dark-700 bg-dark-900" />
                          <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full border-4 border-dark-800 ${expert.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                  </div>
                  <div className="flex-1 pt-4 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                          <div>
                              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">{expert.name} <CheckCircle className="w-6 h-6 text-brand-blue fill-current text-white bg-white rounded-full" /></h1>
                              <p className={`text-lg font-medium mt-1 ${getThemeColor(expert.colorTheme)}`}>{expert.role}</p>
                              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-slate-300 text-sm">
                                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-current" /><span className="font-bold text-white">{expert.stats.rating}</span> Rating</span>
                                  <span className="hidden md:inline">•</span>
                                  <span>{expert.stats.consultations} Consultations</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <button onClick={() => setShowBooking(true)} className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"><Video className="w-4 h-4" /> Book Now</button>
                              <button className="px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-slate-200 font-bold rounded-lg border border-dark-600"><MessageCircle className="w-4 h-4" /></button>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="mt-8 border-t border-dark-700 pt-1">
                  <div className="flex gap-1 overflow-x-auto">
                      <button onClick={() => setActiveTab('posts')} className={`px-4 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'posts' ? 'text-brand-blue border-brand-blue' : 'text-slate-300 border-transparent'}`}>Posts & Research</button>
                      <button onClick={() => setActiveTab('about')} className={`px-4 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'about' ? 'text-brand-blue border-brand-blue' : 'text-slate-300 border-transparent'}`}>About</button>
                      <button onClick={() => setActiveTab('reviews')} className={`px-4 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'reviews' ? 'text-brand-blue border-brand-blue' : 'text-slate-300 border-transparent'}`}>Reviews</button>
                      <button onClick={() => setActiveTab('credentials')} className={`px-4 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'credentials' ? 'text-brand-blue border-brand-blue' : 'text-slate-300 border-transparent'}`}>Credentials</button>
                  </div>
              </div>
          </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Intro</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex items-center gap-3 text-slate-300"><FlaskConical className="w-5 h-5 text-slate-500" /><span>Specializes in <strong className="text-white">{expert.role}</strong></span></div>
                      <div className="flex items-center gap-3 text-slate-300"><Calendar className="w-5 h-5 text-slate-500" /><span>Active since <strong>2015</strong></span></div>
                      <div className="flex items-center gap-3 text-slate-300"><MapPin className="w-5 h-5 text-slate-500" /><span>Based in <strong>New York, NY</strong></span></div>
                  </div>
              </div>
              <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 shadow-lg">
                  <h3 className="text-lg font-bold text-white mb-4">Expertise</h3>
                  <div className="flex flex-wrap gap-2">{renderExpertiseTags()}</div>
              </div>
          </div>
          <div className="lg:col-span-3 space-y-6">
              {activeTab === 'posts' && renderResearchPosts()}
              {activeTab === 'about' && (
                  <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 shadow-lg">
                      <h2 className="text-2xl font-bold text-white mb-6">About {expert.name}</h2>
                      <div className="prose prose-invert max-w-none"><p className="text-slate-300 leading-relaxed mb-6">{expert.bio}</p></div>
                  </div>
              )}
              {activeTab === 'reviews' && renderReviews()}
              {activeTab === 'credentials' && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderCredentials()}</div>}
          </div>
      </div>
      {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-dark-800 w-full max-w-lg rounded-2xl border border-dark-600 shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Video className="w-5 h-5 text-brand-blue" /> Book Consultation</h3>
                      <button onClick={() => setShowBooking(false)} className="text-slate-300 hover:text-white"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">{renderConsultations()}</div>
              </div>
          </div>
      )}
    </div>
  );
};
