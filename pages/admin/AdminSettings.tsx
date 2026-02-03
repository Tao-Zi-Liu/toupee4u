import React, { useState } from 'react';
import { Save, RefreshCw, Database, Terminal } from 'lucide-react';
import { Shield, Power } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [siteName, setSiteName] = useState('Toupee4U');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(`You are the "Toupee4U Truth Engine", an expert AI consultant for men's hair replacement systems. Your goal is to provide unbiased, scientific, and actionable advice.`);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        alert('Settings saved successfully.');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
         <h1 className="text-2xl font-bold text-white mb-2">Platform Configuration</h1>
         <p className="text-slate-300">Global system settings and AI parameter tuning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="space-y-6">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                    <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">General Parameters</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform Name</label>
                        <input 
                            type="text" 
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3 text-white focus:border-brand-blue outline-none"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-dark-900 p-4 rounded-xl border border-dark-600">
                        <div>
                            <div className="font-bold text-white flex items-center gap-2">
                                <Power className="w-4 h-4" /> Maintenance Mode
                            </div>
                            <div className="text-xs text-slate-500 mt-1">Disables public access for updates</div>
                        </div>
                        <button 
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-500' : 'bg-dark-700'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl">
                 <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                        <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Cache & Data</h2>
                </div>
                
                <div className="space-y-3">
                    <button className="w-full py-3 bg-dark-900 border border-dark-600 hover:bg-dark-700 text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <RefreshCw className="w-4 h-4" /> Clear System Cache
                    </button>
                    <button className="w-full py-3 bg-dark-900 border border-dark-600 hover:bg-dark-700 text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <Shield className="w-4 h-4" /> Rotate API Keys
                    </button>
                </div>
            </div>
        </div>

        {/* AI Configuration */}
        <div className="bg-dark-800 rounded-2xl border border-dark-700 p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
                <div className="p-2 bg-brand-purple/10 rounded-lg text-brand-purple">
                    <Database className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Truth Engine (AI) Config</h2>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">System Instruction Prompt</label>
                    <textarea 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full flex-1 min-h-[300px] bg-dark-900 border border-dark-600 rounded-xl p-4 text-white font-mono text-sm leading-relaxed focus:border-brand-purple outline-none resize-none"
                    ></textarea>
                    <p className="text-xs text-slate-500 mt-2">
                        *Changes to this prompt affect the persona of the AI Assistant immediately.
                    </p>
                </div>
            </div>
        </div>

      </div>

      <div className="flex justify-end pt-6 border-t border-dark-700">
        <button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
        </button>
      </div>
    </div>
  );
};