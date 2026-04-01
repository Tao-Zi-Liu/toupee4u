// hooks/useNewsArticles.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { NewsArticle } from '../types';

function normalizeArticle(d: any): NewsArticle {
  const data = d.data();
  if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate().toISOString();
  if (data.publishedAt?.toDate) data.publishedAt = data.publishedAt.toDate().toISOString();
  return { id: d.id, ...data } as NewsArticle;
}

// 今日文章
export function useTodayArticles() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'PUBLISHED'),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
        const snap = await getDocs(q);
        const all = snap.docs.map(normalizeArticle);
        console.log('Today:', today);
        console.log('Total fetched:', all.length);
        console.log('generatedDates:', all.slice(0, 5).map((a: any) => a.generatedDate));
        setArticles(all.filter((a: any) => a.generatedDate === today));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { articles, loading };
}

// 归档：获取有文章的日期列表（过去14天）
export function useArchiveDates() {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        const q = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'PUBLISHED'),
          orderBy('generatedDate', 'desc'),
          limit(200)
        );
        const snap = await getDocs(q);
        const allDates = snap.docs.map(d => d.data().generatedDate as string);
        const uniqueDates = [...new Set(allDates)]
          .filter(d => d && d < today)
          .sort((a, b) => b.localeCompare(a));
        setDates(uniqueDates);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { dates, loading };
}

// 归档：获取某天的文章
export function useArchiveArticles(date: string | null) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;
    const load = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'newsArticles'),
          where('status', '==', 'PUBLISHED'),
          where('generatedDate', '==', date),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        const snap = await getDocs(q);
        setArticles(snap.docs.map(normalizeArticle));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [date]);

  return { articles, loading };
}
