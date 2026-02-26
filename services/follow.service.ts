import {
  doc, setDoc, deleteDoc, getDoc,
  collection, getDocs, query, where,
  serverTimestamp, orderBy
} from 'firebase/firestore';
import { db } from '../firebase.config';

// ── 关注用户 ──────────────────────────────────
export async function followUser(
  currentUserId: string,
  targetUserId: string,
  targetUserName: string,
  targetUserAvatar: string
): Promise<void> {
  // 在当前用户的 following 集合中添加
  await setDoc(
    doc(db, 'users', currentUserId, 'following', targetUserId),
    {
      userId: targetUserId,
      displayName: targetUserName,
      photoURL: targetUserAvatar,
      followedAt: serverTimestamp()
    }
  );

  // 在目标用户的 followers 集合中添加
  await setDoc(
    doc(db, 'users', targetUserId, 'followers', currentUserId),
    {
      userId: currentUserId,
      followedAt: serverTimestamp()
    }
  );
}

// ── 取消关注 ──────────────────────────────────
export async function unfollowUser(
  currentUserId: string,
  targetUserId: string
): Promise<void> {
  await deleteDoc(doc(db, 'users', currentUserId, 'following', targetUserId));
  await deleteDoc(doc(db, 'users', targetUserId, 'followers', currentUserId));
}

// ── 检查是否已关注 ────────────────────────────
export async function checkIsFollowing(
  currentUserId: string,
  targetUserId: string
): Promise<boolean> {
  const snap = await getDoc(
    doc(db, 'users', currentUserId, 'following', targetUserId)
  );
  return snap.exists();
}

// ── 获取关注列表 ──────────────────────────────
export interface FollowUser {
  userId: string;
  displayName: string;
  photoURL: string;
  followedAt: any;
}

export async function getFollowing(userId: string): Promise<FollowUser[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users', userId, 'following'),
        orderBy('followedAt', 'desc')
      )
    );
    return snap.docs.map(d => ({ userId: d.id, ...d.data() } as FollowUser));
  } catch {
    return [];
  }
}

// ── 获取粉丝列表 ──────────────────────────────
export async function getFollowers(userId: string): Promise<FollowUser[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'users', userId, 'followers'),
        orderBy('followedAt', 'desc')
      )
    );
    return snap.docs.map(d => ({ userId: d.id, ...d.data() } as FollowUser));
  } catch {
    return [];
  }
}

// ── 获取关注数量 ──────────────────────────────
export async function getFollowCounts(userId: string): Promise<{
  followingCount: number;
  followersCount: number;
}> {
  try {
    const [followingSnap, followersSnap] = await Promise.all([
      getDocs(collection(db, 'users', userId, 'following')),
      getDocs(collection(db, 'users', userId, 'followers'))
    ]);
    return {
      followingCount: followingSnap.size,
      followersCount: followersSnap.size
    };
  } catch {
    return { followingCount: 0, followersCount: 0 };
  }
}

// ── 获取关注用户的最新帖子 Feed ───────────────
export async function getFollowingFeed(
  currentUserId: string
): Promise<string[]> {
  try {
    const followingSnap = await getDocs(
      collection(db, 'users', currentUserId, 'following')
    );
    return followingSnap.docs.map(d => d.id);
  } catch {
    return [];
  }
}