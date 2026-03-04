// pages/ExpertApplyPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle, ChevronRight, ChevronLeft, Upload, X,
  Scissors, Store, Truck, User, Briefcase,
  Award, MapPin, Clock, Zap, Star, AlertCircle,
  FileText, Camera, Loader
} from 'lucide-react';
import { getCurrentUser } from '../services/auth.service';
import { getMyApplication, submitExpertApplicationStep1, submitExpertApplicationStep2 } from '../services/expert.service';
import { getEnabledCountries, getEnabledCities } from '../services/region.service';
import { uploadImage } from '../services/image.service';
import {
  ExpertType, ExpertSpecialty, ConsultationMode,
  EXPERT_TYPE_LABELS, EXPERT_SPECIALTY_LABELS,
  ExpertApplication
} from '../types';

// ── 常量 ──────────────────────────────────────


const EXPERT_TYPES: { value: ExpertType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'SALON_OWNER',       label: 'Salon Owner',          icon: Store,    desc: 'Operate a hair salon or studio' },
  { value: 'STYLIST',           label: 'Hair Stylist',         icon: Scissors, desc: 'Licensed hair professional' },
  { value: 'MANUFACTURER_REP',  label: 'Manufacturer Rep',     icon: Briefcase,desc: 'Represent a hair system brand' },
  { value: 'DISTRIBUTOR',       label: 'Distributor',          icon: Truck,    desc: 'Distribute hair system products' },
  { value: 'INDEPENDENT',       label: 'Independent Pro',      icon: User,     desc: 'Freelance or independent expert' },
  { value: 'OTHERS',            label: 'Others',               icon: Briefcase,desc: 'Other hair industry professional' },
];

const SPECIALTIES: { value: ExpertSpecialty; label: string }[] = [
  { value: 'LACE_SYSTEMS',    label: 'Lace Systems' },
  { value: 'POLY_SKIN',       label: 'Poly Skin' },
  { value: 'MONO_BASE',       label: 'Mono Base' },
  { value: 'ADHESIVES',       label: 'Adhesives & Bonding' },
  { value: 'MAINTENANCE',     label: 'Maintenance & Care' },
  { value: 'COLORING',        label: 'Coloring & Dyeing' },
  { value: 'CUSTOM_CUTTING',  label: 'Custom Cutting' },
  { value: 'SCALP_CARE',      label: 'Scalp Care' },
  { value: 'INJECTION_TYING', label: 'Injection / Hand-tied' },
];

const CONSULTATION_MODES: { value: ConsultationMode; label: string; desc: string }[] = [
  { value: 'VIDEO',      label: 'Video Call',    desc: 'Zoom / Google Meet' },
  { value: 'VOICE',      label: 'Voice Call',    desc: 'Phone consultation' },
  { value: 'TEXT',       label: 'Text Chat',     desc: 'In-platform messaging' },
  { value: 'IN_PERSON',  label: 'In-Person',     desc: 'Client visits your location' },
];

// ── 主组件 ────────────────────────────────────

export const ExpertApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApp, setExistingApp] = useState<ExpertApplication | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Step 1 fields
  const [expertType, setExpertType] = useState<ExpertType | "OTHERS" | "">("");
  const [otherExpertType, setOtherExpertType] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [serviceCity, setServiceCity] = useState('');
  const [serviceCountry, setServiceCountry] = useState('');
  const [specialties, setSpecialties] = useState<ExpertSpecialty[]>([]);
  const [bio, setBio] = useState('');
  const [credentials, setCredentials] = useState('');
  const [consultationModes, setConsultationModes] = useState<ConsultationMode[]>([]);

  // Step 2 fields
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [sampleTitle, setSampleTitle] = useState('');
  const [sampleContent, setSampleContent] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // ── 初始化 ────────────────────────────────
  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    getMyApplication(currentUser.uid).then(app => {
      if (app) {
        setExistingApp(app);
        // 回填数据
        setExpertType((app as any).expertType || '');
        setOtherExpertType((app as any).otherExpertType || '');
        setYearsOfExperience(String(app.yearsOfExperience || ''));
        setServiceCity(app.serviceCity || '');
        setServiceCountry(app.serviceCountry || '');
        if (app.serviceCountry) {
          setAvailableCities(getEnabledCities(app.serviceCountry));
        }
        setSpecialties(app.specialties || []);
        setBio(app.bio || '');
        setCredentials(app.credentials || '');
        setConsultationModes(app.consultationModes || []);
        setPortfolioImages(app.portfolioImages || []);
        setSampleTitle(app.sampleArticleTitle || '');
        setSampleContent(app.sampleArticleContent || '');

        // 决定显示哪一步
        if (app.status === 'STEP2' || app.status === 'REVIEWING' || app.status === 'APPROVED') {
          setStep(2);
        }
        if (app.status === 'APPROVED' || app.status === 'REVIEWING') {
          setSubmitted(true);
        }
      }
      setLoading(false);
    });
  }, []);

  // ── 验证 ──────────────────────────────────
  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!expertType) e.expertType = 'Please select your professional type';
    if (expertType === 'OTHERS' && !otherExpertType.trim()) e.otherType = 'Please describe your profession';
    if (!yearsOfExperience || isNaN(Number(yearsOfExperience))) e.years = 'Enter valid years';
    if (!serviceCity.trim()) e.city = 'Enter your city';
    if (!serviceCountry.trim()) e.country = 'Enter your country';
    if (specialties.length === 0) e.specialties = 'Select at least one specialty';
    if (bio.trim().length < 50) e.bio = 'Bio must be at least 50 characters';
    if (consultationModes.length === 0) e.modes = 'Select at least one consultation mode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (portfolioImages.length < 2) e.portfolio = 'Upload at least 2 portfolio images';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── 第一步提交 ────────────────────────────
  const handleStep1Submit = async () => {
    if (!validateStep1() || !currentUser) return;
    setSubmitting(true);
    try {
      const appId = await submitExpertApplicationStep1(currentUser.uid, {
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        expertType: expertType as ExpertType,
        ...(expertType === 'OTHERS' ? { otherExpertType } : {}),
        yearsOfExperience: Number(yearsOfExperience),
        serviceCity,
        serviceCountry,
        specialties,
        bio,
        credentials,
        consultationModes,
        sampleArticleTitle: '',
        sampleArticleContent: '',
      });
      setExistingApp(prev => ({ ...prev, id: appId } as any));
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── 图片上传 ──────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !currentUser) return;
    if (portfolioImages.length + files.length > 8) {
      setErrors(prev => ({ ...prev, portfolio: 'Maximum 8 images allowed' }));
      return;
    }
    setUploadingImages(true);
    try {
      const urls = await Promise.all(
        files.map(f => uploadImage(f, `expert-portfolio/${currentUser.uid}`))
      );
      setPortfolioImages(prev => [...prev, ...urls]);
      setErrors(prev => { const n = {...prev}; delete n.portfolio; return n; });
    } catch {
      setErrors(prev => ({ ...prev, portfolio: 'Upload failed, please try again' }));
    } finally {
      setUploadingImages(false);
    }
  };

  // ── 第二步提交 ────────────────────────────
  const handleStep2Submit = async () => {
    if (!validateStep2() || !existingApp?.id) return;
    setSubmitting(true);
    try {
      await submitExpertApplicationStep2(existingApp.id, portfolioImages, sampleTitle, sampleContent);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSpecialty = (s: ExpertSpecialty) => {
    setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };
  const toggleMode = (m: ConsultationMode) => {
    setConsultationModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  // ── 加载中 ────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
  );

  // ── 已提交成功 ────────────────────────────
  if (submitted) return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6 px-4">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>
      <h1 className="text-3xl font-bold text-white">Application Submitted</h1>
      <p className="text-slate-400 leading-relaxed">
        Your expert application is under review. We typically respond within 3-5 business days. 
        You'll receive a notification once a decision is made.
      </p>
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 text-left space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">What happens next</p>
        {[
          'Our team reviews your portfolio and sample work',
          'We may reach out with follow-up questions',
          'Upon approval, your Expert profile goes live',
          'You gain access to the Expert Dashboard',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-brand-blue">{i + 1}</span>
            </div>
            <p className="text-sm text-slate-300">{s}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/forum')} className="px-8 py-3 bg-dark-800 border border-dark-700 text-white font-bold rounded-xl hover:bg-dark-700 transition-all">
        Back to Community
      </button>
    </div>
  );

  // ── 主渲染 ────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-bold">
          <Star className="w-4 h-4" /> Expert Program
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Become a Verified Expert</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Share your professional knowledge, build your reputation, and earn from consultations.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 max-w-xs mx-auto">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 flex-1 ${s < step ? 'opacity-100' : s === step ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                s < step ? 'bg-emerald-500 text-white' :
                s === step ? 'bg-brand-blue text-white' :
                'bg-dark-700 text-slate-500'
              }`}>
                {s < step ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-semibold ${s === step ? 'text-white' : 'text-slate-500'}`}>
                {s === 1 ? 'Profile' : 'Portfolio'}
              </span>
            </div>
            {s < 2 && <div className={`flex-1 h-px ${step > 1 ? 'bg-emerald-500' : 'bg-dark-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="space-y-6">

          {/* Professional Type */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-brand-blue" /> Professional Type
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {EXPERT_TYPES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => { setExpertType(value); setErrors(p => { const n={...p}; delete n.expertType; return n; }); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    expertType === value
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-dark-600 hover:border-dark-500 bg-dark-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${expertType === value ? 'text-brand-blue' : 'text-slate-500'}`} />
                  <p className={`text-sm font-bold ${expertType === value ? 'text-white' : 'text-slate-300'}`}>{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            {errors.expertType && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.expertType}</p>}
            {expertType === 'OTHERS' && (
              <div className="mt-2">
                <input
                  value={otherExpertType}
                  onChange={e => { setOtherExpertType(e.target.value); setErrors(p => { const n={...p}; delete n.otherType; return n; }); }}
                  placeholder="Describe your profession (e.g. Wig artist, Hair educator...)"
                  className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm"
                />
                {errors.otherType && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.otherType}</p>}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-blue" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Years of Experience</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="number" min="0" max="50"
                    value={yearsOfExperience}
                    onChange={e => { setYearsOfExperience(e.target.value); setErrors(p => { const n={...p}; delete n.years; return n; }); }}
                    placeholder="e.g. 8"
                    className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none text-sm"
                  />
                </div>
                {errors.years && <p className="text-red-400 text-xs mt-1">{errors.years}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Country</label>
                <select
                  value={serviceCountry}
                  onChange={e => {
                    const country = e.target.value;
                    setServiceCountry(country);
                    setServiceCity('');
                    setErrors(p => { const n={...p}; delete n.country; return n; });
                    if (country) {
                      const cities = getEnabledCities(country);
                      setAvailableCities(cities);
                    } else {
                      setAvailableCities([]);
                    }
                  }}
                  className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white focus:outline-none text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-slate-600">Select country...</option>
                  {getEnabledCountries().map(c => (
                    <option key={c.isoCode} value={c.isoCode} className="bg-dark-900">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">City</label>
                {loadingCities ? (
                  <div className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-slate-500 text-sm flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" /> Loading cities...
                  </div>
                ) : availableCities.length > 0 ? (
                  <select
                    value={serviceCity}
                    onChange={e => { setServiceCity(e.target.value); setErrors(p => { const n={...p}; delete n.city; return n; }); }}
                    className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white focus:outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-600">Select city...</option>
                    {availableCities.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
                  </select>
                ) : (
                  <input
                    value={serviceCity}
                    onChange={e => { setServiceCity(e.target.value); setErrors(p => { const n={...p}; delete n.city; return n; }); }}
                    placeholder={serviceCountry ? 'Enter your city' : 'Select a country first'}
                    disabled={!serviceCountry}
                    className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm disabled:opacity-40"
                  />
                )}
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-blue" /> Areas of Expertise
            </h2>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleSpecialty(value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    specialties.includes(value)
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-dark-900 text-slate-400 border-dark-600 hover:border-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.specialties && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.specialties}</p>}
          </div>

          {/* Bio & Credentials */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-brand-blue" /> About You
            </h2>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Professional Bio <span className="text-slate-600 normal-case font-normal">({bio.length}/500)</span>
              </label>
              <textarea
                value={bio}
                onChange={e => { setBio(e.target.value.slice(0, 500)); setErrors(p => { const n={...p}; delete n.bio; return n; }); }}
                placeholder="Describe your background, experience, and what makes you an expert in hair systems..."
                rows={4}
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm resize-none"
              />
              {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Credentials & Certifications <span className="text-slate-600 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={credentials}
                onChange={e => setCredentials(e.target.value.slice(0, 300))}
                placeholder="List any relevant licenses, certifications, or professional affiliations..."
                rows={3}
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm resize-none"
              />
            </div>
          </div>

          {/* Consultation Modes */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-blue" /> Consultation Methods
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CONSULTATION_MODES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => toggleMode(value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    consultationModes.includes(value)
                      ? 'border-brand-blue bg-brand-blue/10'
                      : 'border-dark-600 hover:border-dark-500 bg-dark-900'
                  }`}
                >
                  <p className={`text-sm font-bold ${consultationModes.includes(value) ? 'text-white' : 'text-slate-300'}`}>{label}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </button>
              ))}
            </div>
            {errors.modes && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.modes}</p>}
          </div>

          <button
            onClick={handleStep1Submit}
            disabled={submitting}
            className="w-full py-4 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <>Continue to Portfolio <ChevronRight className="w-5 h-5" /></>}
          </button>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="space-y-6">

          {/* Step 1 complete banner */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Profile information saved</p>
              <p className="text-xs text-slate-400">Now showcase your work to complete the application</p>
            </div>
            <button onClick={() => setStep(1)} className="ml-auto text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Edit
            </button>
          </div>

          {/* Portfolio images */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-blue" /> Work Portfolio
              </h2>
              <span className="text-xs text-slate-500">{portfolioImages.length}/8 images</span>
            </div>
            <p className="text-sm text-slate-400">Upload photos of your work — before/after transformations, salon environment, product applications.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {portfolioImages.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPortfolioImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              {portfolioImages.length < 8 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImages}
                  className="aspect-square rounded-xl border-2 border-dashed border-dark-600 hover:border-brand-blue flex flex-col items-center justify-center gap-2 transition-all group bg-dark-900"
                >
                  {uploadingImages
                    ? <Loader className="w-6 h-6 text-brand-blue animate-spin" />
                    : <>
                        <Upload className="w-6 h-6 text-slate-600 group-hover:text-brand-blue transition-colors" />
                        <span className="text-xs text-slate-600 group-hover:text-brand-blue">Upload</span>
                      </>
                  }
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            {errors.portfolio && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.portfolio}</p>}
          </div>

          {/* Sample article (optional) */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-blue" /> Sample Article
              <span className="text-xs text-slate-500 font-normal">(optional but recommended)</span>
            </h2>
            <p className="text-sm text-slate-400">Write a short article demonstrating your expertise. This helps reviewers evaluate your knowledge and writing style.</p>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Article Title</label>
              <input
                value={sampleTitle}
                onChange={e => setSampleTitle(e.target.value)}
                placeholder="e.g. How to Choose the Right Adhesive for Your Skin Type"
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Article Content <span className="text-slate-600 normal-case font-normal">({sampleContent.length} chars)</span>
              </label>
              <textarea
                value={sampleContent}
                onChange={e => setSampleContent(e.target.value)}
                placeholder="Write your sample article here. Aim for 300-800 words covering a specific topic in hair systems..."
                rows={10}
                className="w-full bg-dark-900 border border-dark-600 focus:border-brand-blue rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none text-sm resize-none font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-4 bg-dark-800 border border-dark-700 text-slate-300 font-bold rounded-xl hover:bg-dark-700 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleStep2Submit}
              disabled={submitting}
              className="flex-1 py-4 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {submitting ? <Loader className="w-5 h-5 animate-spin" /> : <>Submit Application <CheckCircle className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Gate 组件 ─────────────────────────────────

const GatePage: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc?: string;
  action: { label: string; to: string };
  tier?: boolean;
}> = ({ icon, title, desc, action, tier }) => (
  <div className="max-w-md mx-auto py-20 text-center space-y-5 px-4">
    <div className="w-20 h-20 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    {desc && <p className="text-slate-400">{desc}</p>}
    {tier && (
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <Star className="w-4 h-4 text-amber-400" />
        Nova · Galaxy · Supernova members only
      </div>
    )}
    <Link
      to={action.to}
      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl transition-all"
    >
      {action.label} <ChevronRight className="w-4 h-4" />
    </Link>
  </div>
);
