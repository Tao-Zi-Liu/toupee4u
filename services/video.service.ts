// services/video.service.ts
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  getDocs, query, where, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { VideoPost, VideoPlatform } from '../types';

// ── 平台解析 ──────────────────────────────────────────────────────────────────

export function detectPlatform(url: string): VideoPlatform | null {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return 'YOUTUBE';
  if (/youtube\.com\/shorts\//.test(url)) return 'YOUTUBE_SHORTS';
  if (/tiktok\.com/.test(url)) return 'TIKTOK';
  if (/instagram\.com\/(reel|p)\//.test(url)) return 'INSTAGRAM';
  if (/facebook\.com\/(watch|video|reel)/.test(url)) return 'FACEBOOK';
  return null;
}

export function extractVideoId(url: string, platform: VideoPlatform): string {
  try {
    switch (platform) {
      case 'YOUTUBE': {
        const u = new URL(url);
        return u.searchParams.get('v') || u.pathname.split('/').pop() || '';
      }
      case 'YOUTUBE_SHORTS': {
        const match = url.match(/shorts\/([^?/]+)/);
        return match?.[1] || '';
      }
      case 'TIKTOK': {
        const match = url.match(/video\/(\d+)/);
        return match?.[1] || '';
      }
      case 'INSTAGRAM': {
        const match = url.match(/\/(reel|p)\/([^/?]+)/);
        return match?.[2] || '';
      }
      case 'FACEBOOK': {
        const match = url.match(/\/(?:video|videos|watch)\/(?:\?v=)?(\d+)/);
        return match?.[1] || url;
      }
      default:
        return '';
    }
  } catch {
    return '';
  }
}

export function getThumbnail(platform: VideoPlatform, videoId: string): string {
  if (platform === 'YOUTUBE' || platform === 'YOUTUBE_SHORTS') {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

export function getEmbedUrl(platform: VideoPlatform, videoId: string): string {
  switch (platform) {
    case 'YOUTUBE':
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    case 'YOUTUBE_SHORTS':
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    case 'TIKTOK':
      return `https://www.tiktok.com/embed/v2/${videoId}`;
    case 'INSTAGRAM':
      return `https://www.instagram.com/p/${videoId}/embed/`;
    case 'FACEBOOK':
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/video/${videoId}`)}&show_text=0`;
    default:
      return '';
  }
}

// ── Firestore CRUD ────────────────────────────────────────────────────────────

export async function addVideo(data: Omit<VideoPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'videos'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateVideo(id: string, data: Partial<VideoPost>): Promise<void> {
  await updateDoc(doc(db, 'videos', id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteVideo(id: string): Promise<void> {
  await deleteDoc(doc(db, 'videos', id));
}

export async function getPublishedVideos(maxItems = 20): Promise<VideoPost[]> {
  const q = query(
    collection(db, 'videos'),
    where('status', '==', 'PUBLISHED'),
    orderBy('createdAt', 'desc'),
    limit(maxItems)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VideoPost));
}

export async function getAllVideos(): Promise<VideoPost[]> {
  const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VideoPost));
}
