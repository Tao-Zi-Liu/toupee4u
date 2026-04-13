import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, Activity, Shield, ArrowRight,
  Youtube, TrendingUp, Cpu, Database, Globe,
  AlertCircle, Zap, Rocket, Loader, RefreshCw,
  Newspaper, Video, Star, MessageSquare, BookMarked
} from 'lucide-react';
import { collection, getCountFromServer, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalExperts: number;
  publishedNews: number;
  publishedVideos: number;
  kbArticles: number;
}

interface RecentActivity {
  event: string;
  time: string;
  type: 'user' | 'news' | 'video' | 'expert' | 'system';
  createdAt: any;
}

const TYPE_CONFIG = {
  user:   { icon: Users,     color: 'text-brand-blue' },
  news:   { icon: Newspaper, color: 'text-emerald-400' },
  video:  { icon: Video,     color: 'text-red-400' },
  expert: { icon: Star,      color: 'text-amber-400' },
  system: { icon: Cpu,       color: 'text-brand-purple' },
};

const formatTimeAgo = (ts: any): string => {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch { return '—'; }
};

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, totalPosts: 0, totalExperts: 0,
    publishedNews: 0, publishedVideos: 0, kbArticles: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // 并行获取所有统计数据
      const [
        usersSnap, postsSnap, expertsSnap,
        newsSnap, videosSnap,
        recentUsers, recentNews, recentVideos
      ] = await Promise.all([
        getCountFromServer(collection(db, 'users')),
        getCountFromServer(collection(db, 'posts')),
        getCountFromServer(query(collection(db, 'users'), where('isExpert', '==', true))),
        getCountFromServer(query(collection(db, 'newsArticles'), where('status', '==', 'PUBLISHED'))),
        getCountFromServer(query(collection(db, 'videos'), where('status', '==', 'PUBLISHED'))),
        // Recent activities
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(3))),
        getDocs(query(collection(db, 'newsArticles'), orderBy('createdAt', 'desc'), limit(2))),
        getDocs(query(collection(db, 'videos'), orderBy('createdAt', 'desc'), limit(2))),
      ]);

      setStats({
        totalUsers:     usersSnap.data().count,
        totalPosts:     postsSnap.data().count,
        totalExperts:   expertsSnap.data().count,
        publishedNews:  newsSnap.data().count,
        publishedVideos: videosSnap.data().count,
        kbArticles:     0, // KB uses local data context
      });

      // 组合最近活动
      const acts: RecentActivity[] = [];
      recentUsers.docs.forEach(d => {
        const data = d.data();
        acts.push({
          event: `New user joined: ${data.displayName || 'Unknown'}`,
          time: formatTimeAgo(data.createdAt),
          type: 'user',
          createdAt: data.createdAt,
        });
      });
      recentNews.docs.forEach(d => {
        const data = d.data();
        acts.push({
          event: `News: ${data.title?.slice(0, 40) || 'Untitled'}${data.title?.length > 40 ? '...' : ''}`,
          time: formatTimeAgo(data.createdAt),
          type: 'news',
          createdAt: data.createdAt,
        });
      });
      recentVideos.docs.forEach(d => {
        const data = d.data();
        acts.push({
          event: `Video added: ${data.title?.slice(0, 35) || 'Untitled'}${data.title?.length > 35 ? '...' : ''}`,
          time: formatTimeAgo(data.createdAt),
          type: 'video',
          createdAt: data.createdAt,
        });
      });

      // 按时间排序
      acts.sort((a, b) => {
        const at = a.createdAt?.seconds || 0;
        const bt = b.createdAt?.seconds || 0;
        return bt - at;
      });

      setActivities(acts.slice(0, 6));
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const StatCard = ({ icon: Icon, label, value, color, sub }: any) => (
    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col justify-between relative overflow-hidden group hover:border-dark-600 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-')}/10 ${color} ring-1 ring-inset ring-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" /> {sub}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        {loading
          ? <div className="h-8 w-16 bg-dark-700 rounded animate-pulse" />
          : <h3 className="text-3xl font-bold text-white tracking-tight">{value.toLocaleString()}</h3>
        }
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dark-700 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
              <Shield className="w-5 h-5 text-brand-blue" />
            </div>
            <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest">System Directorate</h4>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Operation Command</h1>
        </div>
        <button onClick={load} disabled={loading}
          className="p-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-xl transition-all">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={Users}     label="Total Users"    value={stats.totalUsers}     color="text-brand-blue"   />
        <StatCard icon={MessageSquare} label="Posts"      value={stats.totalPosts}     color="text-brand-purple" />
        <StatCard icon={Star}      label="Experts"        value={stats.totalExperts}   color="text-amber-400"    />
        <StatCard icon={Newspaper} label="News Published" value={stats.publishedNews}  color="text-emerald-400"  />
        <StatCard icon={Video}     label="Videos"         value={stats.publishedVideos} color="text-red-400"     />
        <StatCard icon={Cpu}       label="AI Insights"    value="∞"                    color="text-cyan-400"     />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Zap className="w-64 h-64 text-brand-blue" />
            </div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-blue" /> Core Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { to: '/admin/users',    icon: Users,     color: 'brand-blue',   title: 'User Registry',     desc: 'Manage all registered users and permissions.' },
                { to: '/admin/experts',  icon: Shield,    color: 'brand-purple', title: 'Expert Directorate', desc: 'Manage verification status and credentials.' },
                { to: '/admin/articles', icon: FileText,  color: 'cyan-500',     title: 'Knowledge CMS',     desc: 'Direct access to KB categories and articles.' },
                { to: '/admin/news',     icon: Newspaper, color: 'emerald-500',  title: 'News Desk',         desc: 'Review and publish AI-generated news.' },
                { to: '/admin/videos',   icon: Video,     color: 'red-500',      title: 'Video Desk',        desc: 'Manage multi-platform video content.' },
                { to: '/admin/youtube-crawler', icon: Youtube, color: 'red-400', title: 'Signal Synthesis',  desc: 'Convert YouTube signals into KB assets.' },
                { to: '/admin/digest',   icon: BookMarked, color: 'purple-400', title: 'Monthly Digest',    desc: 'Generate and manage monthly industry digests.' },
              ].map(({ to, icon: Icon, color, title, desc }) => (
                <Link key={to} to={to}
                  className={`group p-5 bg-dark-900 border border-dark-700 rounded-2xl hover:border-${color} hover:bg-dark-900/50 transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 bg-${color}/10 text-${color} rounded-xl ring-1 ring-${color}/20`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className={`w-4 h-4 text-slate-600 group-hover:text-${color} transition-all group-hover:translate-x-1`} />
                  </div>
                  <h4 className={`font-bold text-white group-hover:text-${color} transition-colors`}>{title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Activity + Globe */}
        <div className="space-y-6">
          <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" /> Recent Activity
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 bg-dark-700 rounded animate-pulse" />
                ))}
              </div>
            ) : activities.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">No recent activity.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((act, i) => {
                  const cfg = TYPE_CONFIG[act.type];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex items-start justify-between gap-2 text-xs border-b border-dark-700/50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start gap-2 min-w-0">
                        <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                        <span className="text-slate-300 font-medium leading-snug">{act.event}</span>
                      </div>
                      <span className="text-slate-500 font-mono whitespace-nowrap flex-shrink-0">{act.time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-2xl border border-brand-blue/30 p-6 shadow-xl flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-dark-900 rounded-xl flex items-center justify-center border border-brand-blue/30 mb-4 shadow-lg">
              <Globe className="w-6 h-6 text-brand-blue" />
            </div>
            <h3 className="font-bold text-white mb-1">Firebase Hosting</h3>
            <p className="text-xs text-slate-400 mb-4 px-2">Platform is live on Firebase global CDN.</p>
            <a href="https://toupee4u-1bcab.web.app" target="_blank" rel="noopener noreferrer"
              className="w-full py-2 bg-dark-900 border border-brand-blue/20 text-brand-blue text-xs font-bold rounded-lg hover:bg-brand-blue/10 transition-colors">
              Open Live Site ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
