// pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail, Lock, ArrowRight, AlertCircle, Cpu,
  Terminal, RefreshCw, KeyRound, CheckCircle2
} from 'lucide-react';
import { loginUser, loginWithGoogle, sendPasswordReset, resendVerificationEmail } from '../services/auth.service';

interface LoginPageProps {
  isStaffTerminal?: boolean;
}

// Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

type Mode = 'login' | 'forgot' | 'resend';

export const LoginPage: React.FC<LoginPageProps> = ({ isStaffTerminal = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setInfo('✅ Email verified! You can now sign in.');
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    setIsLoading(true);
    try {
      await loginUser(email, password);
      if (isStaffTerminal) {
        localStorage.setItem('staff_session_token', 'authorized_master');
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setError('Please verify your email before signing in.');
        setMode('resend');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setInfo(`✅ Password reset email sent to ${email}. Check your inbox.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setInfo('');
    setIsLoading(true);
    try {
      await resendVerificationEmail(email, password);
      setInfo(`✅ Verification email resent to ${email}.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isStaff = isStaffTerminal;
  const accent = isStaff ? 'text-emerald-400 border-emerald-500/30' : 'text-brand-blue border-brand-blue/30';
  const inputClass = `w-full bg-dark-900 border rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none transition-all ${
    isStaff ? 'border-emerald-500/20 focus:border-emerald-400 font-mono' : 'border-dark-600 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/30'
  }`;

  return (
    <div className={`min-h-screen ${isStaff ? 'bg-black font-mono' : 'bg-dark-900'} flex items-center justify-center p-4 relative overflow-hidden`}>

      {/* Background */}
      {!isStaff ? (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/30 animate-pulse" />
        </div>
      )}

      <div className={`w-full max-w-md border rounded-3xl p-8 relative z-10 shadow-2xl ${
        isStaff
          ? 'bg-dark-950 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.08)]'
          : 'bg-dark-800 border-dark-700'
      }`}>

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-5 ${
            isStaff ? 'bg-dark-900 border-emerald-500/30 text-emerald-400' : 'bg-dark-900 border-dark-600 text-brand-blue'
          }`}>
            {isStaff ? <Terminal className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h1 className={`text-2xl font-bold mb-1 ${isStaff ? 'text-emerald-400 uppercase tracking-widest' : 'text-white'}`}>
            {mode === 'forgot' ? 'Reset Password' :
             mode === 'resend' ? 'Verify Email' :
             isStaff ? 'Staff Terminal' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-sm">
            {mode === 'forgot' ? "We'll send a reset link to your email" :
             mode === 'resend' ? 'Resend your verification email' :
             isStaff ? 'Root Directorate Authentication' : 'Sign in to your account'}
          </p>
        </div>

        {/* Info / Error */}
        {info && (
          <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2.5 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> {info}
          </div>
        )}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-sm text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* ── Login Form ── */}
        {mode === 'login' && (
          <>
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider ml-1 ${isStaff ? 'text-emerald-500/70' : 'text-slate-500'}`}>Email</label>
                <div className="relative group">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isStaff ? 'text-emerald-500/40' : 'text-slate-500 group-focus-within:text-brand-blue'}`} />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder={isStaff ? 'root@internal' : 'you@example.com'} className={inputClass} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between ml-1">
                  <label className={`text-[10px] font-bold uppercase tracking-wider ${isStaff ? 'text-emerald-500/70' : 'text-slate-500'}`}>Password</label>
                  {!isStaff && (
                    <button type="button" onClick={() => { setMode('forgot'); setError(''); setInfo(''); }}
                      className="text-[10px] font-bold text-brand-blue hover:text-white transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isStaff ? 'text-emerald-500/40' : 'text-slate-500 group-focus-within:text-brand-blue'}`} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                  isStaff ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-brand-blue hover:bg-blue-600 text-white'
                }`}>
                {isLoading
                  ? <><Cpu className="w-4 h-4 animate-spin" /> {isStaff ? 'Authenticating...' : 'Signing in...'}</>
                  : <>{isStaff ? 'AUTHORIZE' : 'Sign In'} <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* Google + Divider */}
            {!isStaff && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-600" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-dark-800 px-3 text-xs text-slate-500">or continue with</span>
                  </div>
                </div>

                <button onClick={handleGoogleLogin} disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-dark-900 border border-dark-600 hover:border-dark-500 hover:bg-dark-700 text-slate-300 hover:text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50">
                  {googleLoading ? <Cpu className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
                  {googleLoading ? 'Connecting...' : 'Continue with Google'}
                </button>

                <div className="mt-6 text-center text-sm text-slate-400">
                  No account?{' '}
                  <Link to="/register" className="text-brand-blue font-bold hover:text-white transition-colors">
                    Create one
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Forgot Password Form ── */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-blue transition-colors" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full font-bold py-3 bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-all flex items-center justify-center gap-2">
              {isLoading ? <><Cpu className="w-4 h-4 animate-spin" /> Sending...</> : <>Send Reset Email <ArrowRight className="w-4 h-4" /></>}
            </button>
            <button type="button" onClick={() => { setMode('login'); setError(''); setInfo(''); }}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* ── Resend Verification Form ── */}
        {mode === 'resend' && (
          <form onSubmit={handleResendVerification} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400">
              Check your inbox for a verification email. If you didn't receive it, enter your credentials below to resend.
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputClass} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider ml-1 text-slate-500">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputClass} />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full font-bold py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black rounded-xl transition-all flex items-center justify-center gap-2">
              {isLoading ? <><Cpu className="w-4 h-4 animate-spin" /> Sending...</> : <><RefreshCw className="w-4 h-4" /> Resend Verification Email</>}
            </button>
            <button type="button" onClick={() => { setMode('login'); setError(''); setInfo(''); }}
              className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors">
              ← Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
