// pages/SelectRolePage.tsx
// 命运分岔口：用户选择角色（Voyager vs Professional）

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowRight } from 'lucide-react';

export const SelectRolePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: 'voyager' | 'professional') => {
    if (role === 'voyager') {
      // 进入Voyager Quiz流程
      navigate('/onboarding/voyager-quiz');
    } else {
      // 进入Professional认证流程
      navigate('/onboarding/professional-setup');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Path
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Tell us who you are, and we'll create the perfect experience for you.
          </p>
        </div>

        {/* 左右分屏 */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 左侧：Voyager (探索者) */}
          <button
            onClick={() => handleSelectRole('voyager')}
            className="group relative overflow-hidden rounded-3xl border-2 border-dark-700 hover:border-brand-blue bg-dark-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-blue/20"
          >
            {/* 背景图片 */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop"
                alt="Confident person"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* 悬浮图标 */}
              <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-brand-blue/20 backdrop-blur-md border border-brand-blue/30 flex items-center justify-center z-20 group-hover:bg-brand-blue group-hover:scale-110 transition-all">
                <User className="w-8 h-8 text-brand-blue group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* 文字内容 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-brand-blue transition-colors">
                I Want to Restore My Look
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Join the community, find your perfect solution, and connect with others on the same journey.
              </p>
              
              <div className="flex items-center gap-2 text-brand-blue font-bold group-hover:gap-4 transition-all">
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* 右侧：Professional (专业人士) */}
          <button
            onClick={() => handleSelectRole('professional')}
            className="group relative overflow-hidden rounded-3xl border-2 border-dark-700 hover:border-emerald-500 bg-dark-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20"
          >
            {/* 背景图片 */}
            <div className="aspect-[4/5] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=1000&fit=crop"
                alt="Professional workspace"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* 悬浮图标 */}
              <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center z-20 group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
                <Briefcase className="w-8 h-8 text-emerald-500 group-hover:text-white transition-colors" />
              </div>
            </div>

            {/* 文字内容 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-emerald-500 transition-colors">
                I am a Hair Professional
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Connect with clients, showcase your expertise, and grow your business in the industry.
              </p>
              
              <div className="flex items-center gap-2 text-emerald-500 font-bold group-hover:gap-4 transition-all">
                <span>Build Your Reputation</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

        </div>

        {/* 底部提示 */}
        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-brand-blue hover:text-blue-400 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};