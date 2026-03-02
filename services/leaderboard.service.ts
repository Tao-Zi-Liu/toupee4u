// services/leaderboard.service.ts
import {
  collection, query, orderBy, limit, getDocs,
  where, Timestamp
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { LeaderboardEntry } from '../types';

export type LeaderboardPeriod = 'all' | 'week' | 'month';

/**
 * 获取总XP排行榜（从 userXpStats 集合）
 */
async function getAllTimeLeaderboard(topN: number): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, 'userXpStats'),
    orderBy('totalXp', 'desc'),
    limit(topN)
  );
  const snapshot = await getDocs(q);

  const entries: LeaderboardEntry[] = [];
  let rank = 1;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    // 从 users 集合补充 displayName / photoURL / galaxyLevel
    const profile = await getUserProfile(doc.id);
    entries.push({
      userId: doc.id,
      displayName: profile.displayName || 'Anonymous',
      photoURL: profile.photoURL || '',
      galaxyLevel: profile.galaxyLevel || 'NEBULA',
      xp: data.totalXp ?? 0,
      rank: rank++,
    });
  }
  return entries;
}

/**
 * 获取周/月XP排行榜（从 xpRecords 集合聚合）
 */
async function getPeriodLeaderboard(
  period: 'week' | 'month',
  topN: number
): Promise<LeaderboardEntry[]> {
  const now = new Date();
  const startDate = new Date();
  if (period === 'week') {
    startDate.setDate(now.getDate() - 7);
  } else {
    startDate.setDate(1); // 本月第一天
    startDate.setHours(0, 0, 0, 0);
  }

  const q = query(
    collection(db, 'xpRecords'),
    where('createdAt', '>=', Timestamp.fromDate(startDate)),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  // 聚合每个用户的XP总量
  const userXpMap: Record<string, number> = {};
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.delta > 0) { // 只计正向XP
      userXpMap[data.userId] = (userXpMap[data.userId] ?? 0) + data.delta;
    }
  });

  // 排序取 Top N
  const sorted = Object.entries(userXpMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN);

  const entries: LeaderboardEntry[] = [];
  let rank = 1;
  for (const [userId, xp] of sorted) {
    const profile = await getUserProfile(userId);
    entries.push({
      userId,
      displayName: profile.displayName || 'Anonymous',
      photoURL: profile.photoURL || '',
      galaxyLevel: profile.galaxyLevel || 'NEBULA',
      xp,
      rank: rank++,
    });
  }
  return entries;
}

/**
 * 统一入口
 */
export async function getLeaderboard(
  period: LeaderboardPeriod,
  topN = 10
): Promise<LeaderboardEntry[]> {
  try {
    if (period === 'all') return await getAllTimeLeaderboard(topN);
    return await getPeriodLeaderboard(period, topN);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return [];
  }
}

/**
 * 从 users 集合获取用户基本信息
 */
async function getUserProfile(userId: string): Promise<{
  displayName: string;
  photoURL: string;
  galaxyLevel: string;
}> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        displayName: data.displayName || 'Anonymous',
        photoURL: data.photoURL || '',
        galaxyLevel: data.galaxyLevel || 'NEBULA',
      };
    }
  } catch (e) {
    // 静默失败
  }
  return { displayName: 'Anonymous', photoURL: '', galaxyLevel: 'NEBULA' };
}
