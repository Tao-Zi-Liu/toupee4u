import {doc,setDoc,deleteDoc,getDoc,getDocs,collection,query,where,orderBy,serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  postTitle: string;
  postExcerpt: string;
  postAuthorName: string;
  postCategory: string;
  postImages?: string[];
  createdAt: any;
}

/**
 * 切换收藏状态
 */
export async function toggleBookmark(
  userId: string,
  postId: string,
  postData: {
    title: string;
    excerpt: string;
    authorName: string;
    category: string;
    images?: string[];
  }
): Promise<{ bookmarked: boolean }> {
  try {
    const bookmarkRef = doc(db, 'bookmarks', `${userId}_${postId}`);
    const bookmarkDoc = await getDoc(bookmarkRef);

    if (bookmarkDoc.exists()) {
      // 已收藏，取消收藏
      await deleteDoc(bookmarkRef);
      return { bookmarked: false };
    } else {
      // 未收藏，添加收藏
      await setDoc(bookmarkRef, {
        userId,
        postId,
        postTitle: postData.title,
        postExcerpt: postData.excerpt,
        postAuthorName: postData.authorName,
        postCategory: postData.category,
        postImages: postData.images || [],
        createdAt: serverTimestamp()
      });
      return { bookmarked: true };
    }
  } catch (error) {
    console.error('Failed to toggle bookmark:', error);
    throw error;
  }
}

/**
 * 检查是否已收藏
 */
export async function checkBookmarked(
  userId: string,
  postId: string
): Promise<boolean> {
  try {
    const bookmarkRef = doc(db, 'bookmarks', `${userId}_${postId}`);
    const bookmarkDoc = await getDoc(bookmarkRef);
    return bookmarkDoc.exists();
  } catch (error) {
    console.error('Failed to check bookmark:', error);
    return false;
  }
}

/**
 * 获取用户的收藏列表
 */
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const bookmarksQuery = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(bookmarksQuery);
    const bookmarks: Bookmark[] = [];

    snapshot.forEach((doc) => {
      bookmarks.push({
        id: doc.id,
        ...doc.data()
      } as Bookmark);
    });

    return bookmarks;
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}