
import React, { useState } from 'react';
import { FlaskConical, Droplet, Activity, Layers, ArrowRight } from 'lucide-react';
import { Zap, RefreshCw, Thermometer, Brain, Calculator, AlertTriangle, Check } from 'lucide-react';

export const LabPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'adhesive' | 'entropy' | null>('adhesive');

  return (
    <div className="space-y-8 pb-12">
      {/* Lab Header */}
      <div className="relative bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-dark-900 rounded-lg border border-dark-600 text-brand-purple shadow-inner">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-brand-purple uppercase tracking-widest">Experimental Diagnostics</h4>
           </div>
           <div className="flex items-center gap-4 mb-4">
             <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Quantum Lab</h1>
             <span className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple border border-brand-purple/30 text-xs font-bold uppercase tracking-wider">Beta</span>
           </div>
           <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
             Welcome to the engineering deck. Use these tools to calculate entropy, simulate adhesive bonds, and analyze material physics before you apply them to your scalp.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Tools Sidebar */}
         <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">Available Instruments</h3>
            
            <button 
              onClick={() => setActiveTool('adhesive')}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                activeTool === 'adhesive' 
                ? 'bg-dark-800 border-brand-blue shadow-lg shadow-brand-blue/10' 
                : 'bg-dark-900 border-dark-700 hover:bg-dark-800 hover:border-slate-600'
              }`}
            >
               <div className={`p-2 rounded-lg ${activeTool === 'adhesive' ? 'bg-brand-blue text-white' : 'bg-dark-800 text-slate-300 group-hover:text-white'}`}>
                  <Droplet className="w-5 h-5" />
               </div>
               <div>
                  <h4 className={`font-bold ${activeTool === 'adhesive' ? 'text-white' : 'text-slate-300'}`}>Bond Logic Engine</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Adhesive compatibility solver</p>
               </div>
               {activeTool === 'adhesive' && <ArrowRight className="w-4 h-4 text-brand-blue ml-auto" />}
            </button>

            <button 
              onClick={() => setActiveTool('entropy')}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                activeTool === 'entropy' 
                ? 'bg-dark-800 border-brand-purple shadow-lg shadow-brand-purple/10' 
                : 'bg-dark-900 border-dark-700 hover:bg-dark-800 hover:border-slate-600'
              }`}
            >
               <div className={`p-2 rounded-lg ${activeTool === 'entropy' ? 'bg-brand-purple text-white' : 'bg-dark-800 text-slate-300 group-hover:text-white'}`}>
                  <Calculator className="w-5 h-5" />
               </div>
               <div>
                  <h4 className={`font-bold ${activeTool === 'entropy' ? 'text-white' : 'text-slate-300'}`}>Entropy Calculator</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Lifespan estimation model</p>
               </div>
               {activeTool === 'entropy' && <ArrowRight className="w-4 h-4 text-brand-purple ml-auto" />}
            </button>

             <button className="w-full text-left p-4 rounded-xl border border-dark-700 bg-dark-900 opacity-60 cursor-not-allowed flex items-center gap-4">
               <div className="p-2 rounded-lg bg-dark-800 text-slate-600">
                  <Brain className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-500">AI Spectrometry</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Color match via camera (Beta)</p>
               </div>
               <span className="ml-auto text-[10px] font-bold bg-dark-800 text-slate-500 px-2 py-1 rounded">WIP</span>
            </button>
         </div>

         {/* Main Workspace */}
         <div className="lg:col-span-2">
            {activeTool === 'adhesive' && <AdhesiveTool />}
            {activeTool === 'entropy' && <EntropyTool />}
         </div>
      </div>
    </div>
  );
};

// --- Sub-Components (Tools) ---

const AdhesiveTool: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ base: '', skin: '', time: '' });

  const reset = () => {
    setStep(1);
    setSelections({ base: '', skin: '', time: '' });
  };

  const getRecommendation = () => {
    const { base, skin, time } = selections;
    if (base === 'Poly' && time === '4+ Weeks') return { name: "Walker Ultra Hold (Acrylic)", desc: "The nuclear option. Only for Poly/Skin units. Do not apply directly to lace.", warn: "High irritation risk." };
    if (skin === 'Oily' && time === 'Daily') return { name: "Got2B Glued (Styling Gel)", desc: "Not a real adhesive, but strong enough for daily wearers who remove at night.", warn: "Water soluble." };
    if (base === 'Lace' && skin === 'Oily') return { name: "Ghost Bond Platinum", desc: "Formulated with higher heat resistance for oily scalps. Water-based safe for lace.", warn: "Requires 4 thin layers." };
    if (base === 'Lace' && skin === 'Dry') return { name: "Ghost Bond Classic", desc: "Standard water-based bond. Gentler on dry skin than Platinum.", warn: "Allow 7 mins cure time." };
    return { name: "Davlyn Green (Tape)", desc: "A balanced choice for standard wear. Easier cleanup than liquid glue.", warn: "Visible thickness on hairline." };
  };

  const result = getRecommendation();

  return (
    <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 shadow-2xl relative overflow-hidden">
       {/* UI Decor */}
       <div className="absolute top-0 right-0 p-6 opacity-5">
          <Droplet className="w-48 h-48 text-brand-blue" />
       </div>

       <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold text-white">Bond Logic Engine</h2>
             <button onClick={reset} className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:text-white transition-colors">
                <RefreshCw className="w-3 h-3" /> RESET
             </button>
          </div>

          {step === 1 && (
             <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-medium text-slate-300">Variable 1: Base Material</h3>
                <div className="grid grid-cols-2 gap-4">
                   {['Lace', 'Poly', 'Mono'].map(opt => (
                      <button key={opt} onClick={() => { setSelections({...selections, base: opt}); setStep(2); }} className="p-4 rounded-xl border border-dark-600 bg-dark-900 hover:border-brand-blue hover:bg-dark-800 transition-all text-left group">
                         <span className="font-bold text-white block mb-1 group-hover:text-brand-blue">{opt}</span>
                         <span className="text-xs text-slate-500">Structural composition</span>
                      </button>
                   ))}
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-medium text-slate-300">Variable 2: Skin Chemistry</h3>
                <div className="grid grid-cols-2 gap-4">
                   {['Dry', 'Oily', 'Sweaty'].map(opt => (
                      <button key={opt} onClick={() => { setSelections({...selections, skin: opt}); setStep(3); }} className="p-4 rounded-xl border border-dark-600 bg-dark-900 hover:border-brand-blue hover:bg-dark-800 transition-all text-left group">
                         <span className="font-bold text-white block mb-1 group-hover:text-brand-blue">{opt}</span>
                         <span className="text-xs text-slate-500">Sebum production rate</span>
                      </button>
                   ))}
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-medium text-slate-300">Variable 3: Hold Duration</h3>
                <div className="grid grid-cols-2 gap-4">
                   {['Daily', '1-2 Weeks', '4+ Weeks'].map(opt => (
                      <button key={opt} onClick={() => { setSelections({...selections, time: opt}); setStep(4); }} className="p-4 rounded-xl border border-dark-600 bg-dark-900 hover:border-brand-blue hover:bg-dark-800 transition-all text-left group">
                         <span className="font-bold text-white block mb-1 group-hover:text-brand-blue">{opt}</span>
                         <span className="text-xs text-slate-500">Desired bond longevity</span>
                      </button>
                   ))}
                </div>
             </div>
          )}

          {step === 4 && (
             <div className="animate-fadeIn">
                <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-6 mb-6">
                   <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Optimal Solution Calculated
                   </div>
                   <h3 className="text-3xl font-bold text-white mb-4">{result.name}</h3>
                   <p className="text-slate-300 mb-4">{result.desc}</p>
                   
                   <div className="flex items-start gap-3 p-3 bg-dark-900/50 rounded-lg border border-brand-blue/10">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <p className="text-xs text-slate-300"><strong className="text-yellow-500">Caution:</strong> {result.warn}</p>
                   </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                    <div className="bg-dark-900 p-2 rounded border border-dark-700">Base: {selections.base}</div>
                    <div className="bg-dark-900 p-2 rounded border border-dark-700">Skin: {selections.skin}</div>
                    <div className="bg-dark-900 p-2 rounded border border-dark-700">Time: {selections.time}</div>
                </div>
             </div>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-dark-700 w-full">
             <div className="h-full bg-brand-blue transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
       </div>
    </div>
  );
};

const EntropyTool: React.FC = () => {
    const [thickness, setThickness] = useState(0.06);
    const [maintenance, setMaintenance] = useState(1); // weeks
    const [bleached, setBleached] = useState(false);

    // Completely arbitrary "Physics" calculation for demo
    const calculateLifespan = () => {
        let baseLife = thickness * 200; // 0.03mm -> 6 weeks, 0.06mm -> 12 weeks approx logic
        if (bleached) baseLife *= 0.7; // Bleaching weakens knots
        // Frequent maintenance reduces lifespan due to mechanical stress of removal
        const maintenanceFactor = maintenance < 2 ? 0.8 : 1.0; 
        
        return Math.round(baseLife * maintenanceFactor);
    };

    const lifespan = calculateLifespan();

    return (
    <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 shadow-2xl relative overflow-hidden">
       {/* UI Decor */}
       <div className="absolute top-0 right-0 p-6 opacity-5">
          <Activity className="w-48 h-48 text-brand-purple" />
       </div>

       <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-8">Entropy Calculator</h2>
          
          <div className="space-y-8 mb-8">
              <div>
                  <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold text-slate-300">Base Thickness (Poly)</label>
                      <span className="text-sm font-mono text-brand-purple">{thickness} mm</span>
                  </div>
                  <input 
                    type="range" min="0.03" max="0.12" step="0.01" 
                    value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))}
                    className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Ultra Thin (Invisible)</span>
                      <span>Thick (Durable)</span>
                  </div>
              </div>

              <div>
                  <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold text-slate-300">Maintenance Cycle</label>
                      <span className="text-sm font-mono text-brand-purple">Every {maintenance} Week(s)</span>
                  </div>
                  <input 
                    type="range" min="1" max="4" step="1" 
                    value={maintenance} onChange={(e) => setMaintenance(parseInt(e.target.value))}
                    className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                     *More frequent removals increase mechanical stress (tearing risk), reducing overall lifespan.
                  </p>
              </div>

              <div className="flex items-center justify-between bg-dark-900 p-4 rounded-xl border border-dark-600">
                  <span className="text-sm font-bold text-slate-300">Bleached Knots?</span>
                  <button 
                    onClick={() => setBleached(!bleached)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${bleached ? 'bg-brand-purple' : 'bg-dark-600'}`}
                  >
                      <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${bleached ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
              </div>
          </div>

          <div className="bg-dark-900 rounded-2xl p-6 text-center border border-brand-purple/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-purple/5 animate-pulse"></div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2">Estimated Lifespan</p>
              <div className="text-5xl font-bold text-white mb-2">{lifespan} <span className="text-xl text-slate-500">Weeks</span></div>
              <p className="text-xs text-slate-300">
                 {thickness < 0.05 ? "High Entropic Decay (Fragile)" : "Stable State (Durable)"}
              </p>
          </div>
       </div>
    </div>
    );
};
