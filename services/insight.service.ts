// services/insight.service.ts
import { doc, getDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../firebase.config';

export interface DailyInsight {
  type: 'INDUSTRY_FACT' | 'CARE_TIP' | 'KB_HIGHLIGHT' | 'MOTIVATIONAL' | 'PERSONALIZED';
  text: string;
  emoji: string;
}

/**
 * 从 Firestore 获取今天的每日 Insight
 */
export async function getTodayInsights(): Promise<DailyInsight[]> {
  const today = new Date().toISOString().split('T')[0];
  try {
    const snap = await getDoc(doc(db, 'dailyInsights', today));
    if (snap.exists()) {
      return snap.data().insights as DailyInsight[];
    }
  } catch (err) {
    console.warn('Failed to load daily insights:', err);
  }
  return [];
}

/**
 * 调用 Cloud Function 生成个性化 Insight（需要登录）
 */
export async function getPersonalizedInsight(): Promise<DailyInsight | null> {
  try {
    const functions = getFunctions();
    const fn = httpsCallable(functions, 'generatePersonalizedInsight');
    const result: any = await fn();
    return result.data.insight as DailyInsight;
  } catch (err) {
    console.warn('Failed to generate personalized insight:', err);
    return null;
  }
}
