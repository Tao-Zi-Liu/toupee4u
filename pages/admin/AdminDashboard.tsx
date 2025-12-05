import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';
import { Users, FileText, Activity, Shield, Settings, ArrowRight, Youtube } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { experts, categories, consultations } = useData();
  const navigate = useNavigate();

  const totalArticles = categories.reduce((acc, cat) => {
    return acc + cat.topics.reduce((tAcc, topic) => tAcc + topic.articles.length, 0);
  }, 0);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-dark-700 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Backoffice</h1>
           <p className="text-slate-400">Manage content, experts, and platform settings.</p>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                System Active
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Active Experts" value={experts.length} color="text-brand-blue" />
        <StatCard icon={FileText} label="KB Articles" value={totalArticles} color="text-brand-purple" />
        <StatCard icon={Activity} label="Consultations" value={consultations.length} color="text-yellow-500" />
        <StatCard icon={Shield} label="Admin Users" value="1" color="text-slate-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6">
           <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
           <div className="space-y-4">
              <Link to="/admin/experts" className="block p-4 bg-dark-900 border border-dark-600 rounded-xl hover:border-brand-blue transition-colors group">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-white group-hover:text-brand-blue transition-colors">Manage Experts</div>
                            <div className="text-xs text-slate-500">Add, remove, or edit profiles</div>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
                 </div>
              </Link>
              
              <Link to="/admin/articles" className="block p-4 bg-dark-900 border border-dark-600 rounded-xl hover:border-brand-purple transition-colors group">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-white group-hover:text-brand-purple transition-colors">Manage Articles</div>
                            <div className="text-xs text-slate-500">CMS for Knowledge Base Content</div>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
                 </div>
              </Link>

              <Link to="/admin/youtube-crawler" className="block p-4 bg-dark-900 border border-dark-600 rounded-xl hover:border-red-500 transition-colors group">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                            <Youtube className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-white group-hover:text-red-500 transition-colors">Video-to-Knowledge</div>
                            <div className="text-xs text-slate-500">Crawl YouTube & Synthesize Articles</div>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
                 </div>
              </Link>
           </div>
        </div>

        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center border border-dark-600 mb-4">
                <Settings className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="font-bold text-white mb-2">Platform Configuration</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
                Global settings for the "Physics of Hair" algorithm and Truth Engine AI prompts.
            </p>
            <button 
                onClick={() => navigate('/admin/settings')}
                className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white font-medium rounded-lg transition-colors border border-dark-600 hover:border-slate-500"
            >
                Open Settings
            </button>
        </div>
      </div>
    </div>
  );
};