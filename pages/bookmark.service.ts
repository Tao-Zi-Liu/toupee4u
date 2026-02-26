import { collection, addDoc, deleteDoc, getDocs, query, where, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  postTitle: string;
  postExcerpt: string;
  postCategory: string;
  postAuthorName: string;
  postImages?: string[];
  createdAt: any;
}

export async function addBookmark(
  userId: string,
  postId: string,
  postTitle: string,
  postExcerpt: string,
  postCategory: string,
  postAuthorName: string,
  postImages?: string[]
): Promise<string> {
  try {
    const ref = await addDoc(collection(db, 'bookmarks'), {
      userId,
      postId,
      postTitle,
      postExcerpt,
      postCategory,
      postAuthorName,
      postImages: postImages || [],
      createdAt: serverTimestamp()
    });
    return ref.id;
  } catch (error) {
    console.error('Failed to add bookmark:', error);
    throw error;
  }
}

export async function removeBookmark(userId: string, postId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const snap = await getDocs(q);
    const deletes = snap.docs.map(d => deleteDoc(doc(db, 'bookmarks', d.id)));
    await Promise.all(deletes);
  } catch (error) {
    console.error('Failed to remove bookmark:', error);
    throw error;
  }
}

export async function checkBookmarked(userId: string, postId: string): Promise<boolean> {
  try {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId),
      where('postId', '==', postId)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  } catch {
    return false;
  }
}

export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  try {
    const q = query(
      collection(db, 'bookmarks'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Bookmark))
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
}
