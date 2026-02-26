import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const ModerationLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'blocked' | 'warned' | 'passed'>('all');

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'moderationLogs'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      if (filter !== 'all') {
        q = query(
          collection(db, 'moderationLogs'),
          where('action', '==', filter),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
      }

      const snapshot = await getDocs(q);
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const styles = {
      blocked: 'bg-red-500/10 text-red-500 border-red-500/20',
      warned: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      passed: 'bg-green-500/10 text-green-500 border-green-500/20'
    };
    return styles[action as keyof typeof styles] || styles.passed;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          to="/admin" 
          className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand-blue" />
          <div>
            <h1 className="text-2xl font-bold text-white">Moderation Logs</h1>
            <p className="text-slate-300 text-sm">Review content moderation history</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'blocked', 'warned', 'passed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              filter === f
                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                : 'bg-dark-800 border-dark-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading logs...</div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="bg-dark-800 border border-dark-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(log.result.severity)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{log.userName}</span>
                      <span className={`px-2 py-1 rounded text-xs border ${getActionBadge(log.action)}`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {log.timestamp?.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 uppercase">{log.moderationType}</span>
              </div>

              {log.title && (
                <h3 className="font-semibold text-white mb-2">{log.title}</h3>
              )}

              <p className="text-slate-300 text-sm mb-3 line-clamp-2">{log.content}</p>

              {log.result.issues.length > 0 && (
                <div className="bg-dark-900 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-red-400 mb-1">Issues:</p>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {log.result.issues.map((issue: string, idx: number) => (
                      <li key={idx}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {log.postId && (
                <Link 
                  to={`/forum/post/${log.postId}`}
                  className="text-xs text-brand-blue hover:underline"
                >
                  View post →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};