// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';

export type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light'; // 实际应用的主题
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'dark' | 'light') {
  document.documentElement.setAttribute('data-theme', resolved);
}

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // 计算并应用实际主题
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    applyTheme(resolved);

    // 监听系统主题变化
    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        const r = e.matches ? 'dark' : 'light';
        setResolvedTheme(r);
        applyTheme(r);
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // 保存到 Firestore（如果已登录）
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { theme: newTheme }, { merge: true });
      } catch (e) {
        console.warn('Failed to save theme preference:', e);
      }
    }
  };

  // 登录后从 Firestore 同步主题
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists() && snap.data().theme) {
            const savedTheme = snap.data().theme as ThemeMode;
            setThemeState(savedTheme);
            localStorage.setItem('theme', savedTheme);
          }
        } catch (e) {
          console.warn('Failed to load theme preference:', e);
        }
      }
    });
    return unsubscribe;
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
