// services/xp.service.ts
// 积分系统核心服务

import {
  doc, getDoc, setDoc, addDoc,
  collection, query, where, getDocs,
  serverTimestamp, increment
} from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  XPActionType,
  XPRecord,
  UserXPStats,
  XP_RULES,
  XP_DAILY_LIMITS,
  XP_POST_THRESHOLD,
  XP_FREEZE_DAYS,
  XP_ZOMBIE_CHECKIN_DAYS,
} from '../types';


// ── 工具函数 ─────────────────────────────────
function todayStr(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysDiff(dateStr: string): number {
  const past = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
}

// ── 初始化用户XP Stats（注册时调用）──────────
export async function initUserXPStats(userId: string): Promise<void> {
  const ref = doc(db, 'userXpStats', userId);
  const snap = await getDoc(ref);
  if (snap.exists()) return;

  const initial: UserXPStats = {
    userId,
    totalXp: 0,
    availableXp: 0,
    consecutiveCheckinDays: 0,
    dailyXpLog: { date: todayStr() },
    isFrozen: false,
    canPost: false,
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, initial);
}

// ── 获取用户XP Stats ──────────────────────────
export async function getUserXPStats(userId: string): Promise<UserXPStats | null> {
  try {
    const ref = doc(db, 'userXpStats', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as UserXPStats;
  } catch (error) {
    console.error('Failed to get XP stats:', error);
    return null;
  }
}

// ── 核心：增加/扣减积分 ───────────────────────
export async function awardXP(
  userId: string,
  action: XPActionType,
  targetId?: string
): Promise<{ success: boolean; delta: number; reason?: string }> {
  try {
    const statsRef = doc(db, 'userXpStats', userId);
    const snap = await getDoc(statsRef);

    if (!snap.exists()) {
      await initUserXPStats(userId);
    }

    const stats = (snap.exists() ? snap.data() : {
      totalXp: 0,
      availableXp: 0,
      consecutiveCheckinDays: 0,
      dailyXpLog: { date: todayStr() },
      isFrozen: false,
      canPost: false,
    }) as UserXPStats;

    const today = todayStr();
    const baseDelta = XP_RULES[action];

    // ── 检查积分冻结 ──
    if (stats.isFrozen && baseDelta > 0) {
      return { success: false, delta: 0, reason: 'XP is frozen due to inactivity' };
    }

    // ── 每日上限检查 ──
    const dailyLog = stats.dailyXpLog?.date === today ? stats.dailyXpLog : { date: today };
    const dailyLimit = XP_DAILY_LIMITS[action];

    if (dailyLimit !== undefined && baseDelta > 0) {
      const earned = (dailyLog as any)[action] || 0;
      if (earned >= dailyLimit) {
        return { success: false, delta: 0, reason: `Daily limit reached for ${action}` };
      }
    }

    // ── 签到：检查僵尸签到 ──
    if (action === 'DAILY_CHECKIN') {
      // 今天已签到
      if (stats.lastCheckinDate === today) {
        return { success: false, delta: 0, reason: 'Already checked in today' };
      }

      // 检查连续无互动天数
      if (stats.lastInteractionDate) {
        const daysSinceInteraction = daysDiff(stats.lastInteractionDate);
        if (daysSinceInteraction >= XP_ZOMBIE_CHECKIN_DAYS) {
          // 僵尸签到，不得分，但仍记录签到日期
          await setDoc(statsRef, {
            lastCheckinDate: today,
            updatedAt: serverTimestamp(),
          }, { merge: true });
          return { success: false, delta: 0, reason: 'Zombie checkin: no interaction in 3+ days' };
        }
      }
    }

    // ── 重复浏览检查（同一篇帖子只计一次）──
    if (action === 'VIEW_POST' && targetId) {
      const existingQ = query(
        collection(db, 'xpRecords'),
        where('userId', '==', userId),
        where('action', '==', 'VIEW_POST'),
        where('targetId', '==', targetId)
      );
      const existing = await getDocs(existingQ);
      if (!existing.empty) {
        return { success: false, delta: 0, reason: 'Already viewed this post' };
      }
    }

    // ── 计算实际delta（考虑每日上限）──
    let actualDelta = baseDelta;
    if (dailyLimit !== undefined && baseDelta > 0) {
      const earned = (dailyLog as any)[action] || 0;
      actualDelta = Math.min(baseDelta, dailyLimit - earned);
    }

    // ── 写入XP记录 ──
    // targetId 可能为 undefined，Firestore 不接受 undefined 字段
    const record: Record<string, any> = {
      userId,
      action,
      delta: actualDelta,
      createdAt: serverTimestamp(),
    };
    if (targetId !== undefined) record.targetId = targetId;
    await addDoc(collection(db, 'xpRecords'), record);

    // ── 更新用户XP Stats ──
    const newTotal = (stats.totalXp || 0) + actualDelta;
    const newAvailable = Math.max(0, (stats.availableXp || 0) + actualDelta);
    const newCanPost = newAvailable >= XP_POST_THRESHOLD;

    // 更新每日log
    const updatedDailyLog = { ...dailyLog, date: today };
    if (baseDelta > 0 && dailyLimit !== undefined) {
      (updatedDailyLog as any)[action] = ((updatedDailyLog as any)[action] || 0) + actualDelta;
    }

    // 更新互动日期（签到以外的行为才算互动）
    const isInteraction = ['LIKE_POST', 'COMMENT', 'READ_KB_ARTICLE', 'VIEW_POST'].includes(action);

    const updateData: Partial<UserXPStats> & { updatedAt: any } = {
      totalXp: newTotal,
      availableXp: newAvailable,
      canPost: newCanPost,
      dailyXpLog: updatedDailyLog,
      isFrozen: false,
      lastActiveDate: today,
      updatedAt: serverTimestamp(),
    };

    if (action === 'DAILY_CHECKIN') {
      const isConsecutive = stats.lastCheckinDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      updateData.lastCheckinDate = today;
      updateData.consecutiveCheckinDays = isConsecutive ? (stats.consecutiveCheckinDays || 0) + 1 : 1;
    }

    if (isInteraction) {
      updateData.lastInteractionDate = today;
    }

    // 同步更新 users collection 的 xp 字段
    await setDoc(doc(db, 'users', userId), { xp: newTotal }, { merge: true });
    await setDoc(statsRef, updateData, { merge: true });

    return { success: true, delta: actualDelta };
  } catch (error) {
    console.error('Failed to award XP:', error);
    return { success: false, delta: 0, reason: 'Server error' };
  }
}

// ── 检查是否可以发帖 ──────────────────────────
export async function canUserPost(userId: string): Promise<{
  canPost: boolean;
  currentXP: number;
  needed: number;
  reason?: string;
}> {
  const stats = await getUserXPStats(userId);
  if (!stats) {
    return { canPost: false, currentXP: 0, needed: XP_POST_THRESHOLD };
  }

  if (stats.isFrozen) {
    return {
      canPost: false,
      currentXP: stats.availableXp,
      needed: XP_POST_THRESHOLD,
      reason: 'Your XP is frozen. Please re-engage with the community.'
    };
  }

  return {
    canPost: stats.availableXp >= XP_POST_THRESHOLD,
    currentXP: stats.availableXp,
    needed: XP_POST_THRESHOLD,
  };
}

// ── 每日签到 ──────────────────────────────────
export async function dailyCheckin(userId: string): Promise<{
  success: boolean;
  xpEarned: number;
  consecutiveDays: number;
  isZombie: boolean;
}> {
  const result = await awardXP(userId, 'DAILY_CHECKIN');
  const stats = await getUserXPStats(userId);

  return {
    success: result.success,
    xpEarned: result.delta,
    consecutiveDays: stats?.consecutiveCheckinDays || 0,
    isZombie: result.reason === 'Zombie checkin: no interaction in 3+ days',
  };
}

// ── 检查积分冻结状态 ──────────────────────────
export async function checkAndUpdateFreezeStatus(userId: string): Promise<boolean> {
  try {
    const stats = await getUserXPStats(userId);
    if (!stats || !stats.lastActiveDate) return false;

    const daysSinceActive = daysDiff(stats.lastActiveDate);
    const shouldFreeze = daysSinceActive >= XP_FREEZE_DAYS;

    if (shouldFreeze !== stats.isFrozen) {
      await setDoc(doc(db, 'userXpStats', userId), {
        isFrozen: shouldFreeze,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    return shouldFreeze;
  } catch (error) {
    console.error('Failed to check freeze status:', error);
    return false;
  }
}

// ── 获取XP历史记录 ────────────────────────────
export async function getXPHistory(userId: string, limit = 20): Promise<XPRecord[]> {
  try {
    const q = query(
      collection(db, 'xpRecords'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as XPRecord))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get XP history:', error);
    return [];
  }
}

// ── 检查折扣资格 ──────────────────────────────
export async function checkDiscountEligibility(userId: string): Promise<{
  novaDiscount: boolean;
  galaxyDiscount: boolean;
  novaDiscountUsed: boolean;
  galaxyDiscountUsed: boolean;
}> {
  const stats = await getUserXPStats(userId);
  if (!stats) return { novaDiscount: false, galaxyDiscount: false, novaDiscountUsed: false, galaxyDiscountUsed: false };

  return {
    novaDiscount: stats.totalXp >= 500 && !stats.discountUsed?.NOVA_HALF_PRICE,
    galaxyDiscount: stats.totalXp >= 2000 && !stats.discountUsed?.GALAXY_HALF_PRICE,
    novaDiscountUsed: !!stats.discountUsed?.NOVA_HALF_PRICE,
    galaxyDiscountUsed: !!stats.discountUsed?.GALAXY_HALF_PRICE,
  };
}

// ── 使用折扣 ──────────────────────────────────
export async function useDiscount(
  userId: string,
  type: 'NOVA_HALF_PRICE' | 'GALAXY_HALF_PRICE'
): Promise<boolean> {
  try {
    await setDoc(doc(db, 'userXpStats', userId), {
      [`discountUsed.${type}`]: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to use discount:', error);
    return false;
  }
}
