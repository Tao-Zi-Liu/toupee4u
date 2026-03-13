import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Bell, Search, Shield, LogOut, PanelLeftClose, PanelLeftOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_MS = 60 * 1000; // show warning 1 min before logout

export const AdminPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleTerminate = useCallback(() => {
    localStorage.removeItem('staff_session_token');
    localStorage.removeItem('toupee_auth');
    navigate('/');
  }, [navigate]);

  const clearAllTimers = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
  }, []);

  const startIdleTimer = useCallback(() => {
    clearAllTimers();
    setShowWarning(false);

    // Warning at 29 minutes
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(60);
      countdownInterval.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownInterval.current) clearInterval(countdownInterval.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, IDLE_TIMEOUT_MS - WARNING_MS);

    // Logout at 30 minutes
    idleTimer.current = setTimeout(() => {
      handleTerminate();
    }, IDLE_TIMEOUT_MS);
  }, [clearAllTimers, handleTerminate]);

  const resetTimer = useCallback(() => {
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    startIdleTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearAllTimers();
    };
  }, [resetTimer, startIdleTimer, clearAllTimers]);

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans selection:bg-emerald-500 selection:text-black">
      <AdminSidebar onLogout={handleTerminate} collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <header className="h-16 bg-black/80 backdrop-blur-md border-b border-dark-800 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(prev => !prev)}
              className="p-2 text-slate-500 hover:text-white hover:bg-dark-800 rounded-lg transition-all"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Root Directorate</span>
            </div>
            <div className="h-4 w-px bg-dark-700 hidden md:block" />
            <div className="hidden md:flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer text-xs gap-2">
              <Search className="w-4 h-4" />
              <span className="font-medium">Search system registry (⌘K)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">System Uptime</p>
                <p className="text-xs font-mono text-emerald-500">99.999%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Active Nodes</p>
                <p className="text-xs font-mono text-white">12/12</p>
              </div>
            </div>
            <button className="p-2 text-slate-500 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />
            </button>
            <button
              onClick={handleTerminate}
              className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-red-500 hover:bg-red-500/10 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12 overflow-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/[0.03] via-transparent to-transparent">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Idle Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-amber-500/40 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-amber-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Session Expiring</h3>
                <p className="text-slate-500 text-xs">Idle timeout detected</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-6">
              Your session will automatically terminate in{' '}
              <span className="text-amber-400 font-mono font-bold text-base">{countdown}s</span>{' '}
              due to inactivity.
            </p>
            <div className="flex gap-3">
              <button
                onClick={resetTimer}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold py-2.5 rounded-lg transition-colors"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleTerminate}
                className="flex-1 bg-dark-800 hover:bg-red-500/10 border border-dark-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-sm font-bold py-2.5 rounded-lg transition-colors"
              >
                Log Out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
