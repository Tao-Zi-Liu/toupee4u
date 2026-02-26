// pages/ForYouPage.tsx
// "For You" 个性化推荐页面

import { CommunityWidget } from '../components/CommunityWidget';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader, Users, MessageSquare, BookOpen } from 'lucide-react';
import { PersonalizedDashboard } from '../components/PersonalizedDashboard';
import { getCurrentUser, getCompleteUserProfile } from '../services/auth.service';
import { CompleteUserProfile } from '../types';

export const ForYouPage: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<CompleteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const user = getCurrentUser();
      if (user) {
        const profile = await getCompleteUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        // 未登录，重定向到登录页
        navigate('/login');
      }
      setLoading(false);
    }
    loadProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading your personalized feed...</span>
        </div>
      </div>
    );
  }

  // 如果不是Voyager或未完成Quiz
  if (userProfile?.role !== 'VOYAGER' || !userProfile?.voyagerProfile?.quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-blue/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Unlock Your Personalized Experience
        </h2>
        <p className="text-lg text-slate-400 mb-8">
          Take our quick 4-step quiz to get content tailored specifically to your needs and experience level.
        </p>
        <button 
          onClick={() => navigate('/onboarding/voyager-quiz')}
          className="px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-all text-lg"
        >
          Start Personalization Quiz
        </button>
        
        <div className="mt-12 p-6 bg-dark-800 border border-dark-700 rounded-xl text-left">
          <h3 className="text-lg font-bold text-white mb-3">What you'll get:</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-brand-blue mt-1">✓</span>
              <span>Content recommendations based on your hair pattern and experience level</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-blue mt-1">✓</span>
              <span>Product suggestions matched to your lifestyle and activity level</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-blue mt-1">✓</span>
              <span>Community connections with people at the same stage as you</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-blue mt-1">✓</span>
              <span>Curated articles and tutorials that match your needs</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // 已完成Quiz，显示个性化Dashboard
  return (
  <div className="max-w-7xl mx-auto">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-brand-blue" />
        For You
      </h1>
      <p className="text-slate-400 mt-2">
        Personalized content based on your profile and interests
      </p>
    </div>
    
    <div className="grid lg:grid-cols-3 gap-6">
      {/* 主内容区 - 左侧2/3 */}
      <div className="lg:col-span-2">
        <PersonalizedDashboard
          experienceLevel={userProfile.voyagerProfile.experienceLevel!}
          activityLevel={userProfile.voyagerProfile.activityLevel!}
          hairPattern={userProfile.voyagerProfile.hairPattern}
        />
      </div>
      
      {/* 右侧栏 - 1/3 */}
      <div className="space-y-6">
        <CommunityWidget
          experienceLevel={userProfile.voyagerProfile.experienceLevel!}
          activityLevel={userProfile.voyagerProfile.activityLevel!}
          hairPattern={userProfile.voyagerProfile.hairPattern}
          showFullStats={true}
        />
      </div>
      {/* 右侧栏 - 1/3 */}
<div className="space-y-6">
  <CommunityWidget
    experienceLevel={userProfile.voyagerProfile.experienceLevel!}
    activityLevel={userProfile.voyagerProfile.activityLevel!}
    hairPattern={userProfile.voyagerProfile.hairPattern}
    showFullStats={true}
  />
  
  {/* 推荐专家 */}
  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
      <Users className="w-5 h-5 text-brand-purple" />
      Featured Experts
    </h3>
    
    <div className="space-y-3">
      {/* 专家1 */}
      <div className="flex items-center gap-3 p-3 bg-dark-900 rounded-lg hover:bg-dark-700 transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          SM
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm group-hover:text-brand-blue transition-colors truncate">
            StudioPro Mike
          </div>
          <div className="text-xs text-slate-400 truncate">
            Cut-in Specialist
          </div>
        </div>
      </div>
      
      {/* 专家2 */}
      <div className="flex items-center gap-3 p-3 bg-dark-900 rounded-lg hover:bg-dark-700 transition-all cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          JC
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm group-hover:text-brand-blue transition-colors truncate">
            Jake Chen
          </div>
          <div className="text-xs text-slate-400 truncate">
            Maintenance Expert
          </div>
        </div>
      </div>
    </div>
    
    <button
      onClick={() => navigate('/experts')}
      className="w-full mt-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-sm font-semibold rounded-lg transition-all"
    >
      View All Experts
    </button>
  </div>
  
  {/* 快速操作 */}
  <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl p-6">
    <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
    <div className="space-y-2">
      <button
        onClick={() => navigate('/forum/new')}
        className="w-full text-left px-4 py-3 bg-dark-800/50 hover:bg-dark-700 rounded-lg transition-all flex items-center gap-3 group"
      >
        <MessageSquare className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium text-slate-300 group-hover:text-white">Ask a Question</span>
      </button>
      
      <button
        onClick={() => navigate('/kb/fundamentals')}
        className="w-full text-left px-4 py-3 bg-dark-800/50 hover:bg-dark-700 rounded-lg transition-all flex items-center gap-3 group"
      >
        <BookOpen className="w-4 h-4 text-brand-purple group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium text-slate-300 group-hover:text-white">Browse Guides</span>
      </button>
    </div>
  </div>
</div>
    </div>
  </div>
);
};