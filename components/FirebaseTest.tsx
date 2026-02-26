// components/FirebaseTest.tsx
import React, { useState } from 'react';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../services/auth.service';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testRegister = async () => {
    setStatus('loading');
    setMessage('Testing registration...');

    try {
      const testEmail = `test${Date.now()}@toupee4u.com`;
      const testPassword = 'test123456';
      const testName = 'Test User';

      const user = await registerUser(testEmail, testPassword, testName);
      
      setStatus('success');
      setMessage(`✅ Registration successful!\nUser: ${user.displayName}\nEmail: ${user.email}`);
      
      // Auto logout after 3 seconds
      setTimeout(async () => {
        await logoutUser();
        setMessage('✅ Test complete. User logged out.');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Registration failed: ${error.message}`);
    }
  };

  const testCurrentUser = () => {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      setStatus('success');
      setMessage(`✅ Current user:\n${currentUser.email}\nUID: ${currentUser.uid}`);
    } else {
      setStatus('idle');
      setMessage('No user currently logged in');
    }
  };

  const testLogout = async () => {
    setStatus('loading');
    setMessage('Testing logout...');

    try {
      await logoutUser();
      setStatus('success');
      setMessage('✅ Logout successful!');
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Logout failed: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">🔥 Firebase Test</h3>
        {status === 'loading' && <Loader className="w-4 h-4 animate-spin text-blue-400" />}
        {status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
        {status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testRegister}
          disabled={status === 'loading'}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all"
        >
          Test Registration
        </button>

        <button
          onClick={testCurrentUser}
          disabled={status === 'loading'}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all"
        >
          Check Current User
        </button>

        <button
          onClick={testLogout}
          disabled={status === 'loading'}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white text-sm font-semibold py-2 px-3 rounded-lg transition-all"
        >
          Test Logout
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
          status === 'success' ? 'bg-green-500/10 text-green-300' :
          status === 'error' ? 'bg-red-500/10 text-red-300' :
          'bg-slate-500/10 text-slate-300'
        }`}>
          {message}
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3">
        Open browser console (F12) for detailed logs
      </p>
    </div>
  );
};