import React from 'react';
import { CONSULTATIONS } from '../constants';
import { Video, Clock, CheckCircle } from 'lucide-react';

export const ConsultationsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-white mb-4">Expert Consultations</h1>
        <p className="text-slate-400 text-lg">
          The anxiety of hair replacement is personal. Get private, human reassurance from expert consultants who guarantee a response within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONSULTATIONS.map((consult) => (
          <div key={consult.id} className="bg-dark-800 rounded-xl shadow-sm border border-dark-700 p-6 flex flex-col hover:border-brand-blue transition-colors group">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-dark-900 text-slate-400 text-xs font-semibold rounded-full uppercase tracking-wide border border-dark-700 group-hover:text-white group-hover:border-slate-500 transition-colors">
                {consult.targetAudience}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{consult.title}</h3>
            <div className="flex items-center text-slate-500 text-sm mb-4">
                <Clock className="w-4 h-4 mr-1.5" />
                {consult.duration} via Zoom
            </div>
            <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
              {consult.description}
            </p>
            <div className="mt-auto pt-6 border-t border-dark-700 flex items-center justify-between">
              <span className="text-2xl font-bold text-white">${consult.price}</span>
              <button className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <Video className="w-4 h-4 mr-2" />
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-blue/10 rounded-xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-blue/20">
        <div>
            <h3 className="text-lg font-bold text-white mb-2">Not ready for a live call?</h3>
            <p className="text-brand-blue">Try our AI-powered "Truth Engine" for instant answers to common technical questions.</p>
        </div>
      </div>
    </div>
  );
};
