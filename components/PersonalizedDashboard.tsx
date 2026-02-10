
// components/PersonalizedDashboard.tsx
// 个性化Dashboard组件

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Users } from 'lucide-react';
import { ExperienceLevel, ActivityLevel, HairPattern } from '../types';
import { getDashboardConfig, DashboardConfig } from '../config/dashboardContent';

/* FIX: Added hairPattern to interface to resolve prop mismatch error in ForYouPage.tsx */
interface PersonalizedDashboardProps {
  experienceLevel: ExperienceLevel;
  activityLevel: ActivityLevel;
  hairPattern?: HairPattern;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  experienceLevel,
  activityLevel
}) => {
  const navigate = useNavigate();
  /* FIX: Explicitly type config as DashboardConfig to resolve specialBanner property errors */
  const config: DashboardConfig = getDashboardConfig(experienceLevel, activityLevel);

  return (
    <div className="space-y-6">
      
      {/* Main Banner */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.banner.bgGradient} p-8 border border-white/10`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{config.banner.icon}</span>
            <h2 className="text-3xl font-bold text-white">
              {config.banner.title}
            </h2>
          </div>
          <p className="text-lg text-white/80 mb-6 max-w-2xl">
            {config.banner.description}
          </p>
          <button
            onClick={() => navigate(config.banner.ctaLink)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            {config.banner.ctaText}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Special Banner for High Activity Users */}
      {/* FIX: Now safely accessible thanks to DashboardConfig type */}
      {config.specialBanner && (
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${config.specialBanner.bgGradient} p-6 border border-white/10`}>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{config.specialBanner.icon}</span>
                <h3 className="text-xl font-bold text-white">
                  {config.specialBanner.title}
                </h3>
              </div>
              <p className="text-white/80 mb-4">
                {config.specialBanner.description}
              </p>
            </div>
            <button
              onClick={() => navigate(config.specialBanner.ctaLink)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-lg transition-all whitespace-nowrap backdrop-blur-sm"
            >
              {config.specialBanner.ctaText}
            </button>
          </div>
        </div>
      )}

      {/* Featured Articles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-brand-blue" />
          <h3 className="text-xl font-bold text-white">Recommended for You</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {config.featuredArticles.map((article) => (
            <button
              key={article.id}
              onClick={() => navigate(`/kb/article/${article.id}`)}
              className="group text-left bg-dark-800 border border-dark-700 hover:border-brand-blue rounded-xl p-5 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-brand-blue uppercase">
                  {article.category}
                </span>
                <span className="text-xs text-slate-500">• {article.readTime}</span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                {article.title}
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 text-brand-blue font-semibold text-sm">
                <span>Read more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Topics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-brand-purple" />
          <h3 className="text-xl font-bold text-white">Trending in Your Community</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {config.recommendedTopics.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => navigate(`/forum?tag=${topic.tag}`)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 ${
                topic.color === 'blue' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' :
                topic.color === 'green' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                topic.color === 'purple' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' :
                topic.color === 'red' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                topic.color === 'orange' ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' :
                topic.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' :
                'bg-slate-500/20 text-slate-400 hover:bg-slate-500/30'
              }`}
            >
              #{topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Spotlight */}
      <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-brand-purple" />
              <h3 className="text-lg font-bold text-white">
                {config.communitySpotlight.title}
              </h3>
            </div>
            <p className="text-slate-400 mb-4">
              {config.communitySpotlight.description}
            </p>
            <button
              onClick={() => navigate(config.communitySpotlight.ctaLink)}
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-blue-400 transition-colors"
            >
              {config.communitySpotlight.ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
