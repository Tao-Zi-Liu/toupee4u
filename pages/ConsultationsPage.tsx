import React from 'react';
import { CONSULTATIONS } from '../constants';
import { Video, Clock, Calendar, CheckCircle, ArrowRight, ShieldAlert, Zap, Scissors } from 'lucide-react';

export const ConsultationsPage: React.FC = () => {

  const getIcon = (id: string) => {
    switch(id) {
      case 'emergency': return <ShieldAlert className="w-6 h-6" />;
      case 'style': return <Scissors className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const getColor = (id: string) => {
    switch(id) {
      case 'emergency': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'style': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-brand-blue bg-brand-blue/10 border-brand-blue/20';
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-dark-600 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            <Video className="w-4 h-4 text-brand-blue" />
            Live 1-on-1 Strategy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Tactical Analysis & <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Expert Support</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
             The internet is full of conflicting advice. Skip the noise. Get a customized engineering protocol for your specific hair density, skin chemistry, and lifestyle goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
             <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Private</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>24hr Availability</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Money-back Guarantee</span>
             </div>
          </div>
        </div>
        
        {/* Abstract Visual */}
        <div className="relative w-full md:w-1/3 aspect-square max-w-sm">
           <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-brand-purple/20 rounded-full blur-3xl animate-pulse"></div>
           <div className="relative h-full w-full bg-dark-900 rounded-2xl border border-dark-700 p-6 flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="w-20 h-20 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center mb-4">
                 <Calendar className="w-10 h-10 text-slate-400" />
              </div>
              <div className="text-center">
                 <div className="text-2xl font-bold text-white mb-1">Next Opening</div>
                 <div className="text-brand-blue font-mono">Today, 4:00 PM</div>
              </div>
           </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONSULTATIONS.map((consult) => (
          <div key={consult.id} className="group relative bg-dark-800 rounded-2xl border border-dark-700 hover:border-dark-500 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl">
            {/* Top Highlight Line */}
            <div className={`h-1 w-full bg-gradient-to-r ${consult.id === 'emergency' ? 'from-red-500 to-orange-500' : consult.id === 'style' ? 'from-purple-500 to-pink-500' : 'from-brand-blue to-cyan-500'}`}></div>
            
            <div className="p-8 flex-1 flex flex-col">
               <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl ${getColor(consult.id)}`}>
                     {getIcon(consult.id)}
                  </div>
                  <div className="text-right">
                     <div className="text-2xl font-bold text-white">${consult.price}</div>
                     <div className="text-xs text-slate-500">USD / Session</div>
                  </div>
               </div>

               <h3 className="text-xl font-bold text-white mb-2">{consult.title}</h3>
               <div className="inline-flex mb-4">
                 <span className="text-xs font-bold uppercase tracking-wider text-slate-500 border border-dark-600 px-2 py-1 rounded bg-dark-900">
                   For: {consult.targetAudience}
                 </span>
               </div>
               
               <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                 {consult.description}
               </p>

               <div className="space-y-3 mb-8">
                  <div className="flex items-center text-sm text-slate-300">
                     <Clock className="w-4 h-4 mr-3 text-slate-500" />
                     {consult.duration} Zoom Video Call
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                     <Video className="w-4 h-4 mr-3 text-slate-500" />
                     Recording Provided
                  </div>
               </div>

               <button className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${consult.id === 'emergency' ? 'bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20' : 'bg-brand-blue hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}>
                 Book Session <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="bg-dark-900/50 rounded-2xl border border-dark-700 p-8 md:p-12">
         <h2 className="text-2xl font-bold text-white mb-8 text-center">Protocol Sequence</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-dark-600 to-transparent z-0"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-dark-900 shadow-xl flex items-center justify-center mb-4 text-2xl font-bold text-slate-700">1</div>
               <h3 className="text-lg font-bold text-white mb-2">Select Vector</h3>
               <p className="text-sm text-slate-400">Choose your consultation type and pick a time slot that fits your schedule.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-dark-900 shadow-xl flex items-center justify-center mb-4 text-2xl font-bold text-brand-blue">2</div>
               <h3 className="text-lg font-bold text-white mb-2">Upload Data</h3>
               <p className="text-sm text-slate-400">Securely upload photos of your current hair situation and any inspiration pics.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-dark-900 shadow-xl flex items-center justify-center mb-4 text-2xl font-bold text-white">3</div>
               <h3 className="text-lg font-bold text-white mb-2">Execute</h3>
               <p className="text-sm text-slate-400">Join the Zoom link. Receive your custom PDF action plan immediately after.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
