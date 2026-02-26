// pages/ProfessionalSetupPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfessionalSetupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Professional Setup
        </h1>
        <p className="text-slate-400 mb-6">
          This feature is coming soon!
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
        >
          Use Standard Registration
        </button>
      </div>
    </div>
  );
};