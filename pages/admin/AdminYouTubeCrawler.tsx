
import React, { useState, useEffect, useRef } from 'react';
import { generateArticleFromVideo } from '../../services/geminiService';
import { useData } from '../../contexts/DataContext';
import { Topic, UserTier } from '../../types';
import { 
  Youtube, 
  Search, 
  ArrowRight, 
  Loader, 
  FileText, 
  CheckCircle, 
  Play, 
  MessageSquare, 
  AlertCircle, 
  Save, 
  Terminal, 
  Cpu, 
  Database,
  ArrowLeft,
  Wand2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_VIDEOS = [
  {
    id: 'v1',
    title: 'STOP Ruining Your Lace Front! (Bleaching Knots Tutorial)',
    channel: 'HairSystem DIY',
    views: '45K',
    thumbnail: 'https://placehold.co/320x180/1e293b/FFF?text=Knots+Tutorial',
    description: 'In this video, we discuss why over-bleaching creates orange roots and destroys the structural integrity of the lace.',
    comments: [
        "My knots turned orange after 10 mins, help!",
        "Great tip about using the foil to protect the hair shaft."
    ]
  },
  {
    id: 'v2',
    title: 'Ghost Bond vs Walker Tape: 30 Day Wear Test',
    channel: 'The Bald Truth',
    views: '120K',
    thumbnail: 'https://placehold.co/320x180/334155/FFF?text=Glue+vs+Tape',
    description: 'We put the two most popular adhesives to the test during a humid Florida summer. The results surprised us.',
    comments: [
        "Ghost bond turned into slime after swimming.",
        "Tape is easier to clean but I hate the thickness."
    ]
  },
  {
    id: 'v3',
    title: 'How to Cut a Men\'s Hair System (Fade Guide)',
    channel: 'Barber Lab',
    views: '89K',
    thumbnail: 'https://placehold.co/320x180/0f172a/FFF?text=Fade+Guide',
    description: 'Blending the side hair with the system is the hardest part. Here is the physics of graduation.',
    comments: [
        "What clipper guard do you use for the transition?",
        "My blend always looks heavy."
    ]
  }
];

export const AdminYouTubeCrawler: React.FC = () => {
  const { categories, addTopic } = useData();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof MOCK_VIDEOS>([]);
  const [selectedVideo, setSelectedVideo] = useState<typeof MOCK_VIDEOS[0] | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [targetCategory, setTargetCategory] = useState(categories[0].id);
  const [articleTitle, setArticleTitle] = useState('');

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generationLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(!keyword) return;
    setIsSearching(true);
    setResults([]);
    setTimeout(() => {
        setIsSearching(false);
        setResults(MOCK_VIDEOS);
        setStep(2);
    }, 1500);
  };

  const addLog = (msg: string) => {
    setGenerationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleGenerate = async () => {
    if (!selectedVideo) return;
    setIsGenerating(true);
    setGenerationLogs(["Initializing Truth Engine Synthesis Matrix...", "Target Signal: " + selectedVideo.id]);
    
    const logInterval = setInterval(() => {
       const phrases = [
         "Extracting transcripts from frequency...",
         "Parsing comments for community data nodes...",
         "Applying 'Physics of Hair' language filters...",
         "Synthesizing technical modules...",
         "Gemini 3 Pro Inference in progress...",
         "Optimizing HTML structure for KB injection..."
       ];
       addLog(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 800);

    const html = await generateArticleFromVideo({
        title: selectedVideo.title,
        channel: selectedVideo.channel,
        description: selectedVideo.description,
        comments: selectedVideo.comments
    });

    clearInterval(logInterval);
    addLog("Synthesis Complete. Article generated.");
    setGeneratedHtml(html);
    setArticleTitle(selectedVideo.title.replace('STOP', 'Preventing').replace('!', '').replace('?', '')); 
    
    setTimeout(() => {
        setIsGenerating(false);
        setStep(3);
    }, 1000);
  };

  const handlePublish = () => {
    if (!generatedHtml || !articleTitle) return;

    const newTopic: Topic = {
        id: `auto-${Date.now()}`,
        title: articleTitle,
        description: generatedHtml,
        category: categories.find(c => c.id === targetCategory)?.name || 'General',
        readTime: '6 min',
        /* Fix: Use UserTier.GALAXY instead of UserTier.KINETIC */
        tier: UserTier.GALAXY,
        articles: []
    };

    addTopic(targetCategory, newTopic);
    navigate('/admin/articles');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-5 border-b border-dark-700 pb-8">
        <div className="p-4 bg-red-600/10 rounded-2xl text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
            <Youtube className="w-8 h-8" />
        </div>
        <div>
           <div className="flex items-center gap-2 mb-1">
             <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Signal Synthesis Module</h4>
             <span className="h-px w-8 bg-red-500/30"></span>
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Video-to-Knowledge Engine</h1>
        </div>
      </div>

      <div className="flex items-center justify-between px-16 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-dark-700/50 -z-10"></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative border-2 ${
              step >= s ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'bg-dark-900 border-dark-700 text-slate-600'
            }`}>
              {s}
              {step === s && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold text-brand-blue whitespace-nowrap tracking-widest">{s === 1 ? 'Scan' : s === 2 ? 'Select' : 'Publish'}</span>}
            </div>
          ))}
      </div>

      <div className="mt-12">
        {step === 1 && (
          <div className="bg-dark-800 rounded-3xl border border-dark-700 p-12 shadow-2xl relative overflow-hidden text-center group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent opacity-50"></div>
              <div className="max-w-xl mx-auto space-y-8 relative z-10">
                  <div className="w-20 h-20 bg-dark-900 rounded-2xl border border-dark-700 flex items-center justify-center mx-auto text-red-500 shadow-inner group-hover:scale-110 transition-transform">
                      <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Establish Vector Frequency</h2>
                    <p className="text-slate-300 text-sm">Target YouTube channels or keywords to distill into the Knowledge Base.</p>
                  </div>
                  <form onSubmit={handleSearch} className="relative group/input">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-brand-purple/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition duration-500"></div>
                      <div className="relative flex">
                          <input 
                              type="text" 
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              placeholder="e.g., 'Swiss lace vs Poly hairline'..."
                              className="w-full bg-dark-900 border border-dark-600 rounded-l-2xl py-5 pl-8 pr-4 text-white font-medium focus:outline-none focus:border-red-500 transition-colors"
                          />
                          <button 
                              type="submit"
                              disabled={isSearching || !keyword}
                              className="bg-red-600 hover:bg-red-500 text-white font-bold px-10 rounded-r-2xl transition-all flex items-center gap-3 disabled:opacity-50"
                          >
                              {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                              Search Signal
                          </button>
                      </div>
                  </form>
              </div>
          </div>
        )}

        {step === 2 && (
           <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-white">Select Signal Source</h2>
                      <span className="text-xs text-slate-500 font-mono">Found {results.length} active vectors</span>
                  </div>
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> New Search
                  </button>
              </div>

              {isGenerating ? (
                 <div className="bg-dark-950 rounded-3xl border border-dark-700 p-8 shadow-2xl relative overflow-hidden font-mono text-xs">
                    <div className="flex items-center justify-between mb-6 border-b border-dark-800 pb-4">
                       <div className="flex items-center gap-3 text-emerald-500">
                          <Terminal className="w-5 h-5" />
                          <span className="font-bold uppercase tracking-widest">Truth Engine Synthesis Terminal</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-brand-blue animate-pulse" />
                          <span className="text-slate-500 uppercase">GPU INFERENCE ACTIVE</span>
                       </div>
                    </div>
                    <div className="h-64 overflow-y-auto space-y-1.5 custom-scrollbar text-emerald-500/80">
                       {generationLogs.map((log, i) => (
                          <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="opacity-40">>></span> {log}
                          </div>
                       ))}
                       <div className="w-2 h-4 bg-emerald-500 animate-pulse inline-block align-middle ml-1"></div>
                       <div ref={logEndRef} />
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-dark-800 pt-4 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
                       <span>ID: GEN_V_TRUTH_{Date.now()}</span>
                       <span>MODALITY: VIDEO_TO_HTML</span>
                    </div>
                 </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {results.map((video) => (
                          <div 
                              key={video.id} 
                              onClick={() => setSelectedVideo(video)}
                              className={`bg-dark-800 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 group relative ${
                                  selectedVideo?.id === video.id 
                                  ? 'border-brand-blue ring-1 ring-brand-blue shadow-2xl shadow-brand-blue/20 transform scale-[1.02]' 
                                  : 'border-dark-700 hover:border-slate-500'
                              }`}
                          >
                              <div className="relative aspect-video">
                                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                        selectedVideo?.id === video.id ? 'bg-brand-blue text-white scale-110' : 'bg-red-600/90 text-white group-hover:scale-110'
                                      }`}>
                                          {selectedVideo?.id === video.id ? <CheckCircle className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                                      </div>
                                  </div>
                              </div>
                              <div className="p-6">
                                  <h3 className="text-white font-bold text-sm line-clamp-2 mb-3 leading-snug">{video.title}</h3>
                                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                      <span className="text-slate-300">{video.channel}</span>
                                      <span>{video.views} Views</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="flex justify-center pt-8">
                      <button 
                          onClick={handleGenerate}
                          disabled={!selectedVideo}
                          className="px-10 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                          <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          Initiate AI Synthesis
                      </button>
                  </div>
                </>
              )}
           </div>
        )}

        {step === 3 && (
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-right-4 duration-500">
              
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 shadow-2xl">
                    <div className="mb-8 border-b border-dark-700 pb-8 space-y-6">
                        <div className="flex items-center justify-between">
                           <h2 className="text-2xl font-bold text-white">Synthesized Output</h2>
                           <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                              <CheckCircle className="w-3.5 h-3.5" /> High Fidelity Result
                           </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Refined Technical Title</label>
                            <input 
                                type="text" 
                                value={articleTitle}
                                onChange={(e) => setArticleTitle(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-2xl py-4 px-6 text-white font-bold text-xl focus:border-brand-blue outline-none ring-1 ring-inset ring-white/5"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-brand-blue" /> Distilled HTML Body
                           </label>
                           <button className="text-[10px] font-bold text-brand-blue hover:text-white transition-colors uppercase tracking-widest">
                              Format Document
                           </button>
                        </div>
                        <textarea 
                            value={generatedHtml}
                            onChange={(e) => setGeneratedHtml(e.target.value)}
                            className="w-full h-[600px] bg-dark-900 border border-dark-600 rounded-2xl p-8 text-slate-300 font-mono text-sm leading-relaxed focus:border-brand-blue outline-none resize-none ring-1 ring-inset ring-white/5 custom-scrollbar"
                        />
                    </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 shadow-2xl sticky top-24 space-y-8">
                    <div>
                        <h3 className="font-bold text-white text-lg mb-2">Publish Matrix</h3>
                        <p className="text-xs text-slate-500">Configure deployment parameters for the synthesized signal.</p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Domain</label>
                            <select 
                                value={targetCategory}
                                onChange={(e) => setTargetCategory(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-3.5 text-white font-medium focus:border-brand-blue outline-none"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="p-5 bg-dark-900 rounded-2xl border border-dark-700 space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Origin</span>
                                <span className="text-slate-200 font-bold truncate max-w-[80px]">{selectedVideo?.channel}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Community Signal</span>
                                <span className="text-brand-blue font-bold flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> {selectedVideo?.comments.length}
                                </span>
                            </div>
                             <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Access Protocol</span>
                                <span className="text-white font-bold">Kinetic</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button 
                            onClick={handlePublish}
                            className="w-full py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center justify-center gap-3 transition-all"
                        >
                            <Save className="w-5 h-5" /> Commit to KB
                        </button>
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-dark-900 border border-dark-600 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
                        >
                            Retrain Model
                        </button>
                    </div>
                </div>
            </div>

         </div>
      )}
      </div>
    </div>
  );
};