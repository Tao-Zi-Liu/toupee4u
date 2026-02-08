// pages/ForYouPage.tsx
// "For You" 个性化推荐页面

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-brand-blue" />
          For You
        </h1>
        <p className="text-slate-400 mt-2">
          Personalized content based on your profile and interests
        </p>
      </div>
      
      <PersonalizedDashboard
        experienceLevel={userProfile.voyagerProfile.experienceLevel!}
        activityLevel={userProfile.voyagerProfile.activityLevel!}
      />
    </div>
  );
};