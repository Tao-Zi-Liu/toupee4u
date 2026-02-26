// pages/VoyagerQuizPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader, CheckCircle } from 'lucide-react';
import { registerUser, updateVoyagerProfile } from '../services/auth.service';
import { HairPattern, ExperienceLevel, ActivityLevel } from '../types';

type QuizStep = 1 | 2 | 3 | 4;

interface QuizData {
  hairPattern?: HairPattern;
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
}

// 账户创建表单组件
const AccountForm: React.FC<{
  onSubmit: (email: string, password: string, displayName: string) => void;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 text-white px-4 py-3 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 text-white px-4 py-3 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 text-white px-4 py-3 rounded-lg focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none"
          placeholder="••••••••"
          minLength={6}
        />
        <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
      </div>

      <button
        type="button"
        onClick={() => onSubmit(email, password, displayName)}
        disabled={loading || !email || !password || !displayName}
        className="w-full bg-brand-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Join the Community
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export const VoyagerQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<QuizStep>(1);
  const [quizData, setQuizData] = useState<QuizData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccountSubmit = async (email: string, password: string, displayName: string) => {
    setError('');
    setLoading(true);

    try {
      const user = await registerUser(email, password, displayName, 'VOYAGER');

      if (quizData.hairPattern && quizData.experienceLevel && quizData.activityLevel) {
        await updateVoyagerProfile(user.userId, {
          hairPattern: quizData.hairPattern,
          experienceLevel: quizData.experienceLevel,
          activityLevel: quizData.activityLevel
        });
      }

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => {
    const patterns = [
      { id: 'FRONTAL_RECEDING', label: 'Frontal Receding', description: 'Hairline receding at temples' },
      { id: 'VERTEX', label: 'Vertex Thinning', description: 'Crown area thinning' },
      { id: 'FULL', label: 'Full Hair Loss', description: 'Complete baldness' },
      { id: 'DIFFUSE', label: 'Diffuse Thinning', description: 'Overall thinning' }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">What's Your Current Pattern?</h2>
          <p className="text-slate-400">Select the image that best matches your current hair situation</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {patterns.map((pattern) => (
            <button
              key={pattern.id}
              onClick={() => {
                setQuizData({ ...quizData, hairPattern: pattern.id as HairPattern });
                setCurrentStep(2);
              }}
              className="group relative p-6 bg-dark-800 border-2 border-dark-700 hover:border-brand-blue rounded-2xl transition-all hover:scale-105"
            >
              <div className="w-full aspect-square bg-dark-900 rounded-xl mb-4 flex items-center justify-center">
                <div className="text-6xl">👤</div>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">
                {pattern.label}
              </h3>
              <p className="text-sm text-slate-400">{pattern.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">What's Your Experience Level?</h2>
        <p className="text-slate-400">This helps us show you the right content</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[
          { id: 'NEWBIE', emoji: '🌱', title: "I'm New to This", desc: "I've never worn a hair system before and want to learn the basics" },
          { id: 'VETERAN', emoji: '🎯', title: "I'm Experienced", desc: "I've been wearing hair systems and want advanced tips" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setQuizData({ ...quizData, experienceLevel: item.id as ExperienceLevel });
              setCurrentStep(3);
            }}
            className="group p-8 bg-dark-800 border-2 border-dark-700 hover:border-brand-blue rounded-2xl transition-all hover:scale-105"
          >
            <div className="text-5xl mb-4">{item.emoji}</div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-3">What's Your Activity Level?</h2>
        <p className="text-slate-400">We'll recommend adhesives based on your lifestyle</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'LOW', emoji: '🚶', title: 'Low Activity', desc: 'Office work, minimal sweat' },
          { id: 'MEDIUM', emoji: '🏃', title: 'Moderate', desc: 'Regular exercise' },
          { id: 'HIGH', emoji: '🏋️', title: 'High Intensity', desc: 'Athlete, heavy sweating' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setQuizData({ ...quizData, activityLevel: item.id as ActivityLevel });
              setCurrentStep(4);
            }}
            className="group p-6 bg-dark-800 border-2 border-dark-700 hover:border-brand-blue rounded-2xl transition-all hover:scale-105"
          >
            <div className="text-4xl mb-3">{item.emoji}</div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">{item.title}</h3>
            <p className="text-xs text-slate-400">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-blue/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Your Profile is Ready!</h2>
        <p className="text-slate-400">Create your account to save your preferences</p>
        <div className="mt-6 p-4 bg-dark-800 rounded-xl border border-dark-700 inline-block">
          <div className="flex gap-2 text-sm">
            <span className="px-2 py-1 bg-brand-blue/20 text-brand-blue rounded">{quizData.hairPattern}</span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">{quizData.experienceLevel}</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">{quizData.activityLevel}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <AccountForm onSubmit={handleAccountSubmit} loading={loading} />
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Step {currentStep} of 4</span>
            <span className="text-sm text-slate-400">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-700 rounded-3xl p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={() => setCurrentStep((currentStep - 1) as QuizStep)}
            className="mt-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
    </div>
  );
};
