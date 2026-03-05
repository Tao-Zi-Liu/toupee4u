// pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Lock, User, ArrowRight, Zap, Loader,
  AlertCircle, CheckCircle2, Eye, EyeOff, Cpu
} from 'lucide-react';
import { registerUser, loginWithGoogle } from '../services/auth.service';

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Password Strength ─────────────────────────
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains uppercase', ok: /[A-Z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-dark-600'}`} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1.5 text-[10px] transition-colors ${c.ok ? 'text-emerald-400' : 'text-slate-600'}`}>
            <CheckCircle2 className={`w-3 h-3 ${c.ok ? 'text-emerald-400' : 'text-slate-700'}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────
export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreedToTerms) { setError('Please agree to the Terms of Service'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const displayName = `${formData.firstName} ${formData.lastName}`.trim();
      await registerUser(formData.email, formData.password, displayName);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(''); setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Success Screen ────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-dark-800 border border-dark-700 rounded-3xl p-10 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-slate-400 text-sm mb-1">
            We sent a verification link to
          </p>
          <p className="text-white font-bold mb-4">{formData.email}</p>
          <p className="text-slate-500 text-xs mb-6">
            Click the link in the email to activate your account. Check your spam folder if you don't see it.
          </p>
          <Link to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all">
            Go to Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Register Form ─────────────────────────
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl p-8 shadow-2xl relative z-10">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple mb-5 shadow-lg shadow-brand-blue/20 text-white">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Join the Community</h1>
          <p className="text-slate-400 text-sm">Create your free account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Google */}
        <button onClick={handleGoogleRegister} disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 bg-dark-900 border border-dark-600 hover:border-dark-500 hover:bg-dark-700 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-all mb-5 disabled:opacity-50">
          {googleLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-600" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-dark-800 px-3 text-xs text-slate-500">or register with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'firstName', label: 'First Name', placeholder: 'Alex', icon: true },
              { name: 'lastName',  label: 'Last Name',  placeholder: 'Mercer', icon: false },
            ].map(f => (
              <div key={f.name} className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">{f.label}</label>
                <div className="relative">
                  {f.icon && <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />}
                  <input type="text" name={f.name} required
                    value={formData[f.name as keyof typeof formData]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className={`w-full bg-dark-900 border border-dark-600 rounded-xl py-2.5 ${f.icon ? 'pl-9' : 'pl-3'} pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30`} />
                </div>
              </div>
            ))}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
              <input type={showPassword ? 'text' : 'password'} name="password" required
                value={formData.password} onChange={handleChange} placeholder="••••••••" minLength={6}
                className="w-full bg-dark-900 border border-dark-600 rounded-xl py-2.5 pl-9 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30" />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <PasswordStrength password={formData.password} />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-900 text-brand-blue focus:ring-brand-blue flex-shrink-0" />
            <span className="text-xs text-slate-400 leading-snug">
              I agree to the{' '}
              <Link to="/terms" className="text-white hover:underline font-semibold">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-white hover:underline font-semibold">Privacy Policy</Link>
            </span>
          </label>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-brand-blue to-brand-purple hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group">
            {loading
              ? <><Loader className="w-4 h-4 animate-spin" /> Creating account...</>
              : <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
            }
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already a member?{' '}
          <Link to="/login" className="text-brand-blue font-bold hover:text-white transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
