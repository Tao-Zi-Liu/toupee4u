// components/CommunityWidget.tsx
// 社区统计小部件 - 显示在右侧侧边栏

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, ThumbsUp, ArrowRight } from 'lucide-react';
import { ExperienceLevel, ActivityLevel, HairPattern } from '../types';

interface CommunityWidgetProps {
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
  hairPattern?: HairPattern;
  showFullStats?: boolean; // 是否显示完整统计
}

export const CommunityWidget: React.FC<CommunityWidgetProps> = ({
  experienceLevel,
  activityLevel,
  hairPattern,
  showFullStats = true
}) => {
  const navigate = useNavigate();
  
  // 生成统计数据
  const getStats = () => {
    if (!experienceLevel) {
      // 如果没有用户数据，显示总体统计
      return {
        totalMembers: 1247,
        onlineNow: 89,
        activeToday: 234
      };
    }
    
    // 根据用户类型生成匹配的社区统计
    const baseMembers = experienceLevel === 'NEWBIE' ? 127 : 89;
    const onlineNow = Math.floor(baseMembers * 0.18);
    
    return {
      totalMembers: baseMembers,
      onlineNow: onlineNow,
      activeToday: Math.floor(baseMembers * 0.35)
    };
  };
  
  const stats = getStats();
  
  // 用户标签（只有登录且完成Quiz才显示）
  const getUserTags = () => {
    if (!experienceLevel || !activityLevel) return null;
    
    return [
      hairPattern === 'FRONTAL_RECEDING' ? 'Frontal receding' :
      hairPattern === 'VERTEX' ? 'Vertex thinning' :
      hairPattern === 'FULL' ? 'Full coverage' :
      hairPattern === 'DIFFUSE' ? 'Diffuse thinning' : 'Hair restoration',
      
      experienceLevel === 'NEWBIE' ? 'New to systems' : 'Experienced user',
      
      activityLevel === 'HIGH' ? 'High intensity' :
      activityLevel === 'MEDIUM' ? 'Moderate activity' :
      'Low activity'
    ];
  };
  
  const userTags = getUserTags();
  
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-brand-blue" />
        <h3 className="text-lg font-bold text-white">
          {userTags ? 'Your Community' : 'Community'}
        </h3>
      </div>
      
      {/* 在线统计 */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-dark-700">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            </div>
            <div className="text-xl font-bold text-white">{stats.onlineNow}</div>
          </div>
          <div className="text-xs text-slate-500 font-medium">online now</div>
        </div>
        
        {showFullStats && (
          <>
            <div className="h-10 w-px bg-dark-700"></div>
            
            <div className="flex-1">
              <div className="text-xl font-bold text-white mb-1">{stats.activeToday}</div>
              <div className="text-xs text-slate-500 font-medium">active today</div>
            </div>
          </>
        )}
      </div>
      
      {/* 个性化标签 - 只对完成Quiz的用户显示 */}
      {userTags && (
        <div className="p-3 bg-dark-900 rounded-lg mb-4">
          <div className="text-xs text-slate-400 mb-2 font-medium">
            <span className="text-white font-bold">{stats.totalMembers}</span> members like you:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {userTags.map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  index === 0 ? 'bg-blue-500/20 text-blue-400' :
                  index === 1 ? 'bg-purple-500/20 text-purple-400' :
                  'bg-green-500/20 text-green-400'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 活动统计 */}
      {showFullStats && (
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span><span className="text-white font-semibold">18</span> discussions this week</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ThumbsUp className="w-3.5 h-3.5 flex-shrink-0" />
            <span><span className="text-white font-semibold">234</span> helpful answers</span>
          </div>
        </div>
      )}
      
      {/* CTA按钮 */}
      <button
        onClick={() => navigate('/forum')}
        className="w-full py-2.5 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
      >
        <span>{userTags ? 'Join Your Community' : 'Explore Community'}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};