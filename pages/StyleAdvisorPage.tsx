import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Camera, ChevronRight, ChevronLeft, Loader2,
  Sparkles, User, Dumbbell, Droplets, DollarSign,
  CheckCircle, Star, ArrowRight, RefreshCw, Waves
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StyleProfile {
  faceShape: string;
  faceShapeDesc: string;
  lifestyle: {
    activityLevel: string;
    sweating: string;
    swimming: string;
    environment: string;
  };
  budget: string;
}

interface StyleRecommendation {
  faceShape: string;
  faceShapeDesc: string;
  topStyles: {
    name: string;
    desc: string;
    why: string;
    referenceKeyword: string;
    baseType: string;
  }[];
  adhesiveType: string;
  adhesiveReason: string;
  adhesiveProducts: string[];
  baseRecommendation: string;
  baseReason: string;
  budgetPlan: {
    tier: string;
    priceRange: string;
    items: string[];
    note: string;
  };
  maintenanceTips: string[];
  confidenceScore: number;
}

// ─── Reference Style Images (curated Unsplash keywords) ──────────────────────
const STYLE_REFERENCES: Record<string, string> = {
  'Natural Textured': 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=300&h=300&fit=crop&crop=face',
  'Classic Side Part': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
  'Modern Quiff': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
  'Slicked Back': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
  'Undercut': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
  'Crew Cut': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
  'default': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
};

// ─── Step Components ──────────────────────────────────────────────────────────

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
          i < current ? 'bg-emerald-500 text-white' :
          i === current ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20' :
          'bg-dark-700 text-slate-500'
        }`}>
          {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`h-px w-12 transition-all ${i < current ? 'bg-emerald-500' : 'bg-dark-700'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Gemini API Call ──────────────────────────────────────────────────────────

async function analyzeStyleWithGemini(
  base64Image: string,
  mimeType: string,
  lifestyle: StyleProfile['lifestyle'],
  budget: string
): Promise<StyleRecommendation> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const prompt = `You are a professional hair system style consultant AI. Analyze this facial image and lifestyle data to provide personalized hair system recommendations.

Lifestyle data:
- Activity level: ${lifestyle.activityLevel}
- Sweating tendency: ${lifestyle.sweating}
- Swimming: ${lifestyle.swimming}
- Primary environment: ${lifestyle.environment}
- Budget: ${budget}

Analyze the face shape from the image and return a JSON object ONLY (no markdown):
{
  "faceShape": "one of: Oval, Round, Square, Heart, Oblong, Diamond",
  "faceShapeDesc": "brief description of detected face shape features",
  "topStyles": [
    {
      "name": "style name",
      "desc": "1-sentence style description",
      "why": "why this suits the face shape",
      "referenceKeyword": "one of: Natural Textured, Classic Side Part, Modern Quiff, Slicked Back, Undercut, Crew Cut",
      "baseType": "Lace Front / Full Lace / Mono / Poly Skin"
    }
  ],
  "adhesiveType": "Water-based / Acrylic / Silicone / Tape",
  "adhesiveReason": "why this adhesive based on lifestyle",
  "adhesiveProducts": ["product1", "product2"],
  "baseRecommendation": "best base type for this person",
  "baseReason": "technical reason",
  "budgetPlan": {
    "tier": "Entry / Mid-Range / Premium",
    "priceRange": "$X - $Y",
    "items": ["item1", "item2", "item3"],
    "note": "brief buying advice"
  },
  "maintenanceTips": ["tip1", "tip2", "tip3"],
  "confidenceScore": 85
}

Return ONLY the JSON object.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64Image } },
            { text: prompt }
          ]
        }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 16384 },
        thinkingConfig: { thinkingBudget: 0 }
      })
    }
  );

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as StyleRecommendation;
}

// ─── Main Component ───────────────────────────────────────────────────────────

const StyleAdvisorPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0); // 0=photo, 1=lifestyle, 2=budget, 3=analyzing, 4=results
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [lifestyle, setLifestyle] = useState({
    activityLevel: '',
    sweating: '',
    swimming: '',
    environment: '',
  });
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState<StyleRecommendation | null>(null);
  const [error, setError] = useState('');
  const [tryonResult, setTryonResult] = useState<string | null>(null);
  const [tryonLoading, setTryonLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [colorConfirmed, setColorConfirmed] = useState(false);
  const [aiRecommendedColor, setAiRecommendedColor] = useState<string>('');
  const [colorAnalyzing, setColorAnalyzing] = useState(false);

  const handleImageFile = (file: File) => {
    setImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCapturedImage(dataUrl);
      setStep(1);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setStep(3);
    setError('');
    try {
      const base64 = capturedImage.split(',')[1];
      const rec = await analyzeStyleWithGemini(base64, imageMime, lifestyle, budget);
      setResult(rec);
      setStep(4);
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please try again.');
      setStep(2);
    }
  };

  const reset = () => {
    setStep(0);
    setCapturedImage(null);
    setLifestyle({ activityLevel: '', sweating: '', swimming: '', environment: '' });
    setBudget('');
    setResult(null);
    setError('');
    setTryonResult(null);
    setTryonLoading(false);
  };

  // ── Step 0: Photo Upload ──────────────────────────────────────────────────
  const renderPhotoStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-sm font-bold">
          <Sparkles className="w-4 h-4" /> AI Style Advisor
        </div>
        <h1 className="text-3xl font-bold text-white">Find Your Perfect Style</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Upload a clear frontal photo. Our AI will analyze your face shape and craft a personalized hair system recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group p-8 bg-dark-800 border-2 border-dashed border-dark-600 hover:border-brand-blue rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-brand-blue/5"
        >
          <div className="w-14 h-14 rounded-2xl bg-dark-700 group-hover:bg-brand-blue/10 flex items-center justify-center transition-all">
            <Upload className="w-7 h-7 text-slate-500 group-hover:text-brand-blue transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-bold text-white">Upload Photo</p>
            <p className="text-xs text-slate-500 mt-0.5">JPG, PNG, WEBP</p>
          </div>
        </button>

        <button
          onClick={() => cameraInputRef.current?.click()}
          className="group p-8 bg-dark-800 border-2 border-dashed border-dark-600 hover:border-brand-purple rounded-2xl flex flex-col items-center gap-3 transition-all hover:bg-brand-purple/5"
        >
          <div className="w-14 h-14 rounded-2xl bg-dark-700 group-hover:bg-brand-purple/10 flex items-center justify-center transition-all">
            <Camera className="w-7 h-7 text-slate-500 group-hover:text-brand-purple transition-colors" />
          </div>
          <div className="text-center">
            <p className="font-bold text-white">Take Photo</p>
            <p className="text-xs text-slate-500 mt-0.5">Use camera</p>
          </div>
        </button>
      </div>

      <div className="max-w-lg mx-auto bg-dark-800/50 border border-dark-700 rounded-2xl p-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">For best results</p>
        <div className="grid grid-cols-3 gap-3">
          {['Face clearly visible', 'Neutral expression', 'Good lighting'].map(tip => (
            <div key={tip} className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              {tip}
            </div>
          ))}
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="hidden"
        onChange={e => e.target.files?.[0] && handleImageFile(e.target.files[0])} />
    </div>
  );

  // ── Step 1: Lifestyle ─────────────────────────────────────────────────────
  const renderLifestyleStep = () => {
    const questions = [
      {
        key: 'activityLevel',
        label: 'Activity Level',
        icon: Dumbbell,
        options: [
          { value: 'sedentary', label: 'Sedentary', desc: 'Mostly desk work' },
          { value: 'moderate', label: 'Moderate', desc: '2-3x/week exercise' },
          { value: 'active', label: 'Active', desc: 'Daily workouts' },
          { value: 'athlete', label: 'Athlete', desc: 'Intense daily training' },
        ]
      },
      {
        key: 'sweating',
        label: 'Sweating Tendency',
        icon: Droplets,
        options: [
          { value: 'low', label: 'Low', desc: 'Rarely sweat' },
          { value: 'moderate', label: 'Moderate', desc: 'Normal sweating' },
          { value: 'high', label: 'High', desc: 'Sweat easily' },
        ]
      },
      {
        key: 'swimming',
        label: 'Swimming',
        icon: Waves,
        options: [
          { value: 'never', label: 'Never', desc: 'No water sports' },
          { value: 'occasional', label: 'Occasional', desc: 'Few times/month' },
          { value: 'regular', label: 'Regular', desc: 'Weekly swimmer' },
        ]
      },
      {
        key: 'environment',
        label: 'Primary Environment',
        icon: User,
        options: [
          { value: 'office', label: 'Office', desc: 'Indoor, climate controlled' },
          { value: 'outdoor', label: 'Outdoor', desc: 'Sun, wind, humidity' },
          { value: 'mixed', label: 'Mixed', desc: 'Both indoor & outdoor' },
        ]
      }
    ];

    const allAnswered = questions.every(q => lifestyle[q.key as keyof typeof lifestyle]);

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Your Lifestyle</h2>
          <p className="text-slate-400 mt-1">This helps us recommend the right adhesive and base type</p>
        </div>

        {capturedImage && (
          <div className="flex justify-center">
            <img src={capturedImage} alt="Your photo" className="w-16 h-16 rounded-full object-cover border-2 border-brand-blue/50" />
          </div>
        )}

        <div className="space-y-5">
          {questions.map(({ key, label, icon: Icon, options }) => (
            <div key={key} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-brand-blue" />
                <span className="text-sm font-bold text-white">{label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLifestyle(prev => ({ ...prev, [key]: opt.value }))}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      lifestyle[key as keyof typeof lifestyle] === opt.value
                        ? 'border-brand-blue bg-brand-blue/10 text-white'
                        : 'border-dark-600 text-slate-400 hover:border-dark-500'
                    }`}
                  >
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => setStep(0)} className="px-5 py-3 bg-dark-800 border border-dark-700 text-slate-400 font-bold rounded-xl hover:text-white transition-all flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={() => setStep(2)}
            disabled={!allAnswered}
            className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // ── Step 2: Budget ────────────────────────────────────────────────────────
  const renderBudgetStep = () => {
    const budgetOptions = [
      { value: 'Entry ($50-150)', label: 'Entry', range: '$50 – $150', desc: 'Budget-friendly starter systems', icon: '💰' },
      { value: 'Mid-Range ($150-400)', label: 'Mid-Range', range: '$150 – $400', desc: 'Quality balance, most popular', icon: '⭐' },
      { value: 'Premium ($400+)', label: 'Premium', range: '$400+', desc: 'Top-tier materials & longevity', icon: '💎' },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Budget Range</h2>
          <p className="text-slate-400 mt-1">We'll tailor product recommendations to your investment level</p>
        </div>

        <div className="space-y-3">
          {budgetOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setBudget(opt.value)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                budget === opt.value
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-dark-700 bg-dark-800 hover:border-dark-500'
              }`}
            >
              <span className="text-3xl">{opt.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white">{opt.label}</p>
                  <span className="text-xs font-bold text-brand-blue">{opt.range}</span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
              </div>
              {budget === opt.value && <CheckCircle className="w-5 h-5 text-brand-blue flex-shrink-0" />}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => setStep(1)} className="px-5 py-3 bg-dark-800 border border-dark-700 text-slate-400 font-bold rounded-xl hover:text-white transition-all flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!budget}
            className="flex-1 py-3 bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
          >
            <Sparkles className="w-4 h-4" /> Analyze My Style
          </button>
        </div>
      </div>
    );
  };

  // ── Step 3: Analyzing ─────────────────────────────────────────────────────
  const renderAnalyzingStep = () => (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-brand-blue animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-brand-blue/30 animate-ping" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-white">Analyzing Your Profile</h2>
        <p className="text-slate-400 text-sm">AI is processing face shape, lifestyle & budget...</p>
      </div>
      <div className="flex gap-2">
        {['Detecting face shape', 'Matching styles', 'Selecting adhesives', 'Building plan'].map((label, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" style={{ animationDelay: `${i * 200}ms` }} />
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Step 4: Results ───────────────────────────────────────────────────────
  const renderResults = () => {
    if (!result) return null;
    const FACE_SHAPE_COLORS: Record<string, string> = {
      Oval: 'text-emerald-400', Round: 'text-brand-blue', Square: 'text-amber-400',
      Heart: 'text-pink-400', Oblong: 'text-brand-purple', Diamond: 'text-cyan-400',
    };
    const faceColor = FACE_SHAPE_COLORS[result.faceShape] || 'text-brand-blue';

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Your Style Report</h2>
            <p className="text-slate-400 text-sm mt-0.5">Personalized recommendation by AI</p>
          </div>
          <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 border border-dark-700 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Redo
          </button>
        </div>

        {/* Face Shape */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex items-center gap-4">
          {capturedImage && (
            <img src={capturedImage} alt="You" className="w-16 h-16 rounded-full object-cover border-2 border-dark-600 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Detected Face Shape</p>
            <p className={`text-2xl font-bold ${faceColor}`}>{result.faceShape}</p>
            <p className="text-sm text-slate-400 mt-0.5">{result.faceShapeDesc}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-500">Confidence</p>
            <p className="text-2xl font-bold text-white">{result.confidenceScore}%</p>
          </div>
        </div>

        {/* Top Styles */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Recommended Styles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.topStyles.map((style, i) => {
              const imgUrl = STYLE_REFERENCES[style.referenceKeyword] || STYLE_REFERENCES['default'];
              return (
                <div key={i} className={`bg-dark-800 border rounded-2xl overflow-hidden transition-all ${i === 0 ? 'border-brand-blue ring-1 ring-brand-blue/20' : 'border-dark-700'}`}>
                  {i === 0 && (
                    <div className="bg-brand-blue/10 px-3 py-1.5 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-brand-blue fill-brand-blue" />
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Best Match</span>
                    </div>
                  )}
                  <div className="relative h-32 overflow-hidden bg-dark-700">
                    <img src={imgUrl} alt={style.name} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent" />
                    <div className="absolute bottom-2 left-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dark-800/80 border border-dark-600 text-slate-300">
                        {style.baseType}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <p className="font-bold text-white">{style.name}</p>
                    <p className="text-xs text-slate-400">{style.desc}</p>
                    <p className="text-xs text-brand-blue mt-2 flex items-start gap-1">
                      <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      {style.why}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adhesive + Base */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">Adhesive Recommendation</span>
            </div>
            <p className={`text-lg font-bold text-cyan-400`}>{result.adhesiveType}</p>
            <p className="text-xs text-slate-400">{result.adhesiveReason}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {result.adhesiveProducts.map(p => (
                <span key={p} className="text-xs px-2.5 py-1 bg-dark-700 border border-dark-600 rounded-full text-slate-300">{p}</span>
              ))}
            </div>
          </div>

          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-purple" />
              <span className="text-sm font-bold text-white">Base Type</span>
            </div>
            <p className="text-lg font-bold text-brand-purple">{result.baseRecommendation}</p>
            <p className="text-xs text-slate-400">{result.baseReason}</p>
          </div>
        </div>

        {/* Budget Plan */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">Your Budget Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                {result.budgetPlan.tier}
              </span>
              <span className="text-sm font-bold text-white">{result.budgetPlan.priceRange}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {result.budgetPlan.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-dark-700/50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400 flex-shrink-0">{i + 1}</span>
                <span className="text-xs text-slate-300">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 italic">{result.budgetPlan.note}</p>
        </div>

        {/* Maintenance Tips */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 space-y-3">
          <p className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400" /> Maintenance Tips for Your Lifestyle
          </p>
          <div className="space-y-2">
            {result.maintenanceTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Ares Virtual Try-On */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-dark-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span className="text-sm font-bold text-white">Virtual Try-On Preview</span>
              <span className="text-[10px] px-2 py-0.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple rounded-full font-bold uppercase tracking-wider">AI</span>
            </div>
            <span className="text-xs text-slate-500">Powered by Ares Hair System</span>
          </div>

          {/* Product info */}
          <div className="p-5 flex gap-4 border-b border-dark-700">
            <img
              src="https://www.lavividhair.com/cdn/shop/products/ares-french-lace-hair-replacement_1.jpg"
              alt="Ares Hair System"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&h=120&fit=crop&crop=face'; }}
              className="w-20 h-20 rounded-xl object-cover border border-dark-600 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Ares French Lace Hair System</p>
              <p className="text-xs text-slate-400 mt-1">French Lace + Skin Perimeter · Best for daily wear · Natural hairline</p>
              <a
                href="https://www.lavividhair.com/collections/men-hair-system/products/ares-men-s-non-surgical-hair-replacement-french-lace-with-skin-around-best-for-daily-wear"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-brand-blue hover:underline"
              >
                View Product <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* AI preview */}
          <div className="p-5">

            {/* Step A: Color selection (shown before generation) */}
            {!tryonResult && !tryonLoading && (
              <div className="space-y-4">
                {/* AI color recommendation */}
                {!colorConfirmed ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-white">Step 1 — Choose Your Hair Color</p>

                    {/* Trigger AI color analysis when this section first renders */}
                    {!aiRecommendedColor && !colorAnalyzing && (() => {
                      // Side-effect via inline IIFE — triggers once
                      setTimeout(async () => {
                        setColorAnalyzing(true);
                        try {
                          const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
                          const base64 = capturedImage!.split(',')[1];
                          const colorPrompt = `Look at this person's photo. Based on their existing hair color (if visible) and skin tone, which ONE of these hair system color options would look most natural and match best?

Options (respond with EXACTLY one of these values):
- jet black (#1B)
- natural black (#1)
- dark brown (#2)
- medium brown (#4)
- light brown (#6)
- dark blonde (#8)
- salt and pepper (mix of gray and dark)
- silver gray (#56)

Respond with ONLY the matching value from the list above, nothing else.`;
                          const res = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                            {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                contents: [{ parts: [
                                  { inline_data: { mime_type: imageMime, data: base64 } },
                                  { text: colorPrompt }
                                ]}],
                                generationConfig: { temperature: 0.1, maxOutputTokens: 32 }
                              })
                            }
                          );
                          const d = await res.json();
                          const raw = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || '';
                          const VALID = ['jet black (#1b)', 'natural black (#1)', 'dark brown (#2)', 'medium brown (#4)', 'light brown (#6)', 'dark blonde (#8)', 'salt and pepper (mix of gray and dark)', 'silver gray (#56)'];
                          const match = VALID.find(v => raw.includes(v.split('(')[0].trim()));
                          const recommended = match || 'natural black (#1)';
                          setAiRecommendedColor(recommended);
                          setSelectedColor(recommended);
                        } catch {
                          setAiRecommendedColor('natural black (#1)');
                          setSelectedColor('natural black (#1)');
                        }
                        setColorAnalyzing(false);
                      }, 0);
                      return null;
                    })()}

                    {colorAnalyzing ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-purple" />
                        Analyzing your hair color from photo...
                      </div>
                    ) : aiRecommendedColor ? (
                      <p className="text-xs text-slate-400">
                        AI recommends <span className="text-brand-purple font-bold capitalize">{aiRecommendedColor.split('(')[0].trim()}</span> based on your photo.
                        You can accept or pick a different shade below.
                      </p>
                    ) : null}
                    {/* Color swatches */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Jet Black', value: 'jet black (#1B)', hex: '#0a0a0a' },
                        { label: 'Natural Black', value: 'natural black (#1)', hex: '#1a1a1a' },
                        { label: 'Dark Brown', value: 'dark brown (#2)', hex: '#2c1810' },
                        { label: 'Medium Brown', value: 'medium brown (#4)', hex: '#5c3a1e' },
                        { label: 'Light Brown', value: 'light brown (#6)', hex: '#8b5e3c' },
                        { label: 'Dark Blonde', value: 'dark blonde (#8)', hex: '#c4956a' },
                        { label: 'Salt & Pepper', value: 'salt and pepper (mix of gray and dark)', hex: '#808080' },
                        { label: 'Silver Gray', value: 'silver gray (#56)', hex: '#b0b0b0' },
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                            selectedColor === color.value
                              ? 'border-brand-purple bg-brand-purple/10'
                              : 'border-dark-600 hover:border-dark-500'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border border-dark-500 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[10px] text-slate-400 text-center leading-tight">{color.label}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedColor) setSelectedColor('natural black (#1)');
                        setColorConfirmed(true);
                      }}
                      className="w-full py-2.5 bg-dark-700 border border-dark-600 hover:border-brand-purple text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Confirm Color & Continue →
                    </button>
                  </div>
                ) : (
                  /* Step B: confirmed color, ready to generate */
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-300">
                      <span>Selected:</span>
                      <span className="font-bold text-brand-purple capitalize">{selectedColor.split('(')[0].trim()}</span>
                      <button onClick={() => setColorConfirmed(false)} className="text-xs text-slate-500 hover:text-slate-300 underline">change</button>
                    </div>
                    <p className="text-xs text-slate-400">
                      AI will generate a photorealistic preview of you wearing the Ares in this color.
                    </p>
                    <button
                      onClick={async () => {
                        setTryonLoading(true);
                        try {
                          const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
                          const base64 = capturedImage!.split(',')[1];
                          const colorDesc = selectedColor || 'natural black';
                          const prompt = `You are a professional photo retoucher. Edit this portrait photo to show the person wearing a realistic hair replacement system (toupee/hair system).

CRITICAL RULES:
- Show ONLY the final worn result — natural hair appearance, no mesh, no lace netting, no cap base visible
- The hairline must look completely natural and undetectable, as if it is real growing hair
- Hair color: ${colorDesc}
- Hair style: classic side part, medium density, natural flow
- The hair should sit naturally on the scalp with realistic volume and shadow at the roots
- Keep the person's face, skin, expression, and background EXACTLY the same
- Do NOT show any product components (no lace, no poly base, no adhesive, no net)
- Final result must look like a real candid photo of a person with a full head of natural hair`;

                          const response = await fetch(
                            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
                            {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                contents: [{
                                  parts: [
                                    { inline_data: { mime_type: imageMime, data: base64 } },
                                    { text: prompt }
                                  ]
                                }],
                                generationConfig: {
                                  responseModalities: ['TEXT', 'IMAGE'],
                                  temperature: 0.3
                                }
                              })
                            }
                          );
                          const data = await response.json();
                          const parts = data.candidates?.[0]?.content?.parts || [];
                          const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
                          if (imagePart) {
                            setTryonResult(`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`);
                          } else {
                            setTryonResult('error:' + JSON.stringify(data).slice(0, 200));
                          }
                        } catch (e: any) {
                          setTryonResult('error:' + e.message);
                        }
                        setTryonLoading(false);
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-brand-purple to-brand-blue text-white font-bold rounded-xl text-sm hover:opacity-90 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-brand-purple/20"
                    >
                      <Sparkles className="w-4 h-4" /> Generate My Preview
                    </button>
                  </div>
                )}
              </div>
            )}

            {tryonLoading && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                <p className="text-sm text-slate-400">AI is visualizing the Ares on you...</p>
              </div>
            )}

            {tryonResult && !tryonLoading && (
              <div className="space-y-4">
                {tryonResult.startsWith('error:') ? (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    Generation failed. Please try again.
                    <p className="text-xs text-slate-500 mt-1">{tryonResult.replace('error:', '')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 text-center">Before</p>
                        <img src={capturedImage!} alt="Before" className="w-full rounded-xl object-cover aspect-square border border-dark-600" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 text-center">With Ares</p>
                        <img src={tryonResult} alt="With Ares Hair System" className="w-full rounded-xl object-cover aspect-square border border-brand-purple/40" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic text-center">AI-generated preview · Results may vary</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setTryonResult(null); setColorConfirmed(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-dark-700 border border-dark-600 text-slate-400 hover:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                  <a
                    href="https://www.lavividhair.com/collections/men-hair-system/products/ares-men-s-non-surgical-hair-replacement-french-lace-with-skin-around-best-for-daily-wear"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    Order Ares Now <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/hair-analysis')}
            className="flex-1 py-3 bg-dark-800 border border-dark-700 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-sm"
          >
            Run Hair Analysis
          </button>
          <button
            onClick={() => navigate('/kb')}
            className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            Explore Knowledge Base <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const steps = [renderPhotoStep, renderLifestyleStep, renderBudgetStep, renderAnalyzingStep, renderResults];
  const stepLabels = ['Photo', 'Lifestyle', 'Budget', 'Analysis', 'Results'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {step < 4 && <StepIndicator current={step} total={stepLabels.length} />}
      {steps[step]?.()}
    </div>
  );
};

export default StyleAdvisorPage;
