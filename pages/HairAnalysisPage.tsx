import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera, Upload, Loader, CheckCircle, AlertCircle,
  RefreshCw, Save, ChevronDown, Eye, Palette,
  Activity, Scissors, Droplet, Sparkles, X, ZoomIn
} from 'lucide-react';
import { auth, db } from '../firebase.config';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import {
  HairAnalysisResult, HairAnalysisRecord,
  NorwoodScale, HairlineShape, ScalpCondition
} from '../types';

// ── Norwood 量表说明 ─────────────────────────
const NORWOOD_LABELS: Record<NorwoodScale, { label: string; color: string }> = {
  'I':     { label: 'Stage I — Normal',          color: 'text-emerald-400' },
  'II':    { label: 'Stage II — Slight Receding', color: 'text-green-400' },
  'III':   { label: 'Stage III — Noticeable',     color: 'text-yellow-400' },
  'III_V': { label: 'Stage III Vertex',           color: 'text-yellow-500' },
  'IV':    { label: 'Stage IV — Moderate',        color: 'text-orange-400' },
  'V':     { label: 'Stage V — Significant',      color: 'text-orange-500' },
  'VI':    { label: 'Stage VI — Severe',          color: 'text-red-400' },
  'VII':   { label: 'Stage VII — Extensive',      color: 'text-red-600' },
};

const HAIRLINE_LABELS: Record<HairlineShape, string> = {
  STRAIGHT:       'Straight',
  M_SHAPE:        'M-Shape Recession',
  U_SHAPE:        'U-Shape Recession',
  RECEDING_LEFT:  'Left-side Receding',
  RECEDING_RIGHT: 'Right-side Receding',
  NATURAL:        'Natural Arc',
};

const SCALP_LABELS: Record<ScalpCondition, { label: string; icon: string }> = {
  HEALTHY:   { label: 'Healthy',   icon: '✅' },
  OILY:      { label: 'Oily',      icon: '💧' },
  DRY:       { label: 'Dry',       icon: '🌵' },
  SENSITIVE: { label: 'Sensitive', icon: '⚡' },
  DANDRUFF:  { label: 'Dandruff',  icon: '❄️' },
};

// ── Gemini 分析调用 ───────────────────────────
async function analyzeHairWithGemini(base64Image: string, mimeType: string): Promise<HairAnalysisResult> {
  const prompt = `You are a professional hair and scalp analysis AI. Analyze this image and return a JSON object with the following fields:

{
  "hairColorHex": "#RRGGBB (the dominant hair color as hex)",
  "hairColorName": "descriptive color name in English",
  "hairColorCode": "international hair color code like 1N, 2N, 3N, 4N, 5N, 6N, 7N, 8N if determinable",
  "norwoodScale": "one of: I, II, III, III_V, IV, V, VI, VII",
  "norwoodDescription": "brief description of the hair loss stage observed",
  "alopeciaPercentage": number between 0-100,
  "hairlineShape": "one of: STRAIGHT, M_SHAPE, U_SHAPE, RECEDING_LEFT, RECEDING_RIGHT, NATURAL",
  "hairlineDescription": "brief description of the hairline shape",
  "scalpCondition": "one of: HEALTHY, OILY, DRY, SENSITIVE, DANDRUFF",
  "scalpNote": "brief observation about scalp condition",
  "recommendation": "2-3 sentence personalized recommendation for hair system products",
  "confidence": number between 0-1,
  "analysisNotes": "any caveats like poor lighting, angle, etc."
}

Be precise. If you cannot determine something reliably, use the closest match and note it in analysisNotes. Return ONLY the JSON object, no markdown, no explanation.`;

  const apiKey = "AIzaSyBOEps_kaRrHFl7oN22ZfzcqgGnzu74YpQ";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: base64Image } },
          { text: prompt }
        ]
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
    })
  });

  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as HairAnalysisResult;
}

// ── 主组件 ────────────────────────────────────
export const HairAnalysisPage: React.FC = () => {
  const [mode, setMode] = useState<'select' | 'camera' | 'upload' | 'analyzing' | 'result'>('select');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [result, setResult] = useState<HairAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 启动摄像头
  const startCamera = useCallback(async (facing: 'user' | 'environment' = 'environment') => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setMode('camera');
    } catch (e) {
      setError('Camera access denied. Please allow camera permissions or use photo upload.');
      setMode('select');
    }
  }, [stream]);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
  }, [stream]);

  // 拍照
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    setImageMime('image/jpeg');
    stopCamera();
    runAnalysis(dataUrl, 'image/jpeg');
  }, [stopCamera]);

  // 上传图片
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setCapturedImage(dataUrl);
      setImageMime(file.type);
      runAnalysis(dataUrl, file.type);
    };
    reader.readAsDataURL(file);
  }, []);

  // 运行分析
  const runAnalysis = async (dataUrl: string, mime: string) => {
    setMode('analyzing');
    setError(null);
    setSaved(false);
    try {
      const base64 = dataUrl.split(',')[1];
      const analysisResult = await analyzeHairWithGemini(base64, mime);
      setResult(analysisResult);
      setMode('result');
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please try again.');
      setMode('select');
    }
  };

  // 保存到 Firestore
  const saveToProfile = async () => {
    const user = auth.currentUser;
    if (!user || !result) return;
    setSaving(true);
    try {
      // 保存分析记录
      const record: Omit<HairAnalysisRecord, 'id'> = {
        userId: user.uid,
        result,
        inputMethod: capturedImage?.startsWith('data:') ? 'UPLOAD' : 'CAMERA',
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'hairAnalysisRecords'), record);

      // 更新用户档案的 hairProfile
      await setDoc(doc(db, 'users', user.uid), {
        hairProfile: {
          latestAnalysis: result,
          analysisCount: 1,
          lastAnalyzedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      }, { merge: true });

      setSaved(true);
    } catch (e) {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setSaved(false);
    setMode('select');
  };

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-brand-blue" />
            <span className="text-xs font-bold text-brand-blue uppercase tracking-widest">AI Hair Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Hair Profile Scanner</h1>
          <p className="text-slate-400 text-sm mt-1">AI-powered analysis of hair color, loss pattern, and scalp health</p>
        </div>
        {mode !== 'select' && (
          <button onClick={reset} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Mode: Select */}
      {mode === 'select' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => { setFacingMode('environment'); startCamera('environment'); }}
            className="group bg-dark-800 border border-dark-700 hover:border-brand-blue rounded-2xl p-8 flex flex-col items-center gap-4 transition-all hover:bg-dark-800/80"
          >
            <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors border border-brand-blue/20">
              <Camera className="w-8 h-8 text-brand-blue" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-white mb-1">Live Camera</h3>
              <p className="text-slate-500 text-sm">Use your camera for real-time scanning</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="group bg-dark-800 border border-dark-700 hover:border-brand-purple rounded-2xl p-8 flex flex-col items-center gap-4 transition-all hover:bg-dark-800/80"
          >
            <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors border border-brand-purple/20">
              <Upload className="w-8 h-8 text-brand-purple" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-white mb-1">Upload Photo</h3>
              <p className="text-slate-500 text-sm">Analyze an existing photo</p>
            </div>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

          {/* Tips */}
          <div className="md:col-span-2 bg-dark-800/50 border border-dark-700 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">📸 Tips for Best Results</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-500">
              {['Good natural lighting', 'Top-down angle', 'Hair dry & unstyled', 'Clear, focused image'].map(tip => (
                <div key={tip} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode: Camera */}
      {mode === 'camera' && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {/* Overlay guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-brand-blue/60 rounded-full border-dashed" />
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => {
                  const next = facingMode === 'user' ? 'environment' : 'user';
                  setFacingMode(next);
                  startCamera(next);
                }}
                className="p-3 bg-dark-800/80 backdrop-blur rounded-full border border-dark-700 text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={capturePhoto}
                className="px-8 py-3 bg-brand-blue text-white font-bold rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Camera className="w-5 h-5" /> Capture
              </button>
              <button
                onClick={() => { stopCamera(); setMode('select'); }}
                className="p-3 bg-dark-800/80 backdrop-blur rounded-full border border-dark-700 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <p className="text-center text-slate-500 text-sm">Position the top of your head within the circle</p>
        </div>
      )}

      {/* Mode: Analyzing */}
      {mode === 'analyzing' && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-12 flex flex-col items-center gap-6">
          {capturedImage && (
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-brand-blue/30">
              <img src={capturedImage} alt="Analyzing" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-dark-700 border-t-brand-blue rounded-full animate-spin" />
              <Sparkles className="w-6 h-6 text-brand-blue absolute inset-0 m-auto" />
            </div>
            <h3 className="text-white font-bold text-lg">Analyzing your hair...</h3>
            <div className="space-y-1 text-center">
              {['Detecting hair color', 'Assessing loss pattern', 'Evaluating hairline', 'Checking scalp health'].map((step, i) => (
                <p key={step} className="text-slate-500 text-sm" style={{ animationDelay: `${i * 0.5}s` }}>
                  {step}...
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mode: Result */}
      {mode === 'result' && result && (
        <div className="space-y-4">
          {/* Image + Color */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capturedImage && (
              <div className="relative rounded-2xl overflow-hidden aspect-square border border-dark-700 group">
                <img src={capturedImage} alt="Analysis" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            <div className={`${capturedImage ? 'md:col-span-2' : 'md:col-span-3'} space-y-3`}>
              {/* Hair Color */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl border-2 border-white/10 flex-shrink-0 shadow-lg"
                  style={{ backgroundColor: result.hairColorHex }}
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hair Color</span>
                  </div>
                  <h3 className="text-white font-bold text-lg">{result.hairColorName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-sm text-slate-300">{result.hairColorHex}</span>
                    {result.hairColorCode && (
                      <span className="px-2 py-0.5 bg-dark-700 rounded text-xs font-bold text-slate-300">
                        Code {result.hairColorCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Norwood Scale */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hair Loss Assessment</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold text-lg ${NORWOOD_LABELS[result.norwoodScale].color}`}>
                    {NORWOOD_LABELS[result.norwoodScale].label}
                  </span>
                  <span className="text-2xl font-bold text-white">{result.alopeciaPercentage}%</span>
                </div>
                {/* Progress bar */}
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${result.alopeciaPercentage}%`,
                      backgroundColor: result.alopeciaPercentage < 20 ? '#34d399'
                        : result.alopeciaPercentage < 50 ? '#fbbf24'
                        : '#f87171'
                    }}
                  />
                </div>
                <p className="text-slate-400 text-sm">{result.norwoodDescription}</p>
              </div>
            </div>
          </div>

          {/* Hairline + Scalp */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Scissors className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hairline Shape</span>
              </div>
              <h3 className="text-white font-bold mb-1">{HAIRLINE_LABELS[result.hairlineShape]}</h3>
              <p className="text-slate-400 text-sm">{result.hairlineDescription}</p>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Droplet className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scalp Condition</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{SCALP_LABELS[result.scalpCondition].icon}</span>
                <h3 className="text-white font-bold">{SCALP_LABELS[result.scalpCondition].label}</h3>
              </div>
              <p className="text-slate-400 text-sm">{result.scalpNote}</p>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-brand-blue" />
              <span className="text-sm font-bold text-brand-blue uppercase tracking-widest">AI Recommendation</span>
            </div>
            <p className="text-slate-200 leading-relaxed">{result.recommendation}</p>
            {result.analysisNotes && (
              <p className="text-slate-500 text-xs mt-3 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {result.analysisNotes}
              </p>
            )}
          </div>

          {/* Confidence */}
          <div className="flex items-center justify-between text-sm text-slate-500 px-1">
            <span>Analysis confidence: <span className="text-white font-bold">{Math.round(result.confidence * 100)}%</span></span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> Powered by Gemini AI
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {!saved ? (
              <button
                onClick={saveToProfile}
                disabled={saving || !auth.currentUser}
                className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save to My Profile'}
              </button>
            ) : (
              <div className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Saved to Profile
              </div>
            )}
            <button
              onClick={reset}
              className="px-6 py-3 bg-dark-800 border border-dark-700 text-slate-300 hover:text-white font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>

          {!auth.currentUser && (
            <p className="text-center text-slate-500 text-sm">
              <a href="#/login" className="text-brand-blue hover:underline">Sign in</a> to save your analysis to your profile
            </p>
          )}
        </div>
      )}
    </div>
  );
};
